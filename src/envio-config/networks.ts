import { queries, releasesByProtocol } from "@sablier/deployments";
import supportedChains, { getChainName } from "@src/chains";
import indexedContracts from "@src/contracts";
import type { EnvioConfig } from "@src/envio-config/types";
import { sanitizeName } from "@src/helpers";
import type { IndexedProtocol } from "@src/types";
import logger, { logAndThrow, thrower } from "@src/winston";

export function createNetworks(protocol: IndexedProtocol): EnvioConfig.Network[] {
  const networks: EnvioConfig.Network[] = [];
  for (const chain of supportedChains) {
    if (!chain.envio.isEnabled) {
      continue;
    }

    const { contracts, startBlock } = extractContracts(protocol, chain.id);
    networks.push({
      id: chain.id,
      start_block: startBlock,
      contracts,
    });
  }
  return networks;
}

interface ExtractContractsReturn {
  contracts: EnvioConfig.NetworkContract[];
  startBlock: number;
}

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
function extractContracts(protocol: IndexedProtocol, chainId: number): ExtractContractsReturn {
  const networkContracts: EnvioConfig.NetworkContract[] = [];
  const chainName = getChainName(chainId);
  let startBlock = 0;

  for (const release of releasesByProtocol[protocol]) {
    const deployment = queries.deployments.getByReleaseAndChain(release, chainId);

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
      const contract = queries.contracts.getByDeploymentAndName(deployment, contractName);

      // If it's a deployment that exists, the contract from the contract map must exist.
      if (!contract) {
        logAndThrow(`Contract ${contractName} not found for ${protocol} ${release.version} on ${chainName}`);
      }

      // If a contract is found, it must have an alias and a start block. These are required for indexing.
      if (!contract.alias) {
        thrower.aliasNotFound(release, chainId, contract);
      }
      if (!contract.block) {
        thrower.blockNotFound(release, chainId, contract);
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
    thrower.contractsNotFound(protocol, chainId);
  }

  return { contracts: networkContracts, startBlock };
}
