import { CreateLockupTranchedStream as EventCreateTranchedV1_2 } from "../../bindings/SablierV2LockupTranched_v1_2/SablierV2LockupTranched";
import { convertTranchesV1_2 } from "../../helpers";
import { processCreateTranched } from "../processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupTranched
 */
export function handleCreateLockupTranchedStream(event: EventCreateTranchedV1_2): void {
  processCreateTranched(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupTranched",
      depositAmount: event.params.amounts.deposit,
      endTime: event.params.timestamps.end,
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.timestamps.start,
      tokenId: event.params.streamId,
      transferable: event.params.transferable,
    },
    {
      tranches: convertTranchesV1_2(event.params.tranches),
    },
  );
}
