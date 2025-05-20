import { CreateLockupLinearStream as EventCreateLinearV1_0 } from "../../bindings/SablierV2LockupLinear_v1_0/SablierV2LockupLinear";
import { Processor } from "../processor";

export function handleCreateLockupLinearStream(event: EventCreateLinearV1_0): void {
  const params = event.params;
  Processor.Create.linear(
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
      shape: null,
      startTime: params.range.start,
      tokenId: params.streamId,
      transferable: true,
    },
    {
      cliffTime: params.range.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}
