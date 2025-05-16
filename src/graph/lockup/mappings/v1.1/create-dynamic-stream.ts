import { CreateLockupDynamicStream as EventCreateDynamicV1_1 } from "../../bindings/SablierV2LockupDynamic_v1_1/SablierV2LockupDynamic";
import { convertSegmentsV1_1 } from "../../helpers";
import { processCreateDynamic } from "../processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupDynamic
 */
export function handleCreateLockupDynamicStream(event: EventCreateDynamicV1_1): void {
  processCreateDynamic(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupDynamic",
      depositAmount: event.params.amounts.deposit,
      endTime: event.params.range.end,
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.range.start,
      tokenId: event.params.streamId,
      transferable: event.params.transferable,
    },
    {
      segments: convertSegmentsV1_1(event.params.segments),
    },
  );
}
