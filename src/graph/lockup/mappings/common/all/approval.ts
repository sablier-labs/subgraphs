import { logInfo } from "../../../../common/logger";
import { EventApproval } from "../../../bindings";
import { createEntityAction, loadEntityStream } from "../../../entities";
import { ActionParams } from "../../../params";

/* -------------------------------------------------------------------------- */
/*                                   ERC721                                   */
/* -------------------------------------------------------------------------- */

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
