import { sablier } from "@sablier/deployments";
import { envioChains } from "@src/chains";
import indexedContracts from "@src/contracts";
import type { EnvioConfig } from "@src/envio-config/types";
import { Errors } from "@src/errors";
import { sanitizeContractName } from "@src/helpers";
import type { Indexed } from "@src/types";
import logger, { messages } from "@src/winston";
import _ from "lodash";

export function createNetworks(protocol: Indexed.Protocol): EnvioConfig.Network[] {
  const networks: EnvioConfig.Network[] = [];
  for (const chain of envioChains) {
    const { contracts, startBlock } = extractContracts(protocol, chain.id);
    const hypersyncConfig = chain.envio.hypersync ? { url: chain.envio.hypersync } : undefined;
    const network: EnvioConfig.Network = {
      contracts,
      hypersync_config: hypersyncConfig,
      id: chain.id,
      start_block: startBlock,
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
  let startBlock = 0;

  for (const release of sablier.releases.getAll({ protocol })) {
    const deployment = sablier.deployments.get({ chainId, release });

    // Some contracts are not deployed on all chains, so we skip them.
    if (!deployment) {
      const chainName = sablier.chains.get(chainId)?.name ?? "chain";
      logger.debug(`No deployment found for ${protocol} ${release.version} on ${chainName}`);
      continue;
    }

    // Filter all contracts that match the release version.
    const filteredContracts = indexedContracts[protocol].filter((c) => c.versions.includes(release.version));

    const possibleStartBlocks: number[] = [];
    for (const filteredContract of filteredContracts) {
      const { name: contractName, isTemplate } = filteredContract;
      if (isTemplate) {
        networkContracts.push({
          name: sanitizeContractName(contractName, release.version),
        });
        continue;
      }

      const contract = _.find(deployment.contracts, { name: contractName });

      // If it's a deployment that exists, the contract from the contract map must exist.
      if (!contract) {
        logger.debug(messages.contractNotFound(release, chainId, contractName));
        continue;
      }
      // If a contract is found, it must have an alias and a start block. These are required for indexing.
      if (!contract.alias) {
        throw new Errors.AliasNotFound(release, chainId, contractName);
      }
      if (!contract.block) {
        throw new Errors.BlockNotFound(release, chainId, contractName);
      }

      networkContracts.push({
        address: contract.address.toLowerCase() as `0x${string}`,
        name: sanitizeContractName(contractName, release.version),
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
    throw new Errors.ContractsNotFound(protocol, chainId);
  }

  return { contracts: networkContracts, startBlock };
}
