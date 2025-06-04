import { Flow as enums } from "../../../../schema/enums";
import type { SablierFlow_v1_0_WithdrawFromFlowStream_handler as Handler } from "../../bindings/src/Types.gen";
import { Store } from "../../store";
import { Loader } from "./loader";

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
    addressA: event.params.caller,
    addressB: event.params.to,
    amountA: event.params.withdrawAmount,
    category: enums.ActionCategory.Withdraw,
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

export const withdrawStream = { handler, loader: Loader.base };
