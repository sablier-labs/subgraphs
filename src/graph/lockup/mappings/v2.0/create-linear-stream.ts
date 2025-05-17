import { CreateLockupLinearStream as EventCreateLinearV2_0 } from "../../bindings/SablierLockup_v2_0/SablierLockup";
import { processCreateLinear } from "../processors";

export function handleCreateLockupLinearStream(event: EventCreateLinearV2_0): void {
  const allParams = event.params;
  const commonParams = allParams.commonParams;
  processCreateLinear(
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
