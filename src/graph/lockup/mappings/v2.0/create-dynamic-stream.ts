import { CreateLockupDynamicStream as EventCreateDynamicV2_0 } from "../../bindings/SablierLockup_v2_0/SablierLockup";
import { convertSegmentsV2_0 } from "../../helpers";
import { processCreateDynamic } from "../processors";

export function handleCreateLockupDynamicStream(event: EventCreateDynamicV2_0): void {
  processCreateDynamic(
    event,
    {
      asset: event.params.commonParams.token,
      cancelable: event.params.commonParams.cancelable,
      category: "LockupDynamic",
      depositAmount: event.params.commonParams.amounts.deposit,
      endTime: event.params.commonParams.timestamps.end,
      funder: event.params.commonParams.funder,
      recipient: event.params.commonParams.recipient,
      sender: event.params.commonParams.sender,
      startTime: event.params.commonParams.timestamps.start,
      tokenId: event.params.streamId,
      transferable: event.params.commonParams.transferable,
    },
    {
      segments: convertSegmentsV2_0(event.params.segments),
    },
  );
}
