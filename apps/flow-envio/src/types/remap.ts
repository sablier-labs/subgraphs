import type {
  /** Event: Adjust Flow stream */
  FlowV10_AdjustFlowStream_eventArgs as EventAdjustArgs_V10,
  /** Event: Approval (NFT) */
  FlowV10_Approval_eventArgs as EventApprovalArgs_V10,
  /** Event: ApprovalForAll (NFT) */
  FlowV10_ApprovalForAll_eventArgs as EventApprovalForAllArgs_V10,
  /** Event: Create Create Flow Stream */
  FlowV10_CreateFlowStream_eventArgs as EventCreateArgs_V10,
  /** Event: Deposit */
  FlowV10_DepositFlowStream_eventArgs as EventDepositArgs_V10,
  /** Event: Pause */
  FlowV10_PauseFlowStream_eventArgs as EventPauseArgs_V10,
  /** Event: Refund */
  FlowV10_RefundFromFlowStream_eventArgs as EventRefundArgs_V10,
  /** Event: Restart */
  FlowV10_RestartFlowStream_eventArgs as EventRestartArgs_V10,
  /** Event: Transfer (NFT) */
  FlowV10_Transfer_eventArgs as EventTransferArgs_V10,
  /** Event: TransferAdmin (Lockup) */
  FlowV10_TransferAdmin_eventArgs as EventTransferAdminArgs_V10,
  /** Event: Restart */
  FlowV10_VoidFlowStream_eventArgs as EventVoidArgs_V10,
  /** Event: Withdraw */
  FlowV10_WithdrawFromFlowStream_eventArgs as EventWithdrawArgs_V10,
} from "../../generated/src/Types.gen";

import type { Loader, Handler } from "./general";

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
export type AdjustArgs = EventAdjustArgs_V10;
export type ApprovalArgs = EventApprovalArgs_V10;
export type ApprovalForAllArgs = EventApprovalForAllArgs_V10;
export type CreateArgs = EventCreateArgs_V10;
export type DepositArgs = EventDepositArgs_V10;
export type PauseArgs = EventPauseArgs_V10;
export type RefundArgs = EventRefundArgs_V10;
export type RestartArgs = EventRestartArgs_V10;
export type TransferArgs = EventTransferArgs_V10;
export type TransferAdminArgs = EventTransferAdminArgs_V10;
export type VoidArgs = EventVoidArgs_V10;
export type WithdrawArgs = EventWithdrawArgs_V10;

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export type AdjustLoader = Loader<AdjustArgs>;
export type AdjustHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = AdjustArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type ApprovalLoader = Loader<ApprovalArgs>;
export type ApprovalHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = ApprovalArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type ApprovalForAllLoader = Loader<ApprovalForAllArgs>;
export type ApprovalForAllHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = ApprovalForAllArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type CreateLoader = Loader<CreateArgs>;
export type CreateHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type DepositLoader = Loader<DepositArgs>;
export type DepositHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = DepositArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type PauseLoader = Loader<PauseArgs>;
export type PauseHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = PauseArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type RefundLoader = Loader<RefundArgs>;
export type RefundHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = RefundArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type RestartLoader = Loader<RestartArgs>;
export type RestartHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = RestartArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type TransferLoader = Loader<TransferArgs>;
export type TransferHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = TransferArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type TransferAdminLoader = Loader<TransferAdminArgs>;
export type TransferAdminHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = TransferAdminArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type VoidLoader = Loader<VoidArgs>;
export type VoidHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = VoidArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */
export type WithdrawLoader = Loader<WithdrawArgs>;
export type WithdrawHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = WithdrawArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export type {
  Action,
  Asset,
  Batch,
  Batcher,
  Contract,
  Stream,
  Watcher,
} from "../../generated/src/Types.gen";
