import type { Sablier } from "@sablier/deployments";
import type { Config } from "@src/types";
import { resolveEventHandler } from "./resolver";

// It doesn't matter what contract/version we're using because the events have the same signatures across all contracts.
const campaignHandlers = [
  resolveEventHandler({ contractName: "Adminable", eventName: "TransferAdmin", suffix: "InCampaign" }),
  resolve("v1.1")("SablierV2MerkleStreamerLL", "Clawback"),
];

const airdropHandlers: Config.EventHandlers = {
  airdrops: {
    SablierV2MerkleStreamerFactory: {
      "v1.1": [resolve("v1.1")("SablierV2MerkleStreamerFactory", "CreateMerkleStreamerLL")],
    },
    SablierV2MerkleStreamerLL: {
      "v1.1": [...campaignHandlers, resolve("v1.1")("SablierV2MerkleStreamerLL", "Claim", "Lockup")],
    },
    SablierV2MerkleLockupFactory: {
      "v1.2": [
        resolve("v1.2")("SablierV2MerkleLockupFactory", "CreateMerkleLL"),
        resolve("v1.2")("SablierV2MerkleLockupFactory", "CreateMerkleLT"),
      ],
    },
    SablierV2MerkleLL: {
      "v1.2": [...campaignHandlers, resolve("v1.2")("SablierV2MerkleLL", "Claim", "Lockup")],
    },
    SablierV2MerkleLT: {
      "v1.2": [...campaignHandlers, resolve("v1.2")("SablierV2MerkleLT", "Claim", "Lockup")],
    },
    SablierMerkleFactory: {
      "v1.3": [
        resolve("v1.3")("SablierMerkleFactory", "CreateMerkleInstant"),
        resolve("v1.3")("SablierMerkleFactory", "CreateMerkleLL"),
        resolve("v1.3")("SablierMerkleFactory", "CreateMerkleLT"),
      ],
    },
    SablierMerkleInstant: {
      "v1.3": [...campaignHandlers, resolve("v1.3")("SablierMerkleInstant", "Claim", "Instant")],
    },
    SablierMerkleLL: {
      "v1.3": [...campaignHandlers, resolve("v1.3")("SablierMerkleLL", "Claim", "Lockup")],
    },
    SablierMerkleLT: {
      "v1.3": [...campaignHandlers, resolve("v1.3")("SablierMerkleLT", "Claim", "Lockup")],
    },
  },
} as const;

export default airdropHandlers;

function resolve(version: Sablier.Version) {
  return (contractName: string, eventName: string, suffix?: string) =>
    resolveEventHandler({
      protocol: "airdrops",
      version,
      contractName,
      eventName,
      suffix,
    });
}
