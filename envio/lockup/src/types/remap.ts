import type {
  /** Event: Approval (NFT) */
  LockupV20_Approval_eventArgs as EventApprovalArgs_V20_V21_V22,
  /** Event: ApprovalForAll (NFT) */
  LockupV20_ApprovalForAll_eventArgs as EventApprovalForAllArgs_V20_V21_V22,
  /** Event: Cancel (Lockup) */
  LockupV20_CancelLockupStream_eventArgs as EventCancelArgs_V20,
  LockupV21_CancelLockupStream_eventArgs as EventCancelArgs_V21_V22,
  LockupV23_CancelLockupStream_eventArgs as EventCancelArgs_V23,
  /** Event: Create Dynamic (Lockup) */
  LockupV20_CreateLockupDynamicStream_eventArgs as EventCreateDynamicArgs_V20,
  LockupV21_CreateLockupDynamicStream_eventArgs as EventCreateDynamicArgs_V21,
  LockupV22_CreateLockupDynamicStream_eventArgs as EventCreateDynamicArgs_V22,
  LockupV23_CreateLockupDynamicStream_eventArgs as EventCreateDynamicArgs_V23,
  /** Event: Create Linear (Lockup) */
  LockupV20_CreateLockupLinearStream_eventArgs as EventCreateLinearArgs_V20,
  LockupV21_CreateLockupLinearStream_eventArgs as EventCreateLinearArgs_V21,
  LockupV22_CreateLockupLinearStream_eventArgs as EventCreateLinearArgs_V22,
  LockupV23_CreateLockupLinearStream_eventArgs as EventCreateLinearArgs_V23,
  /** Event: Create Tranched (Lockup) */
  LockupV22_CreateLockupTranchedStream_eventArgs as EventCreateTranchedArgs_V22,
  LockupV23_CreateLockupTranchedStream_eventArgs as EventCreateTranchedArgs_V23,
  /** Event: Renounce (Lockup) */
  LockupV20_RenounceLockupStream_eventArgs as EventRenounceArgs_V20_V21_V22,
  /** Event: TransferAdmin (Lockup) */
  LockupV20_TransferAdmin_eventArgs as EventTransferAdminArgs_V20_V21_V22,
  /** Event: Transfer (NFT) */
  LockupV20_Transfer_eventArgs as EventTransferArgs_V20_V21_V22,
  /** Event: Withdraw (Lockup) */
  LockupV20_WithdrawFromLockupStream_eventArgs as EventWithdrawArgs_V20,
  LockupV21_WithdrawFromLockupStream_eventArgs as EventWithdrawArgs_V21_V22,
  LockupV23_WithdrawFromLockupStream_eventArgs as EventWithdrawArgs_V23,
} from "../../generated/src/Types.gen";
import type { Handler, Loader } from "./general";

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export type CreateLinearArgs =
  | EventCreateLinearArgs_V20
  | EventCreateLinearArgs_V21
  | EventCreateLinearArgs_V22;
export type CreateDynamicArgs =
  | EventCreateDynamicArgs_V20
  | EventCreateDynamicArgs_V21
  | EventCreateDynamicArgs_V22;
export type CreateTranchedArgs = EventCreateTranchedArgs_V22;

export type CreateLinearMergedArgs = EventCreateLinearArgs_V23;
export type CreateDynamicMergedArgs = EventCreateDynamicArgs_V23;
export type CreateTranchedMergedArgs = EventCreateTranchedArgs_V23;

export type CancelArgs =
  | EventCancelArgs_V20
  | EventCancelArgs_V21_V22
  | EventCancelArgs_V23;
export type ApprovalArgs = EventApprovalArgs_V20_V21_V22;
export type ApprovalForAllArgs = EventApprovalForAllArgs_V20_V21_V22;
export type RenounceArgs = EventRenounceArgs_V20_V21_V22;
export type TransferArgs = EventTransferArgs_V20_V21_V22;
export type TransferAdminArgs = EventTransferAdminArgs_V20_V21_V22;
export type WithdrawArgs =
  | EventWithdrawArgs_V20
  | EventWithdrawArgs_V21_V22
  | EventWithdrawArgs_V23;

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

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

export type CancelLoader = Loader<CancelArgs>;
export type CancelHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CancelArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type CreateLinearLoader = Loader<CreateLinearArgs>;
export type CreateLinearHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateLinearArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

export type CreateLinearMergedLoader = Loader<CreateLinearMergedArgs>;
export type CreateLinearMergedHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateLinearMergedArgs,
> = Handler<E, Awaited<ReturnType<L>>>;
/** ------------------------------------------------------------- */

export type CreateDynamicLoader = Loader<CreateDynamicArgs>;
export type CreateDynamicHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateDynamicArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

export type CreateDynamicMergedLoader = Loader<CreateDynamicMergedArgs>;
export type CreateDynamicMergedHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateDynamicMergedArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type CreateTranchedLoader = Loader<CreateTranchedArgs>;
export type CreateTranchedHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateTranchedArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

export type CreateTranchedMergedLoader = Loader<CreateTranchedMergedArgs>;
export type CreateTranchedMergedHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateTranchedMergedArgs,
> = Handler<E, Awaited<ReturnType<L>>>;

/** ------------------------------------------------------------- */

export type RenounceLoader = Loader<RenounceArgs>;
export type RenounceHandler<
  L extends (_1: Loader<E>) => Promise<object>,
  E = RenounceArgs,
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
  Segment,
  Stream,
  Tranche,
  Watcher,
} from "../src/Types.gen";
