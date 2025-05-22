import { type Entity, SablierFlow_v1_0, SablierFlow_v1_1 } from "@envio-flow/bindings";
import type {
  SablierFlow_v1_0_ApprovalForAll_handler as Handler,
  SablierFlow_v1_0_ApprovalForAll_loader as Loader,
} from "@envio-flow/bindings/src/Types.gen";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */

type LoaderReturn = {
  watcher: Entity.Watcher;
};

const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const watcher = await Store.Watcher.getOrThrow(context, event.chainId);
  return {
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  const { watcher } = loaderReturn;

  await Store.Action.create(context, event, watcher, {
    addressA: event.params.owner,
    addressB: event.params.operator,
    amountA: event.params.approved ? 1n : 0n,
    category: enums.ActionCategory.Approval,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const input = { handler, loader };

SablierFlow_v1_0.ApprovalForAll.handlerWithLoader(input);

SablierFlow_v1_1.ApprovalForAll.handlerWithLoader(input);
