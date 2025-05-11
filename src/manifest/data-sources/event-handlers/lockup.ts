import type { Sablier } from "@sablier/deployments";
import type { Config, Manifest } from "@src/types";
import erc721 from "./erc721";
import { resolveEventHandler } from "./helpers";

// It doesn't matter what contract/version we're using because the events have the same signatures across all versions.
const baseContract = "SablierV2LockupDynamic";
const baseHandlers: Manifest.EventHandler[] = [...erc721, resolve("v1.0", baseContract, "RenounceLockupStream")];

// Similarly, it doesn't matter what contract we're using here since the ABIs are identical.
const v1_0Handlers: Manifest.EventHandler[] = [
  ...baseHandlers,
  resolve("v1.0", baseContract, "CancelLockupStream"),
  resolve("v1.0", baseContract, "WithdrawFromLockupStream"),
];

const v1_1ToV2_0Handlers: Manifest.EventHandler[] = [
  ...baseHandlers,
  resolve("v1.1", baseContract, "CancelLockupStream"),
  resolve("v1.1", baseContract, "WithdrawFromLockupStream"),
];

const lockupHandlers: Config.Map.EventHandlers = {
  lockup: {
    SablierV2LockupDynamic: {
      "v1.0": [...v1_0Handlers, resolve("v1.0", "SablierV2LockupDynamic", "CreateLockupDynamicStream")],
      "v1.1": [...v1_1ToV2_0Handlers, resolve("v1.1", "SablierV2LockupDynamic", "CreateLockupDynamicStream")],
      "v1.2": [...v1_1ToV2_0Handlers, resolve("v1.2", "SablierV2LockupDynamic", "CreateLockupDynamicStream")],
    },
    SablierV2LockupLinear: {
      "v1.0": [...v1_0Handlers, resolve("v1.0", "SablierV2LockupLinear", "CreateLockupLinearStream")],
      "v1.1": [...v1_1ToV2_0Handlers, resolve("v1.1", "SablierV2LockupLinear", "CreateLockupLinearStream")],
      "v1.2": [...v1_1ToV2_0Handlers, resolve("v1.2", "SablierV2LockupLinear", "CreateLockupLinearStream")],
    },
    SablierV2LockupTranched: {
      "v1.2": [...v1_1ToV2_0Handlers, resolve("v1.2", "SablierV2LockupTranched", "CreateLockupTranchedStream")],
    },
    SablierLockup: {
      "v2.0": [
        ...v1_1ToV2_0Handlers,
        resolve("v2.0", "SablierLockup", "CreateLockupDynamicStream"),
        resolve("v2.0", "SablierLockup", "CreateLockupLinearStream"),
        resolve("v2.0", "SablierLockup", "CreateLockupTranchedStream"),
      ],
    },
  },
} as const;

export default lockupHandlers;

function resolve(version: Sablier.Version.Lockup, contractName: string, eventName: string) {
  return resolveEventHandler({
    protocol: "lockup",
    version,
    contractName,
    eventName,
  });
}
