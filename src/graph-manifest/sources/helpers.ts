import { queries, type Sablier } from "@sablier/deployments";
import { getGraphChainName } from "@src/chains";
import indexedContracts, { getIndexedContract } from "@src/contracts";
import { Errors } from "@src/errors";
import type { GraphManifest } from "@src/graph-manifest/types";
import { sanitizeName } from "@src/helpers";
import type { Indexed } from "@src/types";
import logger, { messages } from "@src/winston";
import _ from "lodash";
import ABIs from "./abi-entries";
import entities from "./entities";
import eventHandlers from "./event-handlers";

/**
 * Creates an array of data sources/templates for a subgraph manifest.
 */
export function create(protocol: Indexed.Protocol, chainId: number): GraphManifest.Source[] {
  const sources: GraphManifest.Source[] = [];
  for (const indexedContract of indexedContracts[protocol]) {
    for (const version of indexedContract.versions) {
      const release = queries.releases.get({ protocol, version });
      if (!release) {
        throw new Errors.ReleaseNotFound(protocol, version);
      }

      const { name: contractName, isTemplate } = indexedContract;
      const contract = extractContract({ release, chainId, contractName, isTemplate });
      if (!contract) continue;

      const common = createCommon({ protocol, chainId, version, contract, isTemplate });
      const mapping = createMapping({ protocol, version, contractName: contract.name });
      const source = _.merge({}, common, { mapping }) as GraphManifest.Source;
      sources.push(source);
    }
  }

  return sources;
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

type CreateSourcesParams = {
  protocol: Indexed.Protocol;
  chainId: number;
  version: Indexed.Version;
  contract: Indexed.Contract;
  isTemplate: boolean;
};

function createCommon(params: CreateSourcesParams) {
  const { protocol, chainId, version, contract, isTemplate } = params;
  const dataSourceName = sanitizeName(contract.name, version);

  const context = createContext({ protocol, chainId, version, contract, isTemplate });
  const contractAddress = contract.address.toLowerCase() as Sablier.Address;

  return {
    kind: "ethereum/contract",
    name: dataSourceName,
    network: getGraphChainName(chainId),
    context,
    source: {
      address: isTemplate ? undefined : contractAddress,
      abi: contract.name,
      startBlock: isTemplate ? undefined : contract.block,
    },
    mapping: {
      apiVersion: "0.0.9",
      kind: "ethereum/events",
      language: "wasm/assemblyscript",
    },
    _type: isTemplate ? "template" : "data-source",
  };
}

function createContext(params: CreateSourcesParams): GraphManifest.Context | undefined {
  const { chainId, version, isTemplate, contract } = params;
  if (isTemplate) {
    return undefined;
  }

  return {
    alias: {
      data: contract.alias as string,
      type: "String",
    },
    chainId: {
      data: chainId.toString(),
      type: "BigInt",
    },
    version: {
      data: version,
      type: "String",
    },
  };
}

/**
 * Helper for accessing mapping configuration based on protocol and version.
 */
function createMapping(params: { protocol: Indexed.Protocol; version: Indexed.Version; contractName: string }) {
  const { protocol, version, contractName } = params;

  return {
    abis: ABIs[protocol][contractName][version],
    entities: entities[protocol][contractName][version],
    eventHandlers: eventHandlers[protocol][contractName][version],
    file: `../mappings/${version}/index.ts`,
  };
}

/**
 * Extracts contract information based on release, chain, name, and template status.
 * @returns The contract object if found, or undefined if not deployed on the specified chain
 *
 * For templates: Returns a stub contract with just the name (templates don't need addresses)
 * For regular contracts: Validates that required fields (alias, block) exist before returning
 */
function extractContract(params: {
  release: Sablier.Release;
  chainId: number;
  contractName: string;
  isTemplate: boolean;
}): Indexed.Contract | undefined {
  const { release, chainId, contractName, isTemplate } = params;

  // Templates are contract definitions without deployment details
  // Used for contracts created at runtime through factory patterns
  if (isTemplate) {
    return {
      address: "0x",
      alias: "",
      block: 0,
      name: contractName,
      protocol: release.protocol as Indexed.Protocol,
      version: release.version as Indexed.Version,
    };
  }

  // Query contract deployment for this release and chain, skipping if not deployed because not all
  // chains are available for a particular release.
  const contract = queries.contracts.get({ chainId, contractName, deployments: release.deployments });
  if (!contract) {
    logger.debug(messages.contractNotFound(release, chainId, contractName));
    return undefined;
  }

  // Validate required indexing fields
  // Both alias and block number are necessary for proper subgraph indexing
  if (!contract.alias) {
    throw new Errors.AliasNotFound(release, chainId, contractName);
  }
  if (!contract.block) {
    throw new Errors.BlockNotFound(release, chainId, contractName);
  }

  return getIndexedContract(contract);
}
