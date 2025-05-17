import { Flow as enums } from "../../../../schema/enums";
import { ADDRESS_ZERO } from "../../../common/constants";
import { SablierFlow_v1_0 } from "../../bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "../../entities";

SablierFlow_v1_0.Transfer.handlerWithLoader({
  loader: async ({ context, event }) => {
    const stream = await getStreamOrThrow(context, event, event.params.tokenId);
    const watcher = await getWatcherOrThrow(context, event);

    return {
      stream,
      watcher,
    };
  },
  handler: async ({ context, event, loaderReturn: loaded }) => {
    const { watcher } = loaded;
    let { stream } = loaded;

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
    await createEntityAction(context, watcher, event, {
      category: enums.ActionCategory.Transfer,
      streamId: stream.id,
      addressA: event.params.from,
      addressB: event.params.to,
    });
  },
});
