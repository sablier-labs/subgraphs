import { queries, releasesByProtocol } from "@sablier/deployments";
import { envioChains, getChainName } from "@src/chains";
import indexedContracts from "@src/contracts";
import type { EnvioConfig } from "@src/envio-config/types";
import { sanitizeName } from "@src/helpers";
import type { Indexed } from "@src/types";
import logger, { logAndThrow, WinstonError } from "@src/winston";

export function createNetworks(protocol: Indexed.Protocol): EnvioConfig.Network[] {
  const networks: EnvioConfig.Network[] = [];
  for (const chain of envioChains) {
    const { contracts, startBlock } = extractContracts(protocol, chain.id);
    const hypersyncConfig = chain.envio.hypersync ? { url: chain.envio.hypersync } : undefined;
    const network: EnvioConfig.Network = {
      id: chain.id,
      hypersync_config: hypersyncConfig,
      start_block: startBlock,
      contracts,
    };
    networks.push(network);
  }
  return networks;
}

type ExtractContractsReturn = {
  contracts: EnvioConfig.NetworkContract[];
  startBlock: number;
};

/**
 * Extracts contracts for a specific protocol and chain.
 * @returns Object containing extracted contracts and the earliest start block
 *
 * This function:
 * 1. Iterates through all releases for the given protocol
 * 2. Finds the deployment for that release on the specified chain
 * 3. Filters contracts that are indexed
 * 4. Validates contracts have required properties (alias and block)
 * 5. Collects contract addresses and names
 * 6. Determines the earliest block number to start indexing from
 * 7. Throws errors if required contracts are missing or no contracts found
 */
function extractContracts(protocol: Indexed.Protocol, chainId: number): ExtractContractsReturn {
  const networkContracts: EnvioConfig.NetworkContract[] = [];
  const chainName = getChainName(chainId);
  let startBlock = 0;

  for (const release of releasesByProtocol[protocol]) {
    const deployment = queries.deployments.get({ release, chainId });

    // Some contracts are not deployed on all chains, so we skip them.
    if (!deployment) {
      logger.debug(`No deployment found for ${protocol} ${release.version} on chain ${chainName}`);
      continue;
    }

    // Find all contracts that match the release version.
    const contractNames = indexedContracts[protocol]
      .filter((contract) => contract.versions.includes(release.version))
      .map((contract) => contract.name);

    const possibleStartBlocks: number[] = [];
    for (const contractName of contractNames) {
      const contract = queries.contracts.get({ contractName, deployment });

      // If it's a deployment that exists, the contract from the contract map must exist.
      if (!contract) {
        logAndThrow(`Contract ${contractName} not found for ${protocol} ${release.version} on ${chainName}`);
      }

      // If a contract is found, it must have an alias and a start block. These are required for indexing.
      if (!contract.alias) {
        throw new WinstonError.AliasNotFound(release, chainId, contractName);
      }
      if (!contract.block) {
        throw new WinstonError.BlockNotFound(release, chainId, contractName);
      }

      networkContracts.push({
        name: sanitizeName(contract.name, release.version),
        address: contract.address.toLowerCase() as `0x${string}`,
      });
      if (startBlock === 0) {
        possibleStartBlocks.push(contract.block);
      }
    }

    // The first contract gives the start block for the entire indexer.
    if (startBlock === 0) {
      startBlock = Math.min(...possibleStartBlocks);
    }
  }

  // At least one contract must be found for the indexer to work.
  if (networkContracts.length === 0) {
    throw new WinstonError.ContractsNotFound(protocol, chainId);
  }

  return { contracts: networkContracts, startBlock };
}
