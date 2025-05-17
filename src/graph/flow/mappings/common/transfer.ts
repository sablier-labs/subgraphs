import { ADDRESS_ZERO } from "../../../common/constants";
import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventTransfer } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";

export function handleTransfer(event: EventTransfer): void {
  // We exclude `Transfer` events emitted by the initial mint transaction.
  // See https://github.com/sablier-labs/indexers/issues/18
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

  /* --------------------------------- ACTION --------------------------------- */
  createEntityAction(event, {
    addressA: event.params.from,
    addressB: event.params.to,
    category: "Transfer",
    streamId: stream.id,
  } as ActionParams);
}
