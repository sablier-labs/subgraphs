import { ADDRESS_ZERO } from "@envio-common/constants";
import { Contract } from "@envio-lockup/bindings";
import type {
  SablierV2LockupLinear_v1_0_Transfer_handler as Handler_v1_0,
  SablierV2LockupLinear_v1_1_Transfer_handler as Handler_v1_1,
  SablierV2LockupLinear_v1_2_Transfer_handler as Handler_v1_2,
  SablierLockup_v2_0_Transfer_handler as Handler_v2_0,
} from "@envio-lockup/bindings/src/Types.gen";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";
import { Loader } from "../loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */
type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T> & Handler_v1_2<T> & Handler_v2_0<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const watcher = loaderReturn.watcher;
  let stream = loaderReturn.stream;

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
  await Store.Action.create(context, event, watcher, {
    addressA: event.params.from,
    addressB: event.params.to,
    category: enums.ActionCategory.Transfer,
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const input = { handler, loader: Loader.base };

Contract.LockupDynamic_v1_0.Transfer.handlerWithLoader(input);
Contract.LockupLinear_v1_0.Transfer.handlerWithLoader(input);

Contract.LockupDynamic_v1_1.Transfer.handlerWithLoader(input);
Contract.LockupLinear_v1_1.Transfer.handlerWithLoader(input);

Contract.LockupDynamic_v1_2.Transfer.handlerWithLoader(input);
Contract.LockupLinear_v1_2.Transfer.handlerWithLoader(input);
Contract.LockupTranched_v1_2.Transfer.handlerWithLoader(input);

Contract.Lockup_v2_0.Transfer.handlerWithLoader(input);
