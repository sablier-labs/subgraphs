import { LockupBase } from "@envio-lockup/bindings";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";

LockupBase.ApprovalForAll.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const watcher = await Store.Watcher.getOrThrow(context, event);
    return {
      watcher,
    };
  },
  /* -------------------------------------------------------------------------- */
  /*                                   HANDLER                                  */
  /* -------------------------------------------------------------------------- */
  handler: async ({ context, event, loaderReturn }) => {
    const { watcher } = loaderReturn;

    await Store.Action.create(context, event, watcher, {
      category: enums.ActionCategory.Approval,
      addressA: event.params.owner,
      addressB: event.params.operator,
      amountA: event.params.approved ? 1n : 0n,
    });
  },
});
