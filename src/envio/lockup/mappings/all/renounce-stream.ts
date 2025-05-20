import { LockupBase } from "@envio-lockup/bindings";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";
import { Loader } from "../loader";

LockupBase.RenounceLockupStream.handlerWithLoader({
  loader: Loader.base,
  /* -------------------------------------------------------------------------- */
  /*                                   HANDLER                                  */
  /* -------------------------------------------------------------------------- */
  handler: async ({ context, event, loaderReturn }) => {
    const { stream, watcher } = loaderReturn;

    await Store.Action.create(context, event, watcher, {
      category: enums.ActionCategory.Renounce,
      streamId: stream.id,
    });
  },
});
