import type { Sablier } from "@sablier/deployments";
import type { Config, Manifest } from "../../types";
import { resolveEventHandler } from "../helpers";
import erc721 from "./erc721";

function resolve(version: Sablier.Version.Lockup, contractName: string, eventName: string) {
  return resolveEventHandler({
    protocol: "lockup",
    version,
    contractName,
    eventName,
  });
}
// It doesn't matter what version we're using for the base handlers because their events have the same signature
// TODO: write tests to check that these event exist in all ABIs referencing these handlers
const baseHandlers: Manifest.EventHandler[] = [
  ...erc721,
  resolve("v1.0", "SablierV2LockupDynamic", "RenounceLockupStream"),
];

const v1_0BaseHandlers: Manifest.EventHandler[] = [
  ...baseHandlers,
  resolve("v1.0", "SablierV2LockupDynamic", "CancelLockupStream"),
  resolve("v1.0", "SablierV2LockupDynamic", "WithdrawFromLockupStream"),
];

const v1_1ToV2_0BaseHandlers: Manifest.EventHandler[] = [
  ...baseHandlers,
  resolve("v1.1", "SablierV2LockupDynamic", "CancelLockupStream"),
  resolve("v1.1", "SablierV2LockupDynamic", "WithdrawFromLockupStream"),
];

const lockupHandlers: Config.Map.EventHandlers = {
  lockup: {
    "v1.0": {
      SablierV2LockupDynamic: [
        ...v1_0BaseHandlers,
        resolve("v1.0", "SablierV2LockupDynamic", "CreateLockupDynamicStream"),
      ],
      SablierV2LockupLinear: [
        ...v1_0BaseHandlers,
        resolve("v1.0", "SablierV2LockupLinear", "CreateLockupLinearStream"),
      ],
    },
    "v1.1": {
      SablierV2LockupDynamic: [
        ...v1_1ToV2_0BaseHandlers,
        resolve("v1.1", "SablierV2LockupDynamic", "CreateLockupDynamicStream"),
      ],
      SablierV2LockupLinear: [
        ...v1_1ToV2_0BaseHandlers,
        resolve("v1.1", "SablierV2LockupLinear", "CreateLockupLinearStream"),
      ],
    },
    "v1.2": {
      SablierV2LockupDynamic: [
        ...v1_1ToV2_0BaseHandlers,
        resolve("v1.2", "SablierV2LockupDynamic", "CreateLockupDynamicStream"),
      ],
      SablierV2LockupLinear: [
        ...v1_1ToV2_0BaseHandlers,
        resolve("v1.2", "SablierV2LockupLinear", "CreateLockupLinearStream"),
      ],
      SablierV2LockupTranched: [
        ...v1_1ToV2_0BaseHandlers,
        resolve("v1.2", "SablierV2LockupTranched", "CreateLockupTranchedStream"),
      ],
    },
    "v2.0": {
      SablierLockup: [
        ...v1_1ToV2_0BaseHandlers,
        resolve("v2.0", "SablierLockup", "CreateLockupDynamicStream"),
        resolve("v2.0", "SablierLockup", "CreateLockupLinearStream"),
        resolve("v2.0", "SablierLockup", "CreateLockupTranchedStream"),
      ],
    },
  },
} as const;

export default lockupHandlers;
