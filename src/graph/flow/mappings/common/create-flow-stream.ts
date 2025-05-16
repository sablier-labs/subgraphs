import { ActionParams } from "../../../common/params";
import { EventCreate } from "../../bindings";
import { createEntityAction, createEntityStreamFlow } from "../../entities";

export function handleCreateFlowStream(event: EventCreate): void {
  const stream = createEntityStreamFlow(event);
  createEntityAction(event, {
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.ratePerSecond,
    category: "Create",
    streamId: stream.id,
  } as ActionParams);
}
