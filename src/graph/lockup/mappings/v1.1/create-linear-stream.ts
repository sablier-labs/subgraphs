import { CreateLockupLinearStream as EventCreateLinearV1_1 } from "../../bindings/SablierV2LockupLinear_v1_1/SablierV2LockupLinear";
import { Store } from "../../store";

export function handleCreateLockupLinearStream(event: EventCreateLinearV1_1): void {
  const params = event.params;
  Store.Stream.createLinear(
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
      transferable: params.transferable,
    },
    {
      cliffTime: params.range.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}
