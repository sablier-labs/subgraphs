import { logInfo } from "../../../common/logger";
import { CommonParams } from "../../../common/types";
import { EventApproval } from "../../bindings";
import { Store } from "../../store";

export function handleApproval(event: EventApproval): void {
  const id = event.params.tokenId;
  const stream = Store.Stream.get(id);
  if (stream === null) {
    logInfo("Stream not saved before this Approval event: {}", [id.toHexString()]);
    return;
  }

  Store.Action.create(event, {
    addressA: event.params.owner,
    addressB: event.params.approved,
    category: "Approval",
    streamId: stream.id,
  } as CommonParams.Action);
}
