import { ADDRESS_ZERO } from "../../../common/constants";
import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/types";
import { EventTransfer } from "../../bindings";
import { Store } from "../../store";

export function handleTransfer(event: EventTransfer): void {
  // Filter out `Transfer` events emitted by the initial mint transaction.
  // See https://github.com/sablier-labs/indexers/issues/18
  if (event.params.from.equals(ADDRESS_ZERO)) {
    return;
  }

  const id = event.params.tokenId;
  const stream = Store.Stream.get(id);
  if (stream == null) {
    logError("Stream not saved before this Transfer event: {}", [id.toHexString()]);
    return;
  }

  Store.Action.create(event, {
    addressA: event.params.from,
    addressB: event.params.to,
    category: "Transfer",
    streamId: stream.id,
  } as ActionParams);

  stream.recipient = event.params.to;
  const parties = [stream.sender, event.params.to];

  if (stream.proxied === true) {
    // AssemblyScript requires an explicit copy. Pushing `stream.proxender` directly won't work.
    const proxender = stream.proxender;
    if (proxender !== null) {
      parties.push(proxender);
    }
  }
  stream.parties = parties;
  stream.save();
}
