import type { Manifest } from "../../types";
import { resolveEventHandler as resolve } from "../helpers";
import adminable from "./adminable";
import erc721 from "./erc721";

const commonEventHandlers: Manifest.EventHandler[] = [
  ...adminable,
  ...erc721,
  resolve("SablierFlow", "AdjustFlowStream"),
  resolve("SablierFlow", "CreateFlowStream"),
  resolve("SablierFlow", "DepositFlowStream"),
  resolve("SablierFlow", "PauseFlowStream"),
  resolve("SablierFlow", "RefundFromFlowStream"),
  resolve("SablierFlow", "RestartFlowStream"),
  resolve("SablierFlow", "VoidFlowStream"),
  resolve("SablierFlow", "WithdrawFromFlowStream"),
];

const flowEventHandlers = {
  "v1.0": commonEventHandlers,
  "v1.1": commonEventHandlers,
};

export default flowEventHandlers;
