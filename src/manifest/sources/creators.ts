import { type Sablier, getChainName, queries } from "@sablier/deployments";
import type { Config, Manifest } from "@src/types";
import logger from "@src/winston";
import _ from "lodash";
import ABIs from "./abi-entries";
import entities from "./entities";
import eventHandlers from "./event-handlers";

/**
 * Creates an array of data sources/templates for a subgraph manifest.
 */
export function createSources(params: {
  contractMap: Config.Contracts<Sablier.Version>;
  protocol: Sablier.Protocol;
  chainId: number;
  chainName: string;
}): Manifest.Source[] {
  const { contractMap, protocol, chainId, chainName } = params;

  return contractMap.flatMap(({ contractName, isTemplate, versions }) =>
    versions.flatMap((version) => {
      const release = queries.releases.getByProtocolAndVersion(protocol, version);
      if (!release) {
        logger.error(`createSources: Sablier release not found for ${protocol} ${version}`);
        process.exit(1);
      }

      const contract = extractContract({ release: release, chainId, contractName, isTemplate });
      if (!contract) return [];
      return [
        createSourceWithMapping({
          protocol,
          chainId,
          chainName,
          version,
          contract,
          isTemplate,
        }),
      ];
    }),
  );
}

/* -------------------------------------------------------------------------- */
/*                                  INTERNAL                                  */
/* -------------------------------------------------------------------------- */

function createSourceWithMapping(params: {
  protocol: Sablier.Protocol;
  chainId: number;
  chainName: string;
  version: Sablier.Version;
  contract: Sablier.Contract;
  isTemplate: boolean;
}): Manifest.Source {
  const { protocol, chainId, chainName, version, contract, isTemplate } = params;

  const common = createCommon({ protocol, chainId, chainName, version, contract, isTemplate });
  const mapping = createMapping({ protocol, version, contractName: contract.name });

  return _.merge({}, common, {
    mapping,
    type: isTemplate ? "template" : "data-source",
  }) as Manifest.Source;
}

function createCommon(params: {
  protocol: Sablier.Protocol;
  chainId: number;
  chainName: string;
  version: Sablier.Version;
  contract: Sablier.Contract;
  isTemplate: boolean;
}) {
  const { protocol, chainId, chainName, version, contract, isTemplate } = params;
  const sanitizedVersion = version.replace(".", "_");
  const dataSourceName = `${contract.name}_${sanitizedVersion}`; // e.g. SablierLockup_v2_0

  const context = createContext({ protocol, chainId, version, contract, isTemplate });
  const contractAddress = isTemplate ? undefined : contract.address.toLowerCase();
  const startBlock = isTemplate ? undefined : contract.block;

  return {
    kind: "ethereum/contract",
    name: dataSourceName,
    network: chainName,
    context,
    source: {
      address: contractAddress,
      abi: contract.name,
      startBlock,
    },
    mapping: {
      apiVersion: "0.0.7",
      kind: "ethereum/events",
      language: "wasm/assemblyscript",
    },
  };
}

function createContext(params: {
  protocol: Sablier.Protocol;
  chainId: number;
  version: Sablier.Version;
  contract: Sablier.Contract;
  isTemplate: boolean;
}): Manifest.Context | undefined {
  const { chainId, version, isTemplate, contract } = params;
  if (isTemplate) {
    return undefined;
  }

  if (!contract.alias) {
    const msg = `createContext: Alias not found for contract ${contract.name} on ${getChainName(chainId)}`;
    logger.error(msg);
    process.exit(1);
  }

  return {
    alias: {
      data: contract.alias,
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
/** Helper for accessing mapping configuration based on protocol and version. */
function createMapping(params: {
  protocol: Sablier.Protocol;
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

function extractContract(params: {
  release: Sablier.Release;
  chainId: number;
  contractName: string;
  isTemplate: boolean;
}): Sablier.Contract | undefined {
  const { release, chainId, contractName, isTemplate } = params;

  // A template is like a data source, but it only has a name.
  // See https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest
  if (isTemplate) {
    return {
      alias: "",
      address: "0x",
      block: 0,
      name: contractName,
    };
  }

  // Some contracts are not deployed on all chains, so we skip them.
  const contract = queries.contracts.getByReleaseAndChainAndName(release, chainId, contractName);
  const chainName = getChainName(chainId);
  if (!contract) {
    logger.debug(
      `extractContract: Contract ${contractName} not found for ${release.protocol} ${release.version} on ${chainName}`,
    );
    return undefined;
  }

  // If a contract is found, it must have an alias and a start block. These are required for indexing.
  if (!contract.alias) {
    logger.error(
      `extractContract: Alias not found for contract ${contract.name} for ${release.protocol} ${release.version} on ${chainName}`,
    );
  }
  if (!contract.block) {
    logger.error(
      `extractContract: Start block not found for contract ${contract.name} for ${release.protocol} ${release.version} on ${chainName}`,
    );
  }

  return contract;
}
