import { SablierV2LockupLinear_v1_0 } from "@envio-lockup/bindings";
import { Loader } from "../loader";
import { Processor } from "../processor";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear_v1_0
 * - SablierV2LockupDynamic_v1_0
 */
SablierV2LockupLinear_v1_0.WithdrawFromLockupStream.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
    await Processor.withdraw(context, event, loaderReturn, {
      amount: event.params.amount,
      streamId: event.params.streamId,
      to: event.params.to,
    });
  },
});
