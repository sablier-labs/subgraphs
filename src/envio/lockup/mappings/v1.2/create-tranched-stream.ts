import { SablierV2LockupTranched_v1_2 } from "@envio-lockup/bindings";
import { convertTranches } from "@envio-lockup/helpers/tranches";
import { Loader } from "../loader";
import { Processor } from "../processor";

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/lockup/blob/v1.2/src/types/DataTypes.sol
https://github.com/sablier-labs/lockup/blob/v1.2/src/interfaces/ISablierV2LockupTranched.sol#L29-L41

──────────────────────────────────────────────────────────────

struct Timestamps {
    uint40 start; [0]
    uint40 end;   [1]
}
struct Tranche {
    uint128 amount;   [0]
    uint40 timestamp; [1]
}

event CreateLockupTranchedStream(
    uint256 streamId,
    address funder,
    address indexed sender,
    address indexed recipient,
    Lockup.CreateAmounts amounts,
    IERC20 indexed asset,
    bool cancelable,
    bool transferable,
    LockupTranched.Tranche[] tranches,
    LockupTranched.Timestamps timestamps,
    address broker
);

──────────────────────────────────────────────────────────────
*/
SablierV2LockupTranched_v1_2.CreateLockupTranchedStream.handlerWithLoader({
  loader: Loader.create["v1.2"],
  handler: async ({ context, event, loaderReturn }) => {
    await Processor.Create.tranched({
      context,
      loaderReturn,
      event,
      params: {
        asset: event.params.asset,
        cancelable: event.params.cancelable,
        category: "LockupTranched",
        depositAmount: event.params.amounts[0],
        endTime: event.params.timestamps[1],
        funder: event.params.funder,
        recipient: event.params.recipient,
        sender: event.params.sender,
        startTime: event.params.timestamps[0],
        tokenId: event.params.streamId,
        transferable: event.params.transferable,
        tranches: convertTranches(event.params.tranches),
      },
    });
  },
});
