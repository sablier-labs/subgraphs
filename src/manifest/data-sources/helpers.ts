import { type Sablier, flowByVersion, getChainName, lockupByVersion, queries } from "@sablier/deployments";
import type { Config, Manifest } from "@src/types";
import logger from "@src/winston";
import _ from "lodash";
import ABIs from "./abi-entries";
import entities from "./entities";
import eventHandlers from "./event-handlers";

/** Creates an array of data sources from a contract list. */
export function createSources(
  contractList: Config.ContractList<Sablier.Version>,
  protocol: Sablier.Protocol,
  chainId: number,
  chainName: string,
): Manifest.DataSource[] {
  let releases: Record<Sablier.Version, Sablier.Release>;
  if (protocol === "flow") {
    releases = flowByVersion as Record<Sablier.Version, Sablier.Release>;
  } else if (protocol === "lockup") {
    releases = lockupByVersion as Record<Sablier.Version, Sablier.Release>;
  } else {
    throw new Error(`Unsupported protocol: ${protocol}`);
  }

  return contractList.flatMap(({ contractName, versions }) =>
    versions
      .map((version) => {
        const contract = getContract(releases[version], chainId, contractName);
        return contract ? createSourceWithMapping(protocol, version, contract, chainId, chainName) : undefined;
      })
      .filter((source): source is Manifest.DataSource => source !== undefined),
  );
}

/*//////////////////////////////////////////////////////////////////////////
                                  INTERNAL
//////////////////////////////////////////////////////////////////////////*/

function createSourceWithMapping(
  protocol: Sablier.Protocol,
  version: Sablier.Version,
  contract: Sablier.Contract,
  chainId: number,
  chainName: string,
): Manifest.DataSource {
  const common = createCommon(version, contract, chainId, chainName);
  const mapping = createMapping(protocol, version, contract.name);

  return _.merge({}, common, {
    mapping,
  });
}

function createCommon(version: string, contract: Sablier.Contract, chainId: number, chainName: string) {
  const dataSourceName = `${contract.name}-${version}`;
  return {
    kind: "ethereum/contract",
    name: dataSourceName,
    network: chainName,
    context: {
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
    } as Manifest.Context,
    source: {
      address: contract.address,
      abi: contract.name,
      startBlock: contract.block,
    } as Manifest.Source,
    mapping: {
      apiVersion: "0.0.7",
      kind: "ethereum/events",
      language: "wasm/assemblyscript",
    },
  };
}

/** Helper for accessing mapping configuration based on protocol and version. */
function createMapping(
  protocol: Sablier.Protocol,
  version: Sablier.Version,
  contractName: string,
): {
  abis: Manifest.ABI[];
  entities: string[];
  eventHandlers: Manifest.EventHandler[];
  file: string;
} {
  if (protocol === "flow") {
    const flowVersion = version as Sablier.Version.Flow;
    return {
      abis: ABIs.flow[contractName][flowVersion],
      entities: entities.flow[contractName][flowVersion],
      eventHandlers: eventHandlers.flow[contractName][flowVersion],
      file: `../mappings/${flowVersion}.ts`,
    };
  }

  if (protocol === "lockup") {
    const lockupVersion = version as Sablier.Version.Lockup;
    return {
      abis: ABIs.lockup[contractName][lockupVersion],
      entities: entities.lockup[contractName][lockupVersion],
      eventHandlers: eventHandlers.lockup[contractName][lockupVersion],
      file: `../mappings/${lockupVersion}.ts`,
    };
  }

  throw new Error(`Unsupported protocol: ${protocol}`);
}

function getContract(release: Sablier.Release, chainId: number, contractName: string): Sablier.Contract | undefined {
  // Some contracts are not deployed on all chains, so we skip them.
  const contract = queries.contracts.getByReleaseAndChainAndName(release, chainId, contractName);
  if (!contract) {
    logger.debug(
      `Contract ${contractName} not found for ${release.protocol} ${release.version} on ${getChainName(chainId)}`,
    );
    return undefined;
  }
  if (!contract.alias) {
    throw new Error(
      `Alias not found for contract ${contract.name} for ${release.protocol} ${release.version} on ${getChainName(chainId)}`,
    );
  }
  if (!contract.block) {
    throw new Error(
      `Block number not found for contract ${contract.name} for ${release.protocol} ${release.version} on ${getChainName(chainId)}`,
    );
  }

  return contract;
}
