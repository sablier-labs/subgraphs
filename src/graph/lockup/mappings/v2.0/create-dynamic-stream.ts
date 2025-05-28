import { CreateLockupDynamicStream as EventCreateDynamicV2_0 } from "../../bindings/SablierLockup_v2_0/SablierLockup";
import { convertSegmentsV2_0 } from "../../helpers";
import { Store } from "../../store";

export function handleCreateLockupDynamicStream(event: EventCreateDynamicV2_0): void {
  const allParams = event.params;
  const commonParams = allParams.commonParams;
  Store.Stream.createDynamic(
    event,
    {
      asset: commonParams.token,
      cancelable: commonParams.cancelable,
      category: "LockupDynamic",
      depositAmount: commonParams.amounts.deposit,
      endTime: commonParams.timestamps.end,
      funder: commonParams.funder,
      recipient: commonParams.recipient,
      sender: commonParams.sender,
      shape: commonParams.shape,
      startTime: commonParams.timestamps.start,
      tokenId: allParams.streamId,
      transferable: commonParams.transferable,
    },
    {
      segments: convertSegmentsV2_0(event.params.segments),
    },
  );
}
