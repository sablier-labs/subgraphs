import { SablierFlow_v1_0, SablierFlow_v1_1 } from "@envio-flow/bindings";
import type { SablierFlow_v1_0_Approval_handler as Handler } from "@envio-flow/bindings/src/Types.gen";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */
const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const { stream, watcher } = loaderReturn;

  await Store.Action.create(context, event, watcher, {
    category: enums.ActionCategory.Approval,
    addressA: event.params.owner,
    addressB: event.params.approved,
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader: Loader.base, handler };

SablierFlow_v1_0.Approval.handlerWithLoader(handlerWithLoader);

SablierFlow_v1_1.Approval.handlerWithLoader(handlerWithLoader);
