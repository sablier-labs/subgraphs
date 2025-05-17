import { CreateLockupDynamicStream as EventCreateDynamicV1_1 } from "../../bindings/SablierV2LockupDynamic_v1_1/SablierV2LockupDynamic";
import { convertSegmentsV1_1 } from "../../helpers";
import { processCreateDynamic } from "../processors";

export function handleCreateLockupDynamicStream(event: EventCreateDynamicV1_1): void {
  const params = event.params;
  processCreateDynamic(
    event,
    {
      asset: params.asset,
      cancelable: params.cancelable,
      category: "LockupDynamic",
      depositAmount: params.amounts.deposit,
      endTime: params.range.end,
      funder: params.funder,
      recipient: params.recipient,
      sender: params.sender,
      startTime: params.range.start,
      tokenId: params.streamId,
      transferable: params.transferable,
    },
    {
      segments: convertSegmentsV1_1(params.segments),
    },
  );
}
