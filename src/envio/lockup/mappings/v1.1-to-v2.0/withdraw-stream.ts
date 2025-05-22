import { Contract } from "@envio-lockup/bindings";
import type {
  SablierV2LockupLinear_v1_1_WithdrawFromLockupStream_handler as Handler_v1_1,
  SablierV2LockupLinear_v1_2_WithdrawFromLockupStream_handler as Handler_v1_2,
  SablierLockup_v2_0_WithdrawFromLockupStream_handler as Handler_v2_0,
} from "@envio-lockup/bindings/src/Types.gen";
import { Loader } from "../loader";
import { Processor } from "../processor";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

type Handler<T> = Handler_v1_1<T> & Handler_v1_2<T> & Handler_v2_0<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  // This event has an extra `token` param that was not available in v1.0.
  await Processor.withdraw(context, event, loaderReturn, {
    amount: event.params.amount,
    streamId: event.params.streamId,
    to: event.params.to,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader: Loader.base, handler };

Contract.LockupLinear_v1_1.WithdrawFromLockupStream.handlerWithLoader(handlerWithLoader);
Contract.LockupDynamic_v1_1.WithdrawFromLockupStream.handlerWithLoader(handlerWithLoader);

Contract.LockupLinear_v1_2.WithdrawFromLockupStream.handlerWithLoader(handlerWithLoader);
Contract.LockupDynamic_v1_2.WithdrawFromLockupStream.handlerWithLoader(handlerWithLoader);
Contract.LockupTranched_v1_2.WithdrawFromLockupStream.handlerWithLoader(handlerWithLoader);

Contract.Lockup_v2_0.WithdrawFromLockupStream.handlerWithLoader(handlerWithLoader);
