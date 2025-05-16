import type { IndexedEvent, IndexedEventMap } from "@src/types";
import erc721 from "./common/erc721";

function get(contractName: string, eventName: string): IndexedEvent {
  return {
    contractName,
    eventName,
    protocol: "flow",
    version: "v1.0",
  };
}

const baseEvents: IndexedEvent[] = [
  ...erc721,
  get("SablierFlow", "AdjustFlowStream"),
  get("SablierFlow", "CreateFlowStream"),
  get("SablierFlow", "DepositFlowStream"),
  get("SablierFlow", "PauseFlowStream"),
  get("SablierFlow", "RefundFromFlowStream"),
  get("SablierFlow", "RestartFlowStream"),
  get("SablierFlow", "VoidFlowStream"),
  get("SablierFlow", "WithdrawFromFlowStream"),
];

// v1.1 event handlers are the same as v1.0 handlers because the ABIs are identical.
const v1_0Events = baseEvents;
const v1_1Events = baseEvents;

const flowEvents: IndexedEventMap = {
  SablierFlow: {
    "v1.0": v1_0Events,
    "v1.1": v1_1Events,
  },
} as const;

export default flowEvents;
