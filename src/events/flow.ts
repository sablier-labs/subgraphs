import { contracts, type Sablier } from "sablier";
import type { Types } from "../types";
import { erc721 } from "./common/erc721";

function get(version: Sablier.Version.Flow, contractName: string, eventName: string): Types.Event {
  return {
    contractName,
    eventName,
    protocol: "flow",
    version,
  };
}

function base(version: Sablier.Version.Flow): Types.Event[] {
  const name = contracts.names.SABLIER_FLOW;
  return [
    ...erc721("flow", version, name),
    get(version, name, "AdjustFlowStream"),
    get(version, name, "CreateFlowStream"),
    get(version, name, "DepositFlowStream"),
    get(version, name, "PauseFlowStream"),
    get(version, name, "RefundFromFlowStream"),
    get(version, name, "RestartFlowStream"),
    get(version, name, "VoidFlowStream"),
    get(version, name, "WithdrawFromFlowStream"),
  ];
}

// v1.1 event handlers are the same as v1.0 handlers because the ABIs are identical.
const v1_0Events = base("v1.0");
const v1_1Events = base("v1.1");

const flowEvents: Types.EventMap = {
  [contracts.names.SABLIER_FLOW]: {
    "v1.0": v1_0Events,
    "v1.1": v1_1Events,
  },
} as const;

export default flowEvents;
