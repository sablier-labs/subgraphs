import { ActionParams } from "../../../common/types";
import { EventCreate } from "../../bindings";
import { Store } from "../../store";

export function handleCreateFlowStream(event: EventCreate): void {
  const stream = Store.Stream.create(event);
  Store.Action.create(event, {
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.ratePerSecond,
    category: "Create",
    streamId: stream.id,
  } as ActionParams);
}
