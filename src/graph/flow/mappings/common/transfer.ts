import { ADDRESS_ZERO } from "../../../common/constants";
import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventTransfer } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";

export function handleTransfer(event: EventTransfer): void {
  // As explained in issue #18, we filter out `Transfer` events emitted by the initial mint transaction.
  if (event.params.from.equals(ADDRESS_ZERO)) {
    return;
  }

  const id = event.params.tokenId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Transfer event: {}", [id.toHexString()]);
    return;
  }

  stream.recipient = event.params.to;
  stream.save();

  /* --------------------------------- Action --------------------------------- */
  createEntityAction(event, {
    addressA: event.params.from,
    addressB: event.params.to,
    category: "Transfer",
    streamId: stream.id,
  } as ActionParams);
}
