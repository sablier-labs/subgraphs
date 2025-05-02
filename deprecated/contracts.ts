import { type Sablier, airdropsByVersion, flowByVersion, lockupByVersion } from "@sablier/deployments";

airdropsByVersion;

export const names = {
  SABLIER_FLOW: "SablierFlow",
  SABLIER_LOCKUP: "SablierLockup",
  SABLIER_MERKLE_FACTORY: "SablierMerkleFactory",
  SABLIER_V2_LOCKUP_DYNAMIC: "SablierV2LockupDynamic",
  SABLIER_V2_LOCKUP_LINEAR: "SablierV2LockupLinear",
  SABLIER_V2_LOCKUP_TRANCHED: "SablierV2LockupTranched",
};

export const indexed = {
  airdrops: {
    [names.SABLIER_MERKLE_FACTORY]: ["v2.0"],
  },
  flow: {
    [names.SABLIER_FLOW]: ["v1.0", "v1.1"],
  },
  lockup: {
    [names.SABLIER_V2_LOCKUP_DYNAMIC]: ["v1.0", "v1.1", "v1.2"],
    [names.SABLIER_V2_LOCKUP_LINEAR]: ["v1.0", "v1.1", "v1.2"],
    [names.SABLIER_V2_LOCKUP_TRANCHED]: ["v1.2"],
    [names.SABLIER_LOCKUP]: ["v2.0"],
  },
};

export const indexedContracts = {
  airdrops: {
    // "v1.3": [],
  },
  flow: {
    "v1.0": [names.SABLIER_FLOW],
    "v1.1": [names.SABLIER_FLOW],
  },
  lockup: {
    "v1.0": [names.SABLIER_V2_LOCKUP_DYNAMIC, names.SABLIER_V2_LOCKUP_LINEAR],
    "v1.1": [names.SABLIER_V2_LOCKUP_DYNAMIC, names.SABLIER_V2_LOCKUP_LINEAR],
    "v1.2": [names.SABLIER_V2_LOCKUP_DYNAMIC, names.SABLIER_V2_LOCKUP_LINEAR, names.SABLIER_V2_LOCKUP_TRANCHED],
    "v2.0": [names.SABLIER_LOCKUP],
  },
};

// TODO: explain Lockup v1.x thingy
function _getAirdropsContracts(_chainId: number): string[][] {
  _chainId;
  return new Array<string[]>();
}

export function getFlowContracts(chainId: number): IndexerContract[] {
  const versions = ["v1.0", "v1.1"] as const;
  const labels = { "v1.0": "V10", "v1.1": "V11" };
  return getContracts("flow", chainId, versions, labels, flowByVersion);
}

export function getLockupContracts(chainId: number): IndexerContract[] {
  const versions = ["v1.0", "v1.1", "v1.2", "v2.0"] as const;
  const labels = { "v1.0": "V20", "v1.1": "V21", "v1.2": "V22", "v2.0": "V23" };
  return getContracts("lockup", chainId, versions, labels, lockupByVersion);
}

type IndexerContract = {
  address: string;
  alias: string;
  name: string;
  version: string;
};

type Protocol = "flow" | "lockup";

// TODO: refactor this to return by contract name, not by version
function getContracts(
  protocol: Protocol,
  chainId: number,
  versions: readonly string[],
  labels: Record<string, string>,
  byVersion: Record<string, Sablier.Release>,
): IndexerContract[] {
  const contracts: IndexerContract[] = [];

  for (const version of versions) {
    const deploymentForChain = byVersion[version].deployments.find((deployment) => deployment.chainId === chainId);

    if (deploymentForChain) {
      const contractsForVersion = getContractsForProtocolVersion(
        protocol,
        version,
        deploymentForChain,
        labels[version],
      );

      contracts.push(...contractsForVersion);
    }
  }

  if (contracts.length === 0) {
    throw new Error(`No ${protocol} deployments found for chain ID: ${chainId}`);
  }

  return contracts;
}

function getContractsForProtocolVersion(
  protocol: Protocol,
  version: string,
  deployment: Sablier.Deployment,
  versionLabel: string,
): IndexerContract[] {
  const result: IndexerContract[] = [];

  const targetContractNames = indexedContracts[protocol][version as keyof (typeof indexedContracts)[typeof protocol]];

  for (const name of targetContractNames) {
    const contract = deployment.contracts.find((contract) => contract.name === name);

    if (contract?.alias) {
      result.push({
        address: contract.address.toLowerCase(),
        alias: contract.alias.toLowerCase(),
        name: contract.name,
        version: versionLabel,
      });
    }
  }

  return result;
}
