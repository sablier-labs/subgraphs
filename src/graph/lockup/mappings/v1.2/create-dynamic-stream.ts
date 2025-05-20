import { CreateLockupDynamicStream as EventCreateDynamicV1_2 } from "../../bindings/SablierV2LockupDynamic_v1_2/SablierV2LockupDynamic";
import { convertSegmentsV1_2 } from "../../helpers";
import { Processor } from "../processor";

export function handleCreateLockupDynamicStream(event: EventCreateDynamicV1_2): void {
  const params = event.params;
  Processor.Create.dynamic(
    event,
    {
      asset: params.asset,
      cancelable: params.cancelable,
      category: "LockupDynamic",
      depositAmount: params.amounts.deposit,
      endTime: params.timestamps.end,
      funder: params.funder,
      recipient: params.recipient,
      sender: params.sender,
      shape: null,
      startTime: params.timestamps.start,
      tokenId: params.streamId,
      transferable: params.transferable,
    },
    {
      segments: convertSegmentsV1_2(params.segments),
    },
  );
}
