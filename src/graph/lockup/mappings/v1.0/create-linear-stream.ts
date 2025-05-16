export * from "../common/all";
import { CreateLockupLinearStream as EventCreateLinearV1_0 } from "../../bindings/SablierV2LockupLinear_v1_0/SablierV2LockupLinear";
import { processCreateLinear } from "../processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear
 */
export function handleCreateLockupLinearStream(event: EventCreateLinearV1_0): void {
  processCreateLinear(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupLinear",
      depositAmount: event.params.amounts.deposit,
      endTime: event.params.range.end,
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.range.start,
      tokenId: event.params.streamId,
      transferable: true,
    },
    {
      cliffTime: event.params.range.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}
