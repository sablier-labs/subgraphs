import type { Sablier } from "@sablier/deployments";
import type { Indexed } from "@src/types";

function get(
  version: Sablier.Version.Airdrops,
  contractName: string,
  eventName: string,
  handlerSuffix?: string,
): Indexed.Event {
  return {
    contractName,
    handlerSuffix,
    eventName,
    protocol: "airdrops",
    version,
  };
}

// It doesn't matter what contract/version we're using because the events have the same signatures across all contracts.
const campaignEvents: Indexed.Event[] = [
  {
    contractName: "Adminable",
    eventName: "TransferAdmin",
    handlerSuffix: "InCampaign",
  },
  get("v1.1", "SablierV2MerkleStreamerLL", "Clawback"),
];

const airdropHandlers: Indexed.EventMap = {
  SablierV2MerkleStreamerFactory: {
    "v1.1": [get("v1.1", "SablierV2MerkleStreamerFactory", "CreateMerkleStreamerLL")],
  },
  SablierV2MerkleStreamerLL: {
    "v1.1": [...campaignEvents, get("v1.1", "SablierV2MerkleStreamerLL", "Claim", "Lockup")],
  },
  SablierV2MerkleLockupFactory: {
    "v1.2": [
      get("v1.2", "SablierV2MerkleLockupFactory", "CreateMerkleLL"),
      get("v1.2", "SablierV2MerkleLockupFactory", "CreateMerkleLT"),
    ],
  },
  SablierV2MerkleLL: {
    "v1.2": [...campaignEvents, get("v1.2", "SablierV2MerkleLL", "Claim", "Lockup")],
  },
  SablierV2MerkleLT: {
    "v1.2": [...campaignEvents, get("v1.2", "SablierV2MerkleLT", "Claim", "Lockup")],
  },
  SablierMerkleFactory: {
    "v1.3": [
      get("v1.3", "SablierMerkleFactory", "CreateMerkleInstant"),
      get("v1.3", "SablierMerkleFactory", "CreateMerkleLL"),
      get("v1.3", "SablierMerkleFactory", "CreateMerkleLT"),
    ],
  },
  SablierMerkleInstant: {
    "v1.3": [...campaignEvents, get("v1.3", "SablierMerkleInstant", "Claim", "Instant")],
  },
  SablierMerkleLL: {
    "v1.3": [...campaignEvents, get("v1.3", "SablierMerkleLL", "Claim", "Lockup")],
  },
  SablierMerkleLT: {
    "v1.3": [...campaignEvents, get("v1.3", "SablierMerkleLT", "Claim", "Lockup")],
  },
} as const;

export default airdropHandlers;
