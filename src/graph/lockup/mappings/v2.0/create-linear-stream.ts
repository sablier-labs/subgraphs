import { CreateLockupLinearStream as EventCreateLinearV2_0 } from "../../bindings/SablierLockup_v2_0/SablierLockup";
import { Processor } from "../processor";

export function handleCreateLockupLinearStream(event: EventCreateLinearV2_0): void {
  const allParams = event.params;
  const commonParams = allParams.commonParams;
  Processor.Create.linear(
    event,
    {
      asset: commonParams.token,
      cancelable: commonParams.cancelable,
      category: "LockupLinear",
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
      cliffTime: allParams.cliffTime,
      unlockAmountCliff: allParams.unlockAmounts.cliff,
      unlockAmountStart: allParams.unlockAmounts.start,
    },
  );
}
