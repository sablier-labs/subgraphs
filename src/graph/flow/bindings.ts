// Contracts
export { SablierFlow } from "./bindings/SablierFlow_v1_0/SablierFlow";

// Events
export {
  AdjustFlowStream as EventAdjust,
  Approval as EventApproval,
  ApprovalForAll as EventApprovalForAll,
  CreateFlowStream as EventCreate,
  DepositFlowStream as EventDeposit,
  PauseFlowStream as EventPause,
  RefundFromFlowStream as EventRefund,
  RestartFlowStream as EventRestart,
  Transfer as EventTransfer,
  TransferAdmin as EventTransferAdmin,
  VoidFlowStream as EventVoid,
  WithdrawFromFlowStream as EventWithdraw,
} from "./bindings/SablierFlow_v1_0/SablierFlow";

// Schema
// export type {
//   Action as EntityAction,
//   // Asset as EntityAsset,
//   Batch as EntityBatch,
//   Batcher as EntityBatcher,
//   Stream as EntityStream,
//   Watcher as EntityWatcher,
// } from "./bindings/schema";
import {
  Action as EntityAction,
  Asset as EntityAsset,
  Batch as EntityBatch,
  Batcher as EntityBatcher,
  Stream as EntityStream,
  Watcher as EntityWatcher,
} from "./bindings/schema";

export namespace Entity {
  export class Action extends EntityAction {}
  export class Asset extends EntityAsset {}
  export class Batch extends EntityBatch {}
  export class Batcher extends EntityBatcher {}
  export class Stream extends EntityStream {}
  export class Watcher extends EntityWatcher {}
}
