import type {
  SablierV2LockupLinear_v1_0_RenounceLockupStream_handler as Handler_v1_0,
  SablierV2LockupLinear_v1_1_RenounceLockupStream_handler as Handler_v1_1,
  SablierV2LockupLinear_v1_2_RenounceLockupStream_handler as Handler_v1_2,
  SablierLockup_v2_0_RenounceLockupStream_handler as Handler_v2_0,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";
import { Loader } from "./loader";

type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T> & Handler_v1_2<T> & Handler_v2_0<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const { stream, watcher } = loaderReturn;
  Store.Stream.exists(event, event.params.streamId, stream);
  Store.Watcher.exists(event.chainId, watcher);

  await Store.Action.create(context, event, watcher, {
    category: "Renounce",
    streamId: stream.id,
  });
};

export const renounceStream = { handler, loader: Loader.base };
