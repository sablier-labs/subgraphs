import { CreateLockupTranchedStream as EventCreateTranchedV1_2 } from "../../bindings/SablierV2LockupTranched_v1_2/SablierV2LockupTranched";
import { convertTranchesV1_2 } from "../../helpers";
import { Store } from "../../store";

export function handleCreateLockupTranchedStream(event: EventCreateTranchedV1_2): void {
  const params = event.params;
  Store.Stream.createTranched(
    event,
    {
      asset: params.asset,
      cancelable: params.cancelable,
      category: "LockupTranched",
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
      tranches: convertTranchesV1_2(params.tranches),
    },
  );
}
