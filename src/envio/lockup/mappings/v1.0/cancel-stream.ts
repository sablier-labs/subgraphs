import { SablierV2LockupLinear_v1_0 } from "@envio-lockup/bindings";
import { Loader } from "../loader";
import { Processor } from "../processor";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear_v1_0
 * - SablierV2LockupDynamic_v1_0
 */
SablierV2LockupLinear_v1_0.CancelLockupStream.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
    await Processor.cancel(context, event, loaderReturn, {
      recipient: event.params.recipient,
      recipientAmount: event.params.recipientAmount,
      sender: event.params.sender,
      senderAmount: event.params.senderAmount,
      streamId: event.params.streamId,
    });
  },
});
