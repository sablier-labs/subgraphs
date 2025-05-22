import { Contract } from "@envio-lockup/bindings";
import { convertSegments } from "@envio-lockup/helpers/segments";
import { Lockup as enums } from "@src/schema/enums";
import { Loader } from "../loader";
import { Processor } from "../processor";

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
    await Processor.Create.dynamic({
      context,
      event,
      loaderReturn,
      params,
    });
  },
  loader: Loader.create["v1.1"],
});
