import _ from "lodash";
import { ADDRESS_ZERO } from "../../../common/constants";
import { type Entity } from "../../bindings";
import type {
  SablierV2LockupLinear_v1_0_Transfer_handler as Handler_v1_0,
  SablierV2LockupLinear_v1_1_Transfer_handler as Handler_v1_1,
  SablierV2LockupLinear_v1_2_Transfer_handler as Handler_v1_2,
  SablierLockup_v2_0_Transfer_handler as Handler_v2_0,
  SablierV2LockupLinear_v1_0_Transfer_loader as Loader_v1_0,
  SablierV2LockupLinear_v1_1_Transfer_loader as Loader_v1_1,
  SablierV2LockupLinear_v1_2_Transfer_loader as Loader_v1_2,
  SablierLockup_v2_0_Transfer_loader as Loader_v2_0,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";
import { Loader as LoaderBase } from "./loader";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */

type Loader<T> = Loader_v1_0<T> & Loader_v1_1<T> & Loader_v1_2<T> & Loader_v2_0<T>;

type LoaderReturn = {
  stream?: Entity.Stream;
  watcher?: Entity.Watcher;
};

const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  // Exclude `Transfer` events emitted by the initial mint transaction.
  // See https://github.com/sablier-labs/indexers/issues/18
  if (event.params.from === ADDRESS_ZERO) {
    return {
      stream: undefined,
      watcher: undefined,
    };
  }
  return LoaderBase.base({ context, event }).then((base) => ({
    stream: base.stream,
    watcher: base.watcher,
  }));
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */
type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T> & Handler_v1_2<T> & Handler_v2_0<T>;

const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  let { stream, watcher } = loaderReturn;
  if (!stream || !watcher) {
    return;
  }

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
    context.log.error("Current recipient not found in parties array", {
      currentRecipient,
      parties: stream.parties,
    });
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

export const transfer = { handler, loader };
