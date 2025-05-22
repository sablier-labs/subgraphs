import { ADDRESS_ZERO } from "@envio-common/constants";
import { SablierFlow_v1_0, SablierFlow_v1_1 } from "@envio-flow/bindings";
import type { SablierFlow_v1_0_Transfer_handler as Handler } from "@envio-flow/bindings/src/Types.gen";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const watcher = loaderReturn.watcher;
  let stream = loaderReturn.stream;

  // We exclude `Transfer` events emitted by the initial mint transaction.
  // See https://github.com/sablier-labs/indexers/issues/18
  if (event.params.from === ADDRESS_ZERO) {
    return;
  }

  /* --------------------------------- STREAM --------------------------------- */
  stream = {
    ...stream,
    recipient: event.params.to.toLowerCase(),
  };
  context.Stream.set(stream);

  /* --------------------------------- ACTION --------------------------------- */
  await Store.Action.create(context, event, watcher, {
    category: enums.ActionCategory.Transfer,
    streamId: stream.id,
    addressA: event.params.from,
    addressB: event.params.to,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader: Loader.base, handler };

SablierFlow_v1_0.Transfer.handlerWithLoader(handlerWithLoader);

SablierFlow_v1_1.Transfer.handlerWithLoader(handlerWithLoader);
