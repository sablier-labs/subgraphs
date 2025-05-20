import { SablierV2LockupLinear_v1_0 } from "@envio-lockup/bindings";
import { Loader } from "../loader";
import { Processor } from "../processor";

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
SablierV2LockupLinear_v1_0.CreateLockupLinearStream.handlerWithLoader({
  loader: Loader.create["v1.0"],
  handler: async ({ context, event, loaderReturn }) => {
    await Processor.Create.linear({
      context,
      loaderReturn,
      event,
      params: {
        asset: event.params.asset,
        cancelable: event.params.cancelable,
        category: "LockupLinear",
        cliffTime: event.params.range[1],
        depositAmount: event.params.amounts[0],
        endTime: event.params.range[2],
        funder: event.params.funder,
        recipient: event.params.recipient,
        sender: event.params.sender,
        startTime: event.params.range[0],
        tokenId: event.params.streamId,
        transferable: true, // all v1.0 streams are transferable
      },
    });
  },
});
