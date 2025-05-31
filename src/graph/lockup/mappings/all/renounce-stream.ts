import { CommonParams } from "../../../common/types";
import { EventRenounceLockupStream } from "../../bindings";
import { Store } from "../../store";

export function handleRenounceLockupStream(event: EventRenounceLockupStream): void {
  const tokenId = event.params.streamId;
  const stream = Store.Stream.get(tokenId);
  if (stream === null) {
    return;
  }

  const action = Store.Action.create(event, { category: "Renounce", streamId: stream.id } as CommonParams.Action);

  stream.cancelable = false;
  stream.renounceAction = action.id;
  stream.renounceTime = event.block.timestamp;

  stream.save();
}
