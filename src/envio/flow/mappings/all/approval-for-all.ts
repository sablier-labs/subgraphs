import { SablierFlow } from "@envio/flow/bindings";
import { createEntityAction, getWatcherOrThrow } from "@envio/flow/entities";
import { Flow as enums } from "@src/schema/enums";

SablierFlow.ApprovalForAll.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const watcher = await getWatcherOrThrow(context, event);
    return {
      watcher,
    };
  },
  /* -------------------------------------------------------------------------- */
  /*                                   HANDLER                                  */
  /* -------------------------------------------------------------------------- */
  handler: async ({ context, event, loaderReturn: loaded }) => {
    const { watcher } = loaded;

    await createEntityAction(context, watcher, event, {
      category: enums.ActionCategory.Approval,
      addressA: event.params.owner,
      addressB: event.params.operator,
      amountA: event.params.approved ? 1n : 0n,
    });
  },
});
