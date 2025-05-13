import { type Sablier, Version, lockup as lockupReleases, queries } from "@sablier/deployments";
import type { Config, Manifest } from "@src/types";
import logger from "@src/winston";
import { createSources } from "./creators";

const AIRDROPS_CONTRACTS: Config.Contracts<Sablier.Version.Airdrops> = [
  {
    contractName: "SablierV2MerkleStreamerFactory",
    isTemplate: false,
    versions: ["v1.1"],
  },
  {
    contractName: "SablierV2MerkleStreamerLL",
    isTemplate: true,
    versions: ["v1.1"],
  },
  {
    contractName: "SablierV2MerkleLockupFactory",
    isTemplate: false,
    versions: ["v1.2"],
  },
  {
    contractName: "SablierV2MerkleLL",
    isTemplate: true,
    versions: ["v1.2"],
  },
  {
    contractName: "SablierV2MerkleLT",
    isTemplate: true,
    versions: ["v1.2"],
  },
  {
    contractName: "SablierMerkleFactory",
    isTemplate: false,
    versions: ["v1.3"],
  },
  {
    contractName: "SablierMerkleInstant",
    isTemplate: true,
    versions: ["v1.3"],
  },
  {
    contractName: "SablierMerkleLL",
    isTemplate: true,
    versions: ["v1.3"],
  },
  {
    contractName: "SablierMerkleLT",
    isTemplate: true,
    versions: ["v1.3"],
  },
];

export function getAirdropsSources(chainId: number, chainName: string): Manifest.Source[] {
  const sources = createSources({
    contractMap: AIRDROPS_CONTRACTS,
    protocol: "airdrops",
    chainId,
    chainName,
  });

  for (const source of sources) {
    if (source.type !== "data-source" || !source.context) {
      continue;
    }
    source.context.lockups = getLockups(source.context);
  }

  return sources;
}

/**
 * Retrieves the addresses of official Lockup contracts for a specific chain.
 * The Merkle contract creation functions take a Lockup contract address as a user-provided argument.
 * So users can provide any address when deploying an airdrop contract, but we only index official deployments.
 */
function getLockups(context: Manifest.Context): Manifest.ContextItem.ListString {
  const contracts = queries.contracts.getAllByProtocolAndChain("lockup", context.chainId.data);
  if (!contracts) {
    logger.error(`getLockups: No Lockup contracts found for chain ${context.chainId.data}`);
    process.exit(1);
  }

  const data: Manifest.ContextItem.String[] = [];

  for (const lockupRelease of lockupReleases) {
    const airdropsVersion = context.version.data as Sablier.Version.Airdrops;
    const lockupVersion = lockupRelease.version as Sablier.Version.Lockup;
    if (!areVersionsCompatible(airdropsVersion, lockupVersion)) {
      continue;
    }

    for (const deployment of lockupRelease.deployments) {
      if (deployment.chainId !== context.chainId.data) {
        continue;
      }
      for (const contract of deployment.contracts) {
        // Look only for Lockup contracts compatible with Merkle factories
        if (!isLockupContract(contract.name)) {
          continue;
        }

        data.push({
          data: contract.address.toLowerCase(),
          type: "String",
        });
      }
    }
  }

  return {
    data,
    type: "List",
  };
}

/**
 * Notes:
 *   - Lockup v1.0 is not supported for airdrops at all.
 *   - Lockup v1.1/v1.2 is only compatible with Airdrops v1.1/v1.2.
 *   - Lockup v2.0 is only compatible with Airdrops v1.3.
 *
 * @see https://diffchecker.com/KCMfHn3A/
 */
function areVersionsCompatible(airdrops: Sablier.Version.Airdrops, lockup: Sablier.Version.Lockup): boolean {
  const compatiblePairs: Record<Sablier.Version.Airdrops, Sablier.Version.Lockup[]> = {
    [Version.Airdrops.V1_1]: [Version.Lockup.V1_1, Version.Lockup.V1_2],
    [Version.Airdrops.V1_2]: [Version.Lockup.V1_1, Version.Lockup.V1_2],
    [Version.Airdrops.V1_3]: [Version.Lockup.V2_0],
  };

  return compatiblePairs[airdrops]?.includes(lockup) ?? false;
}

function isLockupContract(name: string): boolean {
  const supported = ["SablierLockup", "SablierV2LockupLinear", "SablierV2LockupTranched"];
  return supported.includes(name);
}
