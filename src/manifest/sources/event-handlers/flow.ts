import type { Config, Manifest } from "@src/types";
import erc721 from "./common/erc721";
import { resolveEventHandler } from "./resolver";

function resolve(eventName: string) {
  return resolveEventHandler({
    protocol: "flow",
    version: "v1.0",
    contractName: "SablierFlow",
    eventName,
  });
}

const baseHandlers: Manifest.EventHandler[] = [
  ...erc721,
  resolve("AdjustFlowStream"),
  resolve("CreateFlowStream"),
  resolve("DepositFlowStream"),
  resolve("PauseFlowStream"),
  resolve("RefundFromFlowStream"),
  resolve("RestartFlowStream"),
  resolve("VoidFlowStream"),
  resolve("WithdrawFromFlowStream"),
];

/** v1.1 event handlers are the same as v1.0 handlers because the ABIs are identical. */
const v1_0Handlers = baseHandlers;
const v1_1Handlers = baseHandlers;

const flowHandlers: Config.EventHandlers = {
  flow: {
    SablierFlow: {
      "v1.0": v1_0Handlers,
      "v1.1": v1_1Handlers,
    },
  },
} as const;

export default flowHandlers;
