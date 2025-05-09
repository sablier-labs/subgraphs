export * from "./common/all";
export * from "./common/v1.1-to-v2.0";

import { CreateLockupDynamicStream as EventCreateDynamicV1_1 } from "../bindings/SablierV2LockupDynamic-v1.1/SablierV2LockupDynamic";
import { CreateLockupLinearStream as EventCreateLinearV1_1 } from "../bindings/SablierV2LockupLinear-v1.1/SablierV2LockupLinear";
import { convertSegmentsV1_1 } from "../convertors";
import { processCreateDynamic, processCreateLinear } from "./processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear
 */
export function handleCreateLockupLinearStream(event: EventCreateLinearV1_1): void {
  processCreateLinear(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupLinear",
      depositAmount: event.params.amounts.deposit,
      endTime: event.params.range.end,
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.range.start,
      tokenId: event.params.streamId,
      transferable: event.params.transferable,
    },
    {
      cliffTime: event.params.range.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}

/**
 * Handles events emitted by:
 * - SablierV2LockupDynamic
 */
export function handleCreateLockupDynamicStream(event: EventCreateDynamicV1_1): void {
  processCreateDynamic(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupDynamic",
      depositAmount: event.params.amounts.deposit,
      endTime: event.params.range.end,
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.range.start,
      tokenId: event.params.streamId,
      transferable: event.params.transferable,
    },
    {
      segments: convertSegmentsV1_1(event.params.segments),
    },
  );
}
