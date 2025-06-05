import { Flow as enums } from "../../../../schema/enums";
import type { SablierFlow_v1_0_Approval_handler as Handler } from "../../bindings/src/Types.gen";
import { Store } from "../../store";
import { Loader } from "./loader";

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const { stream, watcher } = loaderReturn;

  await Store.Action.create(context, event, watcher, {
    addressA: event.params.owner,
    addressB: event.params.approved,
    category: enums.ActionCategory.Approval,
    streamId: stream.id,
  });
};

export const approval = { handler, loader: Loader.base };
