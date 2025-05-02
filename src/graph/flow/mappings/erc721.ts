import { ONE, ZERO } from "../../constants";
import { logInfo } from "../../logger";
import { EventApproval, EventApprovalForAll } from "../bindings";
import { createAction, getStreamByIdFromSource } from "../schema";

export function handleApproval(event: EventApproval): void {
  const id = event.params.tokenId;
  const stream = getStreamByIdFromSource(id);

  if (stream == null) {
    logInfo("Stream not saved before this ERC-721 approval event: {}", [id.toHexString()]);
    return;
  }

  const action = createAction(event);
  action.category = "Approval";

  action.addressA = event.params.owner;
  action.addressB = event.params.approved;

  action.stream = stream.id;
  action.save();
}

export function handleApprovalForAll(event: EventApprovalForAll): void {
  const action = createAction(event);
  action.category = "ApprovalForAll";

  action.addressA = event.params.owner;
  action.addressB = event.params.operator;
  action.amountA = event.params.approved ? ONE : ZERO;

  action.save();
}
