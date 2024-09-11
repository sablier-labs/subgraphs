import type {
  /** Event: Adjust Flow stream */
  FlowV22_AdjustFlowStream_eventArgs as EventAdjustArgs_V22,
  /** Event: Approval (NFT) */
  FlowV22_Approval_eventArgs as EventApprovalArgs_V22,
  /** Event: ApprovalForAll (NFT) */
  FlowV22_ApprovalForAll_eventArgs as EventApprovalForAllArgs_V22,
  /** Event: Create Create Flow Stream */
  FlowV22_CreateFlowStream_eventArgs as EventCreateArgs_V22,
  /** Event: Deposit */
  FlowV22_DepositFlowStream_eventArgs as EventDepositArgs_V22,
  /** Event: Pause */
  FlowV22_PauseFlowStream_eventArgs as EventPauseArgs_V22,
  /** Event: Refund */
  FlowV22_RefundFromFlowStream_eventArgs as EventRefundArgs_V22,
  /** Event: Restart */
  FlowV22_RestartFlowStream_eventArgs as EventRestartArgs_V22,
  /** Event: Transfer (NFT) */
  FlowV22_Transfer_eventArgs as EventTransferArgs_V22,
  /** Event: TransferAdmin (Lockup) */
  FlowV22_TransferAdmin_eventArgs as EventTransferAdminArgs_V22,
  /** Event: Restart */
  FlowV22_VoidFlowStream_eventArgs as EventVoidArgs_V22,
  /** Event: Withdraw */
  FlowV22_WithdrawFromFlowStream_eventArgs as EventWithdrawArgs_V22,
} from "../../generated/src/Types.gen";

import type { Loader, Handler } from "./general";

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
export type AdjustArgs = EventAdjustArgs_V22;
export type ApprovalArgs = EventApprovalArgs_V22;
export type ApprovalForAllArgs = EventApprovalForAllArgs_V22;
export type CreateArgs = EventCreateArgs_V22;
export type DepositArgs = EventDepositArgs_V22;
export type PauseArgs = EventPauseArgs_V22;
export type RefundArgs = EventRefundArgs_V22;
export type RestartArgs = EventRestartArgs_V22;
export type TransferArgs = EventTransferArgs_V22;
export type TransferAdminArgs = EventTransferAdminArgs_V22;
export type VoidArgs = EventVoidArgs_V22;
export type WithdrawArgs = EventWithdrawArgs_V22;

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
