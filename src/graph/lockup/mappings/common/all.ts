/**
 * @file Common event handlers between all Lockup contracts.
 */
import { ADDRESS_ZERO, ONE, ZERO } from "../../../common/constants";
import { logError, logInfo } from "../../../common/logger";
import { EventApproval, EventApprovalForAll, EventRenounceLockupStream, EventTransfer } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";
import { ActionParams } from "../../params";

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

export function handleApprovalForAll(event: EventApprovalForAll): void {
  createEntityAction(event, {
    addressA: event.params.owner,
    addressB: event.params.operator,
    amountA: event.params.approved ? ONE : ZERO,
    category: "ApprovalForAll",
  } as ActionParams);
}

export function handleTransfer(event: EventTransfer): void {
  // Filter out `Transfer` events emitted by the initial mint transaction.
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

  createEntityAction(event, {
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

/* -------------------------------------------------------------------------- */
/*                                   Sablier                                  */
/* -------------------------------------------------------------------------- */

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
