import { type Sablier, queries } from "@sablier/deployments";
import { getChainName } from "@src/chains";
import indexedContracts from "@src/contracts";
import type { Manifest } from "@src/graph-manifest/types";
import { sanitizeName } from "@src/helpers";
import type { IndexedProtocol } from "@src/types";
import logger, { messages, thrower } from "@src/winston";
import _ from "lodash";
import ABIs from "./abi-entries";
import entities from "./entities";
import eventHandlers from "./event-handlers";

/**
 * Creates an array of data sources/templates for a subgraph manifest.
 */
export function create(protocol: IndexedProtocol, chainId: number): Manifest.Source[] {
  const sources: Manifest.Source[] = [];
  for (const indexedContract of indexedContracts[protocol]) {
    for (const version of indexedContract.versions) {
      const release = queries.releases.getByProtocolAndVersion(protocol, version);
      if (!release) {
        thrower.releaseNotFound(protocol, version);
      }

      const { name: contractName, isTemplate } = indexedContract;
      const contract = extractContract({ release, chainId, contractName, isTemplate });
      if (!contract) continue;

      const common = createCommon({ protocol, chainId, version, contract, isTemplate });
      const mapping = createMapping({ protocol, version, contractName: contract.name });
      const source = _.merge({}, common, { mapping }) as Manifest.Source;
      sources.push(source);
    }
  }

  return sources;
}

/* -------------------------------------------------------------------------- */
/*                                  INTERNAL                                  */
/* -------------------------------------------------------------------------- */

interface CreateSourcesParams {
  protocol: IndexedProtocol;
  chainId: number;
  version: Sablier.Version;
  contract: Sablier.Contract;
  isTemplate: boolean;
}

function createCommon(params: CreateSourcesParams) {
  const { protocol, chainId, version, contract, isTemplate } = params;
  const dataSourceName = sanitizeName(contract.name, version);

  const context = createContext({ protocol, chainId, version, contract, isTemplate });
  const contractAddress = contract.address.toLowerCase() as Sablier.Address;

  return {
    kind: "ethereum/contract",
    name: dataSourceName,
    network: getChainName(chainId),
    context,
    source: {
      address: isTemplate ? undefined : contractAddress,
      abi: contract.name,
      startBlock: isTemplate ? undefined : contract.block,
    },
    mapping: {
      apiVersion: "0.0.7",
      kind: "ethereum/events",
      language: "wasm/assemblyscript",
    },
    _type: isTemplate ? "template" : "data-source",
  };
}

function createContext(params: CreateSourcesParams): Manifest.Context | undefined {
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
      data: chainId,
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
function createMapping(params: {
  protocol: IndexedProtocol;
  version: Sablier.Version;
  contractName: string;
}) {
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
export function extractContract(params: {
  release: Sablier.Release;
  chainId: number;
  contractName: string;
  isTemplate: boolean;
}): Sablier.Contract | undefined {
  const { release, chainId, contractName, isTemplate } = params;

  // Templates are contract definitions without deployment details
  // Used for contracts created at runtime through factory patterns
  if (isTemplate) {
    return {
      alias: "",
      address: "0x",
      block: 0,
      name: contractName,
    };
  }

  // Look up actual contract deployment for this chain
  // Skip if not deployed on this specific chain
  const contract = queries.contracts.getByReleaseAndChainAndName(release, chainId, contractName);
  if (!contract) {
    logger.debug(messages.contractNotFound(release, chainId, contractName));
    return undefined;
  }

  // Validate required indexing fields
  // Both alias and block number are necessary for proper subgraph indexing
  if (!contract.alias) {
    thrower.aliasNotFound(release, chainId, contract);
  }
  if (!contract.block) {
    thrower.blockNotFound(release, chainId, contract);
  }

  return contract;
}
