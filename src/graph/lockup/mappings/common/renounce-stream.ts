import { ethereum } from "@graphprotocol/graph-ts";
import { CommonParams } from "../../../common/types";
import { Params } from "../../helpers/types";
import { Store } from "../../store";

export function handleRenounceLockupStream(event: ethereum.Event, params: Params.RenounceStream): void {
  const tokenId = params.streamId;
  const stream = Store.Stream.get(tokenId);
  if (stream === null) {
    return;
  }

  /* --------------------------------- ACTION --------------------------------- */
  const action = Store.Action.create(event, { category: "Renounce", streamId: stream.id } as CommonParams.Action);

  /* --------------------------------- STREAM --------------------------------- */
  stream.cancelable = false;
  stream.renounceAction = action.id;
  stream.renounceTime = event.block.timestamp;
  stream.save();
}
