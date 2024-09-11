import { FlowV22 } from "../../generated";
import type { Action, ApprovalHandler, ApprovalLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: ApprovalLoader) {
  const { context, event } = input;
  const streamId = generateStreamId(
    event,
    event.srcAddress,
    event.params.tokenId,
  );
  const watcherId = event.chainId.toString();

  const [stream, watcher] = await Promise.all([
    context.Stream.get(streamId),
    context.Watcher.get(watcherId),
  ]);

  return {
    stream,
    watcher,
  };
}

async function handler(input: ApprovalHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher =
    loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let stream =
    loaded.stream ??
    (await getStream(event, event.params.tokenId, context.Stream.get));

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Approval,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.owner.toLowerCase(),
    addressB: event.params.approved.toLowerCase(),
  };

  watcher = post_action.watcher;

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV22.Approval.handlerWithLoader({
  loader,
  handler,
});
