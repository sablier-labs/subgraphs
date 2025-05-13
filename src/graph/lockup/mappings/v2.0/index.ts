export * from "../common/all";
export * from "../common/v1.1-to-v2.0";

import {
  CreateLockupDynamicStream as EventCreateDynamicV2_0,
  CreateLockupLinearStream as EventCreateLinearV2_0,
  CreateLockupTranchedStream as EventCreateTranchedV2_0,
} from "../../bindings/SablierLockup_v2_0/SablierLockup";
import { convertSegmentsV2_0, convertTranchesV2_0 } from "../../helpers";
import { processCreateDynamic, processCreateLinear, processCreateTranched } from "../processors";

export function handleCreateLockupLinearStream(event: EventCreateLinearV2_0): void {
  processCreateLinear(
    event,
    {
      asset: event.params.commonParams.token,
      cancelable: event.params.commonParams.cancelable,
      category: "LockupLinear",
      depositAmount: event.params.commonParams.amounts.deposit,
      endTime: event.params.commonParams.timestamps.end,
      funder: event.params.commonParams.funder,
      recipient: event.params.commonParams.recipient,
      sender: event.params.commonParams.sender,
      startTime: event.params.commonParams.timestamps.start,
      tokenId: event.params.streamId,
      transferable: event.params.commonParams.transferable,
    },
    {
      cliffTime: event.params.cliffTime,
      unlockAmountCliff: event.params.unlockAmounts.cliff,
      unlockAmountStart: event.params.unlockAmounts.start,
    },
  );
}

export function handleCreateLockupDynamicStream(event: EventCreateDynamicV2_0): void {
  processCreateDynamic(
    event,
    {
      asset: event.params.commonParams.token,
      cancelable: event.params.commonParams.cancelable,
      category: "LockupDynamic",
      depositAmount: event.params.commonParams.amounts.deposit,
      endTime: event.params.commonParams.timestamps.end,
      funder: event.params.commonParams.funder,
      recipient: event.params.commonParams.recipient,
      sender: event.params.commonParams.sender,
      startTime: event.params.commonParams.timestamps.start,
      tokenId: event.params.streamId,
      transferable: event.params.commonParams.transferable,
    },
    {
      segments: convertSegmentsV2_0(event.params.segments),
    },
  );
}

export function handleCreateLockupTranchedStream(event: EventCreateTranchedV2_0): void {
  processCreateTranched(
    event,
    {
      asset: event.params.commonParams.token,
      cancelable: event.params.commonParams.cancelable,
      category: "LockupTranched",
      depositAmount: event.params.commonParams.amounts.deposit,
      endTime: event.params.commonParams.timestamps.end,
      funder: event.params.commonParams.funder,
      recipient: event.params.commonParams.recipient,
      sender: event.params.commonParams.sender,
      startTime: event.params.commonParams.timestamps.start,
      tokenId: event.params.streamId,
      transferable: event.params.commonParams.transferable,
    },
    {
      tranches: convertTranchesV2_0(event.params.tranches),
    },
  );
}
