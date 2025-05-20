import { SablierV2LockupLinear_v1_1 } from "@envio-lockup/bindings";
import { Loader } from "../loader";
import { Processor } from "../processor";

/**
 * Handles events emitted by all contracts with the same ABI for the `CancelLockupStream` event.
 * - SablierV2LockupLinear_v1_1
 * - SablierV2LockupDynamic_v1_1
 * - SablierV2LockupLinear_v1_2
 * - SablierV2LockupDynamic_v1_2
 * - SablierV2LockupTranched_v1_2
 * - SablierLockup_v2_0
 */
SablierV2LockupLinear_v1_1.WithdrawFromLockupStream.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
    await Processor.withdraw(context, event, loaderReturn, {
      amount: event.params.amount,
      streamId: event.params.streamId,
      to: event.params.to,
    });
  },
});
