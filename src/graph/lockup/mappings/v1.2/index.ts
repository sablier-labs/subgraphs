export * from "../common/all";
export * from "../common/v1.1-to-v2.0";

import { CreateLockupDynamicStream as EventCreateDynamicV1_2 } from "../../bindings/SablierV2LockupDynamic_v1_2/SablierV2LockupDynamic";
import { CreateLockupLinearStream as EventCreateLinearV1_2 } from "../../bindings/SablierV2LockupLinear_v1_2/SablierV2LockupLinear";
import { CreateLockupTranchedStream as EventCreateTranchedV1_2 } from "../../bindings/SablierV2LockupTranched_v1_2/SablierV2LockupTranched";
import { convertSegmentsV1_2, convertTranchesV1_2 } from "../../helpers";
import { processCreateDynamic, processCreateLinear, processCreateTranched } from "../processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear
 */
export function handleCreateLockupLinearStream(event: EventCreateLinearV1_2): void {
  processCreateLinear(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupLinear",
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
      cliffTime: event.params.timestamps.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}

/**
 * Handles events emitted by:
 * - SablierV2LockupDynamic
 */
export function handleCreateLockupDynamicStream(event: EventCreateDynamicV1_2): void {
  processCreateDynamic(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupDynamic",
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
      segments: convertSegmentsV1_2(event.params.segments),
    },
  );
}

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
