import { ethereum } from "@graphprotocol/graph-ts";
import { logError } from "../../../common/logger";
import { CommonParams } from "../../../common/types";
import { Params } from "../../helpers/types";
import { Store } from "../../store";

export function handleCancelLockupStream(event: ethereum.Event, params: Params.CancelStream): void {
  const tokenId = params.streamId;
  const stream = Store.Stream.get(tokenId);
  if (stream === null) {
    logError("Stream not saved before this CancelLockupStream event: {}", [tokenId.toHexString()]);
    return;
  }

  /* --------------------------------- ACTION --------------------------------- */
  const action = Store.Action.create(event, {
    addressA: params.sender,
    addressB: params.recipient,
    amountA: params.senderAmount,
    amountB: params.recipientAmount,
    category: "Cancel",
    streamId: stream.id,
  } as CommonParams.Action);

  /* --------------------------------- STREAM --------------------------------- */
  stream.cancelable = false;
  stream.canceled = true;
  stream.canceledAction = action.id;
  stream.canceledTime = event.block.timestamp;
  stream.intactAmount = params.recipientAmount; // The only amount remaining in the stream is the recipient amount
  stream.save();
}
