import _ from "lodash";
import { ADDRESS_ZERO } from "../../../common/constants";
import type {
  SablierV2LockupLinear_v1_0_Transfer_handler as Handler_v1_0,
  SablierV2LockupLinear_v1_1_Transfer_handler as Handler_v1_1,
  SablierV2LockupLinear_v1_2_Transfer_handler as Handler_v1_2,
  SablierLockup_v2_0_Transfer_handler as Handler_v2_0,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";
import { Loader } from "./loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */
type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T> & Handler_v1_2<T> & Handler_v2_0<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  // Exclude `Transfer` events emitted by the initial mint transaction.
  // See https://github.com/sablier-labs/indexers/issues/18
  if (event.params.from === ADDRESS_ZERO) {
    return;
  }

  let { stream, watcher } = loaderReturn;

  /* --------------------------------- STREAM --------------------------------- */
  const currentRecipient = event.params.from.toLowerCase();
  const newRecipient = event.params.to.toLowerCase();
  if (stream.parties.includes(currentRecipient)) {
    stream = {
      ...stream,
      parties: _.without(stream.parties, currentRecipient).concat(newRecipient),
      recipient: newRecipient,
    };
    context.Stream.set(stream);
  } else {
    console.error("Current recipient not found in parties: {}", [currentRecipient]);
  }

  /* --------------------------------- ACTION --------------------------------- */
  await Store.Action.create(context, event, watcher, {
    addressA: event.params.from,
    addressB: event.params.to,
    category: "Transfer",
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const transfer = { handler, loader: Loader.base };
