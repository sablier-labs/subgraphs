import { Contract } from "@envio-lockup/bindings";
import type { SablierV2LockupLinear_v1_0_CancelLockupStream_handler as Handler } from "@envio-lockup/bindings/src/Types.gen";
import { Loader } from "../loader";
import { Processor } from "../processor";

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  await Processor.cancel(context, event, loaderReturn, {
    recipient: event.params.recipient,
    recipientAmount: event.params.recipientAmount,
    sender: event.params.sender,
    senderAmount: event.params.senderAmount,
    streamId: event.params.streamId,
  });
};

const input = { handler, loader: Loader.base };

Contract.LockupDynamic_v1_0.CancelLockupStream.handlerWithLoader(input);
Contract.LockupLinear_v1_0.CancelLockupStream.handlerWithLoader(input);
