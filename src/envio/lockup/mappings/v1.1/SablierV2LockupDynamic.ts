import { Lockup as enums } from "../../../../schema/enums";
import { Contract } from "../../bindings";
import { convertSegments } from "../../helpers";
import { approval, approvalForAll, cancelStream, renounceStream, transfer, withdrawStream } from "../common";
import { createDynamicStream } from "../common/create-stream";
import { Loader } from "../common/loader";

Contract.LockupLinear_v1_1.ApprovalForAll.handlerWithLoader(approvalForAll);
Contract.LockupLinear_v1_2.Approval.handlerWithLoader(approval);
Contract.LockupLinear_v1_1.CancelLockupStream.handlerWithLoader(cancelStream);
Contract.LockupLinear_v1_1.RenounceLockupStream.handlerWithLoader(renounceStream);
Contract.LockupLinear_v1_1.Transfer.handlerWithLoader(transfer);
Contract.LockupLinear_v1_1.WithdrawFromLockupStream.handlerWithLoader(withdrawStream);

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/lockup/blob/v1.1/src/types/DataTypes.sol
https://github.com/sablier-labs/lockup/blob/v1.1/src/interfaces/ISablierV2LockupDynamic.sol#L29-L41

──────────────────────────────────────────────────────────────

struct Range {
    uint40 start; [0]
    uint40 end;   [1]
}
struct Segment {
    uint128 amount;   [0]
    UD2x18 exponent;  [1]
    uint40 milestone; [2]
}

event CreateLockupDynamicStream(
    uint256 streamId,
    address funder,
    address indexed sender,
    address indexed recipient,
    Lockup.CreateAmounts amounts,
    IERC20 indexed asset,
    bool cancelable,
    bool transferable,
    LockupDynamic.Segment[] segments,
    LockupDynamic.Range range,
    address broker
);

──────────────────────────────────────────────────────────────
*/
Contract.LockupDynamic_v1_1.CreateLockupDynamicStream.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const params = {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: enums.StreamCategory.LockupDynamic,
      depositAmount: event.params.amounts[0],
      endTime: event.params.range[1],
      funder: event.params.funder,
      recipient: event.params.recipient,
      segments: convertSegments(event.params.segments),
      sender: event.params.sender,
      startTime: event.params.range[0],
      tokenId: event.params.streamId,
      transferable: event.params.transferable,
    };
    await createDynamicStream({
      context,
      event,
      loaderReturn,
      params,
    });
  },
  loader: Loader.create["v1.1"],
});
