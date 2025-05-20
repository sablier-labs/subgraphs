import { LockupBase } from "@envio-lockup/bindings";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";
import { Loader } from "../loader";

LockupBase.Approval.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
    const { stream, watcher } = loaderReturn;

    await Store.Action.create(context, event, watcher, {
      category: enums.ActionCategory.Approval,
      addressA: event.params.owner,
      addressB: event.params.approved,
      streamId: stream.id,
    });
  },
});
