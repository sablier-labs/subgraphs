import type { Sablier } from "@sablier/deployments";
import type { Indexed } from "@src/types";
import erc721 from "./common/erc721";

function get(version: Sablier.Version.Lockup, contractName: string, eventName: string): Indexed.Event {
  return {
    contractName,
    eventName,
    protocol: "lockup",
    version,
  };
}

// It doesn't matter what contract/version we're using because the events have the same signatures across all versions.
const baseContract = "SablierV2LockupDynamic";
const baseEvents: Indexed.Event[] = [...erc721, get("v1.0", baseContract, "RenounceLockupStream")];

// Similarly, it doesn't matter what contract we're using here since the ABIs are identical.
const v1_0Events: Indexed.Event[] = [
  ...baseEvents,
  get("v1.0", baseContract, "CancelLockupStream"),
  get("v1.0", baseContract, "WithdrawFromLockupStream"),
];

const v1_1ToV2_0Events: Indexed.Event[] = [
  ...baseEvents,
  get("v1.1", baseContract, "CancelLockupStream"),
  get("v1.1", baseContract, "WithdrawFromLockupStream"),
];

const lockupEvents: Indexed.EventMap = {
  SablierV2LockupDynamic: {
    "v1.0": [...v1_0Events, get("v1.0", "SablierV2LockupDynamic", "CreateLockupDynamicStream")],
    "v1.1": [...v1_1ToV2_0Events, get("v1.1", "SablierV2LockupDynamic", "CreateLockupDynamicStream")],
    "v1.2": [...v1_1ToV2_0Events, get("v1.2", "SablierV2LockupDynamic", "CreateLockupDynamicStream")],
  },
  SablierV2LockupLinear: {
    "v1.0": [...v1_0Events, get("v1.0", "SablierV2LockupLinear", "CreateLockupLinearStream")],
    "v1.1": [...v1_1ToV2_0Events, get("v1.1", "SablierV2LockupLinear", "CreateLockupLinearStream")],
    "v1.2": [...v1_1ToV2_0Events, get("v1.2", "SablierV2LockupLinear", "CreateLockupLinearStream")],
  },
  SablierV2LockupTranched: {
    "v1.2": [...v1_1ToV2_0Events, get("v1.2", "SablierV2LockupTranched", "CreateLockupTranchedStream")],
  },
  SablierLockup: {
    "v2.0": [
      ...v1_1ToV2_0Events,
      get("v2.0", "SablierLockup", "CreateLockupDynamicStream"),
      get("v2.0", "SablierLockup", "CreateLockupLinearStream"),
      get("v2.0", "SablierLockup", "CreateLockupTranchedStream"),
    ],
  },
} as const;

export default lockupEvents;
