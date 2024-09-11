import type {
  Action,
  ApprovalForAllHandler,
  ApprovalForAllLoader,
} from "../types";
import { FlowV22 } from "../../generated";
import { createAction, getOrCreateWatcher } from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: ApprovalForAllLoader) {
  const { context, event } = input;
  const watcherId = event.chainId.toString();
  const [watcher] = await Promise.all([context.Watcher.get(watcherId)]);

  return {
    watcher,
  };
}

async function handler(input: ApprovalForAllHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher =
    loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Approval,
    stream_id: undefined,

    /** --------------- */
    addressA: event.params.owner.toLowerCase(),
    addressB: event.params.operator.toLowerCase(),
    amountA: event.params.approved ? 1n : 0n,
  };

  watcher = post_action.watcher;

  context.Action.set(action);
  context.Watcher.set(watcher);
}

FlowV22.ApprovalForAll.handlerWithLoader({
  loader,
  handler,
});
