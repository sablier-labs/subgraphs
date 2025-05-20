import { CreateLockupLinearStream as EventCreateLinearV1_2 } from "../../bindings/SablierV2LockupLinear_v1_2/SablierV2LockupLinear";
import { Processor } from "../processor";

export function handleCreateLockupLinearStream(event: EventCreateLinearV1_2): void {
  const params = event.params;
  Processor.Create.linear(
    event,
    {
      asset: params.asset,
      cancelable: params.cancelable,
      category: "LockupLinear",
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
      cliffTime: params.timestamps.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}
