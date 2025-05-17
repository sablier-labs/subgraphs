import { CreateLockupLinearStream as EventCreateLinearV1_1 } from "../../bindings/SablierV2LockupLinear_v1_1/SablierV2LockupLinear";
import { processCreateLinear } from "../processors";

export function handleCreateLockupLinearStream(event: EventCreateLinearV1_1): void {
  const params = event.params;
  processCreateLinear(
    event,
    {
      asset: params.asset,
      cancelable: params.cancelable,
      category: "LockupLinear",
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
      cliffTime: params.range.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}
