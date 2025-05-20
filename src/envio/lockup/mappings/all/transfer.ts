import { ADDRESS_ZERO } from "@envio/common/constants";
import { LockupBase } from "@envio-lockup/bindings";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";
import { Loader } from "../loader";

LockupBase.Transfer.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
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
  },
});
