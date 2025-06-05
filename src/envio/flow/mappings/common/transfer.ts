import { Flow as enums } from "../../../../schema/enums";
import { ADDRESS_ZERO } from "../../../common/constants";
import type { Entity } from "../../bindings";
import type {
  SablierFlow_v1_0_Transfer_handler as Handler_v1_0,
  SablierFlow_v1_1_Transfer_handler as Handler_v1_1,
  SablierFlow_v1_0_Transfer_loader as Loader_v1_0,
  SablierFlow_v1_1_Transfer_loader as Loader_v1_1,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */

type LoaderReturn = {
  stream?: Entity.Stream;
  watcher?: Entity.Watcher;
};

type Loader<T> = Loader_v1_0<T> & Loader_v1_1<T>;

const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  // We exclude `Transfer` events emitted by the initial mint transaction.
  // See https://github.com/sablier-labs/indexers/issues/18
  if (event.params.from === ADDRESS_ZERO) {
    return {
      stream: undefined,
      watcher: undefined,
    };
  }

  const stream = await Store.Stream.getOrThrow(context, event, event.params.tokenId);
  const watcher = await Store.Watcher.getOrThrow(context, event.chainId);
  return {
    stream,
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T>;

export const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  let { stream, watcher } = loaderReturn;
  if (!stream || !watcher) {
    return;
  }

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
    category: enums.ActionCategory.Transfer,
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const transfer = { handler, loader };
