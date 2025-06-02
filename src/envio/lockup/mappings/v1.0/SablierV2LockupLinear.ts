import { Contract } from "@envio-lockup/bindings";
import { Lockup as enums } from "@src/schema/enums";
import { approval, approvalForAll, cancelStream, renounceStream, transfer, withdrawStream } from "../common";
import { createLinearStream } from "../common/create-stream";
import { Loader } from "../common/loader";

Contract.LockupLinear_v1_0.ApprovalForAll.handlerWithLoader(approvalForAll);
Contract.LockupLinear_v1_0.Approval.handlerWithLoader(approval);
Contract.LockupLinear_v1_0.CancelLockupStream.handlerWithLoader(cancelStream);
Contract.LockupLinear_v1_0.RenounceLockupStream.handlerWithLoader(renounceStream);
Contract.LockupLinear_v1_0.Transfer.handlerWithLoader(transfer);
Contract.LockupLinear_v1_0.WithdrawFromLockupStream.handlerWithLoader(withdrawStream);

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/lockup/blob/v1.0/src/types/DataTypes.sol
https://github.com/sablier-labs/lockup/blob/v1.0/src/interfaces/ISablierV2LockupLinear.sol#L28-L38
──────────────────────────────────────────────────────────────

struct Range {
    uint40 start; [0]
    uint40 cliff; [1]
    uint40 end;   [2]
}

event CreateLockupLinearStream(
    uint256 streamId,
    address funder,
    address indexed sender,
    address indexed recipient,
    Lockup.CreateAmounts amounts,
    IERC20 indexed asset,
    bool cancelable,
    bool transferable,
    LockupLinear.Range range,
    address broker
);
──────────────────────────────────────────────────────────────
*/
Contract.LockupLinear_v1_0.CreateLockupLinearStream.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const params = {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: enums.StreamCategory.LockupLinear,
      cliffTime: event.params.range[1],
      depositAmount: event.params.amounts[0],
      endTime: event.params.range[2],
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.range[0],
      tokenId: event.params.streamId,
      transferable: true, // all v1.0 streams are transferable
    };
    await createLinearStream({
      context,
      event,
      loaderReturn,
      params,
    });
  },
  loader: Loader.create["v1.0"],
});
