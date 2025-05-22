import { Contract } from "@envio-lockup/bindings";
import type {
  SablierV2LockupLinear_v1_0_Approval_handler as Handler_v1_0,
  SablierV2LockupLinear_v1_1_Approval_handler as Handler_v1_1,
  SablierV2LockupLinear_v1_2_Approval_handler as Handler_v1_2,
  SablierLockup_v2_0_Approval_handler as Handler_v2_0,
} from "@envio-lockup/bindings/src/Types.gen";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";
import { Loader } from "../loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T> & Handler_v1_2<T> & Handler_v2_0<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const { stream, watcher } = loaderReturn;

  await Store.Action.create(context, event, watcher, {
    category: enums.ActionCategory.Approval,
    addressA: event.params.owner,
    addressB: event.params.approved,
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader: Loader.base, handler };

Contract.LockupDynamic_v1_0.Approval.handlerWithLoader(handlerWithLoader);
Contract.LockupLinear_v1_0.Approval.handlerWithLoader(handlerWithLoader);

Contract.LockupDynamic_v1_1.Approval.handlerWithLoader(handlerWithLoader);
Contract.LockupLinear_v1_1.Approval.handlerWithLoader(handlerWithLoader);

Contract.LockupDynamic_v1_2.Approval.handlerWithLoader(handlerWithLoader);
Contract.LockupLinear_v1_2.Approval.handlerWithLoader(handlerWithLoader);
Contract.LockupTranched_v1_2.Approval.handlerWithLoader(handlerWithLoader);

Contract.Lockup_v2_0.Approval.handlerWithLoader(handlerWithLoader);
