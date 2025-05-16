import { CreateLockupDynamicStream as EventCreateDynamicV1_2 } from "../../bindings/SablierV2LockupDynamic_v1_2/SablierV2LockupDynamic";
import { convertSegmentsV1_2 } from "../../helpers";
import { processCreateDynamic } from "../processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupDynamic
 */
export function handleCreateLockupDynamicStream(event: EventCreateDynamicV1_2): void {
  processCreateDynamic(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupDynamic",
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
      segments: convertSegmentsV1_2(event.params.segments),
    },
  );
}
