import { Lockup as enums } from "../../../../schema/enums";
import type {
  SablierV2LockupLinear_v1_0_CancelLockupStream_handler as Handler_v1_0,
  SablierV2LockupLinear_v1_1_CancelLockupStream_handler as Handler_v1_1,
  SablierV2LockupLinear_v1_2_CancelLockupStream_handler as Handler_v1_2,
  SablierLockup_v2_0_CancelLockupStream_handler as Handler_v2_0,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";
import { Loader } from "./loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */
type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T> & Handler_v1_2<T> & Handler_v2_0<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const watcher = loaderReturn.watcher;
  let stream = loaderReturn.stream;

  /* --------------------------------- STREAM --------------------------------- */
  stream = {
    ...stream,
    cancelable: false,
    canceled: true,
    canceledTime: BigInt(event.block.timestamp),
    intactAmount: event.params.recipientAmount,
  };

  /* --------------------------------- ACTION --------------------------------- */
  const action = await Store.Action.create(context, event, watcher, {
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.senderAmount,
    amountB: event.params.recipientAmount,
    category: enums.ActionCategory.Cancel,
    streamId: stream.id,
  });
  stream = {
    ...stream,
    canceledAction_id: action.id,
  };
  await context.Stream.set(stream);
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

export const cancelStream = { handler, loader: Loader.base };
