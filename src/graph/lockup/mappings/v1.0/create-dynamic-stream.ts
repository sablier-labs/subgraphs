import { CreateLockupDynamicStream as EventCreateDynamicV1_0 } from "../../bindings/SablierV2LockupDynamic_v1_0/SablierV2LockupDynamic";
import { convertSegmentsV1_0 } from "../../helpers";
import { Store } from "../../store";

export function handleCreateLockupDynamicStream(event: EventCreateDynamicV1_0): void {
  const params = event.params;
  Store.Stream.createDynamic(
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
      shape: null,
      startTime: params.range.start,
      tokenId: params.streamId,
      transferable: true,
    },
    {
      segments: convertSegmentsV1_0(params.segments),
    },
  );
}
