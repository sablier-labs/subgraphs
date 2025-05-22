import { SablierFlow_v1_0, SablierFlow_v1_1 } from "@envio-flow/bindings";
import type { SablierFlow_v1_0_WithdrawFromFlowStream_handler as Handler } from "@envio-flow/bindings/src/Types.gen";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const watcher = loaderReturn.watcher;
  let stream = loaderReturn.stream;

  /* --------------------------------- STREAM --------------------------------- */

  stream = {
    ...stream,
    availableAmount: stream.availableAmount - event.params.withdrawAmount,
    withdrawnAmount: stream.withdrawnAmount + event.params.withdrawAmount,
  };
  context.Stream.set(stream);

  /* --------------------------------- ACTION --------------------------------- */
  await Store.Action.create(context, event, watcher, {
    category: enums.ActionCategory.Withdraw,
    streamId: stream.id,
    addressA: event.params.caller,
    addressB: event.params.to,
    amountA: event.params.withdrawAmount,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader: Loader.base, handler };

SablierFlow_v1_0.WithdrawFromFlowStream.handlerWithLoader(handlerWithLoader);

SablierFlow_v1_1.WithdrawFromFlowStream.handlerWithLoader(handlerWithLoader);
