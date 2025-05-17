import { ActionParams } from "../../../common/params";
import { EventCreate } from "../../bindings";
import { createEntityAction, createEntityStream } from "../../entities";

export function handleCreateFlowStream(event: EventCreate): void {
  const stream = createEntityStream(event);
  createEntityAction(event, {
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.ratePerSecond,
    category: "Create",
    streamId: stream.id,
  } as ActionParams);
}
