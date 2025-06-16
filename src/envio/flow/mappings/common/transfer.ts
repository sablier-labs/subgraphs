import { ADDRESS_ZERO } from "../../../common/constants";
import type {
  SablierFlow_v1_0_Transfer_handler as Handler_v1_0,
  SablierFlow_v1_1_Transfer_handler as Handler_v1_1,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";
import { Loader } from "./loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T>;

export const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  // Exclude `Transfer` events emitted by the initial mint transaction.
  // See https://github.com/sablier-labs/indexers/issues/18
  if (event.params.from === ADDRESS_ZERO) {
    return;
  }

  let { stream, watcher } = loaderReturn;

  /* --------------------------------- STREAM --------------------------------- */
  const currentRecipient = event.params.from.toLowerCase();
  const newRecipient = event.params.to.toLowerCase();
  stream = {
    ...stream,
    recipient: newRecipient,
  };
  context.Stream.set(stream);

  /* --------------------------------- ACTION --------------------------------- */
  await Store.Action.create(context, event, watcher, {
    addressA: currentRecipient,
    addressB: newRecipient,
    category: "Transfer",
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const transfer = { handler, loader: Loader.base };
