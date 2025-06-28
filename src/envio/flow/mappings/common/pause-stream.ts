import { CommonStore } from "../../../common/store";
import type { Entity } from "../../bindings";
import type {
  SablierFlow_v1_0_PauseFlowStream_handler as Handler_v1_0,
  SablierFlow_v1_1_PauseFlowStream_handler as Handler_v1_1,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";
import { Loader } from "./loader";

type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const { stream, watcher } = loaderReturn;

  /* --------------------------------- STREAM --------------------------------- */

  // Paused is actually an adjustment with the new rate set to zero.
  const now = BigInt(event.block.timestamp);
  const elapsedTime = now - stream.lastAdjustmentTimestamp;
  const streamedAmount = stream.ratePerSecond * elapsedTime;
  const snapshotAmount = stream.snapshotAmount + streamedAmount;

  let updatedStream: Entity.Stream = {
    ...stream,
    lastAdjustmentTimestamp: now,
    paused: true,
    pausedTime: now,
    ratePerSecond: 0n,
    snapshotAmount,
  };

  /* --------------------------------- ACTION --------------------------------- */

  const action = await Store.Action.create(context, event, watcher, {
    addressA: event.params.recipient,
    addressB: event.params.sender,
    amountA: event.params.totalDebt,
    category: "Pause",
    streamId: stream.id,
  });
  updatedStream = {
    ...stream,
    lastAdjustmentAction_id: action.id,
    pausedAction_id: action.id,
  };
  context.Stream.set(updatedStream);

  /* --------------------------------- WATCHER -------------------------------- */
  await CommonStore.Watcher.incrementActionCounter(context, watcher);
};

export const pauseStream = { handler, loader: Loader.base };
