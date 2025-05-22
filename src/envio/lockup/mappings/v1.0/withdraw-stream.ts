import { Contract } from "@envio-lockup/bindings";
import type { SablierV2LockupLinear_v1_0_WithdrawFromLockupStream_handler as Handler } from "@envio-lockup/bindings/src/Types.gen";
import { Loader } from "../loader";
import { Processor } from "../processor";

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  await Processor.withdraw(context, event, loaderReturn, {
    amount: event.params.amount,
    streamId: event.params.streamId,
    to: event.params.to,
  });
};

const input = { handler, loader: Loader.base };

Contract.LockupLinear_v1_0.WithdrawFromLockupStream.handlerWithLoader(input);
Contract.LockupDynamic_v1_0.WithdrawFromLockupStream.handlerWithLoader(input);
