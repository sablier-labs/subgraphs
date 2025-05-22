import { Contract, type Entity } from "@envio-lockup/bindings";
import type {
  SablierV2LockupLinear_v1_0_ApprovalForAll_handler as Handler_v1_0,
  SablierV2LockupLinear_v1_1_ApprovalForAll_handler as Handler_v1_1,
  SablierV2LockupLinear_v1_2_ApprovalForAll_handler as Handler_v1_2,
  SablierLockup_v2_0_ApprovalForAll_handler as Handler_v2_0,
  SablierV2LockupLinear_v1_0_ApprovalForAll_loader as Loader_v1_0,
  SablierV2LockupLinear_v1_1_ApprovalForAll_loader as Loader_v1_1,
  SablierV2LockupLinear_v1_2_ApprovalForAll_loader as Loader_v1_2,
  SablierLockup_v2_0_ApprovalForAll_loader as Loader_v2_0,
} from "@envio-lockup/bindings/src/Types.gen";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */

type Loader<T> = Loader_v1_0<T> & Loader_v1_1<T> & Loader_v1_2<T> & Loader_v2_0<T>;

type LoaderReturn = {
  watcher: Entity.Watcher;
};

const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const watcher = await Store.Watcher.getOrThrow(context, event.chainId);
  return {
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T> & Handler_v1_2<T> & Handler_v2_0<T>;

const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  const { watcher } = loaderReturn;

  await Store.Action.create(context, event, watcher, {
    category: enums.ActionCategory.Approval,
    addressA: event.params.owner,
    addressB: event.params.operator,
    amountA: event.params.approved ? 1n : 0n,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader, handler };

Contract.LockupDynamic_v1_0.ApprovalForAll.handlerWithLoader(handlerWithLoader);
Contract.LockupLinear_v1_0.ApprovalForAll.handlerWithLoader(handlerWithLoader);

Contract.LockupDynamic_v1_1.ApprovalForAll.handlerWithLoader(handlerWithLoader);
Contract.LockupLinear_v1_1.ApprovalForAll.handlerWithLoader(handlerWithLoader);

Contract.LockupDynamic_v1_2.ApprovalForAll.handlerWithLoader(handlerWithLoader);
Contract.LockupLinear_v1_2.ApprovalForAll.handlerWithLoader(handlerWithLoader);
Contract.LockupTranched_v1_2.ApprovalForAll.handlerWithLoader(handlerWithLoader);

Contract.Lockup_v2_0.ApprovalForAll.handlerWithLoader(handlerWithLoader);
