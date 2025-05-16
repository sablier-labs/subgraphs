import { CreateLockupLinearStream as EventCreateLinearV1_2 } from "../../bindings/SablierV2LockupLinear_v1_2/SablierV2LockupLinear";
import { processCreateLinear } from "../processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear
 */
export function handleCreateLockupLinearStream(event: EventCreateLinearV1_2): void {
  processCreateLinear(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupLinear",
      depositAmount: event.params.amounts.deposit,
      endTime: event.params.timestamps.end,
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.timestamps.start,
      tokenId: event.params.streamId,
      transferable: event.params.transferable,
    },
    {
      cliffTime: event.params.timestamps.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}
