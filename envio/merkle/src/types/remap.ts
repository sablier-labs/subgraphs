import type {
  /** Event: Claim (Merkle) */
  MerkleLockupV21_Claim_eventArgs as EventClaimArgs_V21_V22,
  /** Event: Clawback (Merkle) */
  MerkleLockupV21_Clawback_eventArgs as EventClawbackArgs_V21_V22,
  MerkleLockupFactoryV23_CreateMerkleInstant_eventArgs as EventCreateInstantArgs_V23,
  /** Event: Create Linear (Factory) */
  MerkleLockupFactoryV21_CreateMerkleStreamerLL_eventArgs as EventCreateLinearArgs_V21,
  MerkleLockupFactoryV22_CreateMerkleLL_eventArgs as EventCreateLinearArgs_V22,
  MerkleLockupFactoryV23_CreateMerkleLL_eventArgs as EventCreateLinearArgs_V23,
  /** Event: Create Tranched (Factory) */
  MerkleLockupFactoryV22_CreateMerkleLT_eventArgs as EventCreateTranchedArgs_V22,
  MerkleLockupFactoryV23_CreateMerkleLT_eventArgs as EventCreateTranchedArgs_V23,
  MerkleInstant_Claim_eventArgs as EventInstantClaimArgs_V23,
  /** Event: Transfer Admin (Merkle) */
  MerkleLockupV21_TransferAdmin_eventArgs as EventTransferAdminArgs_V21_V22,
  MerkleInstant_TransferAdmin_eventArgs as EventTransferAdminArgs_V23,
} from "../../generated/src/Types.gen";
import type { Handler, Loader, Register } from "./general";

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export type CreateLinearArgs_V21 = EventCreateLinearArgs_V21;
export type CreateLinearArgs_V22 = EventCreateLinearArgs_V22;
export type CreateLinearArgs_V23 = EventCreateLinearArgs_V23;
export type CreateLinearArgs = EventCreateLinearArgs_V21 | EventCreateLinearArgs_V22;
export type CreateTranchedArgs_V22 = EventCreateTranchedArgs_V22;
export type CreateTranchedArgs_V23 = EventCreateTranchedArgs_V23;
export type CreateTranchedArgs = EventCreateTranchedArgs_V22 | EventCreateTranchedArgs_V23;
export type CreateInstantArgs_V23 = EventCreateInstantArgs_V23;
export type ClaimArgs = EventClaimArgs_V21_V22;
export type InstantClaimArgs = EventInstantClaimArgs_V23;
export type ClawbackArgs = EventClawbackArgs_V21_V22;
export type TransferAdminArgs = EventTransferAdminArgs_V21_V22 | EventTransferAdminArgs_V23;

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export type CreateLinearLoader_V21 = Loader<CreateLinearArgs_V21>;
export type CreateLinearHandler_V21<L extends (_1: Loader<E>) => Promise<object>, E = CreateLinearArgs_V21> = Handler<
  E,
  Awaited<ReturnType<L>>
>;
export type CreateLinearRegister_V21<E = CreateLinearArgs_V21> = Register<E>;

export type CreateLinearLoader_V22 = Loader<CreateLinearArgs_V22>;
export type CreateLinearHandler_V22<L extends (_1: Loader<E>) => Promise<object>, E = CreateLinearArgs_V22> = Handler<
  E,
  Awaited<ReturnType<L>>
>;
export type CreateLinearRegister_V22<E = CreateLinearArgs_V22> = Register<E>;

export type CreateLinearLoader_V23 = Loader<CreateLinearArgs_V23>;
export type CreateLinearHandler_V23<L extends (_1: Loader<E>) => Promise<object>, E = CreateLinearArgs_V23> = Handler<
  E,
  Awaited<ReturnType<L>>
>;
export type CreateLinearRegister_V23<E = CreateLinearArgs_V23> = Register<E>;

/** ------------------------------------------------------------- */

export type CreateTranchedLoader_V22 = Loader<CreateTranchedArgs_V22>;
export type CreateTranchedHandler_V22<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateTranchedArgs_V22,
> = Handler<E, Awaited<ReturnType<L>>>;
export type CreateTranchedRegister_V22<E = CreateTranchedArgs_V22> = Register<E>;

export type CreateTranchedLoader_V23 = Loader<CreateTranchedArgs_V23>;
export type CreateTranchedHandler_V23<
  L extends (_1: Loader<E>) => Promise<object>,
  E = CreateTranchedArgs_V23,
> = Handler<E, Awaited<ReturnType<L>>>;
export type CreateTranchedRegister_V23<E = CreateTranchedArgs_V23> = Register<E>;

export type CreateInstantLoader_V23 = Loader<CreateInstantArgs_V23>;
export type CreateInstantHandler_V23<L extends (_1: Loader<E>) => Promise<object>, E = CreateInstantArgs_V23> = Handler<
  E,
  Awaited<ReturnType<L>>
>;
export type CreateInstantRegister_V23<E = CreateInstantArgs_V23> = Register<E>;

/** ------------------------------------------------------------- */

export type ClaimLoader = Loader<ClaimArgs>;
export type ClaimHandler<L extends (_1: Loader<E>) => Promise<object>, E = ClaimArgs> = Handler<
  E,
  Awaited<ReturnType<L>>
>;

export type InstantClaimLoader = Loader<InstantClaimArgs>;
export type InstantClaimHandler<L extends (_1: Loader<E>) => Promise<object>, E = InstantClaimArgs> = Handler<
  E,
  Awaited<ReturnType<L>>
>;

/** ------------------------------------------------------------- */

export type ClawbackLoader = Loader<ClawbackArgs>;
export type ClawbackHandler<L extends (_1: Loader<E>) => Promise<object>, E = ClawbackArgs> = Handler<
  E,
  Awaited<ReturnType<L>>
>;

/** ------------------------------------------------------------- */

export type TransferAdminLoader = Loader<TransferAdminArgs>;
export type TransferAdminHandler<L extends (_1: Loader<E>) => Promise<object>, E = TransferAdminArgs> = Handler<
  E,
  Awaited<ReturnType<L>>
>;

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export type {
  Action,
  Activity,
  Asset,
  Campaign,
  Factory,
  Tranche,
  Watcher,
} from "../../generated/src/Types.gen";
