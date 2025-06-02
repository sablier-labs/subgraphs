import { Address, ethereum } from "@graphprotocol/graph-ts";
import { logError } from "../../../common/logger";
import { CommonParams } from "../../../common/types";
import { Params } from "../../helpers/types";
import { Store } from "../../store";

export function handleTransfer(event: ethereum.Event, params: Params.TransferNFT): void {
  // Filter out `Transfer` events emitted by the initial mint transaction.
  // See https://github.com/sablier-labs/indexers/issues/18
  if (params.from.equals(Address.zero())) {
    return;
  }

  const tokenId = params.tokenId;
  const stream = Store.Stream.get(tokenId);
  if (stream === null) {
    logError("Stream not saved before this Transfer event: {}", [tokenId.toHexString()]);
    return;
  }

  /* --------------------------------- STREAM --------------------------------- */
  const currentRecipient = params.from;
  const newRecipient = params.to;
  stream.recipient = newRecipient;
  const currentParties = stream.parties;

  // An index of -1 means the current recipient was not found in the parties array.
  const index = currentParties.indexOf(currentRecipient);
  if (index !== -1) {
    currentParties[index] = newRecipient;
    stream.parties = currentParties;
    stream.save();
    return;
  } else {
    logError("Current recipient not found in parties array: {}", [currentRecipient.toHexString()]);
  }

  /* --------------------------------- ACTION --------------------------------- */
  Store.Action.create(event, {
    addressA: currentRecipient,
    addressB: newRecipient,
    category: "Transfer",
    streamId: stream.id,
  } as CommonParams.Action);
}
