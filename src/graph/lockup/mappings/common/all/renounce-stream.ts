import { EventRenounceLockupStream } from "../../../bindings";
import { createEntityAction, loadEntityStream } from "../../../entities";
import { ActionParams } from "../../../params";

export function handleRenounceLockupStream(event: EventRenounceLockupStream): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    return;
  }

  const action = createEntityAction(event, { category: "Renounce", streamId: stream.id } as ActionParams);

  stream.cancelable = false;
  stream.renounceAction = action.id;
  stream.renounceTime = event.block.timestamp;

  stream.save();
}
