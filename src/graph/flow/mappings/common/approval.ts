import { logInfo } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventApproval } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";

export function handleApproval(event: EventApproval): void {
  const id = event.params.tokenId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logInfo("Stream not saved before this Approval event: {}", [id.toHexString()]);
    return;
  }

  createEntityAction(event, {
    addressA: event.params.owner,
    addressB: event.params.approved,
    category: "Approval",
    streamId: stream.id,
  } as ActionParams);
}
