import { Lockup as enums } from "../../../../../schema/enums";
import { Contract } from "../../../bindings";
import { createLinearStream } from "../../common/create-stream";
import { Loader } from "../../common/loader";

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/lockup/blob/v2.0/src/types/DataTypes.sol#L147-L158
https://github.com/sablier-labs/lockup/blob/v2.0/src/types/DataTypes.sol#L316-L320
https://github.com/sablier-labs/lockup/blob/v2.0/src/interfaces/ISablierLockup.sol#L28-L33

──────────────────────────────────────────────────────────────

struct Timestamps {
    uint40 start; [0]
    uint40 end;   [1]
}
struct CreateEventCommon {
    address funder;               [0]
    address sender;               [1]
    address recipient;            [2]
    Lockup.CreateAmounts amounts; [3]
    IERC20 token;                 [4]
    bool cancelable;              [5]
    bool transferable;            [6]
    Lockup.Timestamps timestamps; [7]
    string shape;                 [8]
    address broker;               [9]
}
struct UnlockAmounts {
    uint128 start; [0]
    uint128 cliff; [1]
}

event CreateLockupLinearStream(
    uint256 indexed streamId,
    Lockup.CreateEventCommon commonParams,
    uint40 cliffTime,
    LockupLinear.UnlockAmounts unlockAmounts
);

──────────────────────────────────────────────────────────────
*/
Contract.Lockup_v2_0.CreateLockupLinearStream.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const commonParams = event.params.commonParams;
    const params = {
      asset: commonParams[4],
      cancelable: commonParams[5],
      category: enums.StreamCategory.LockupLinear,
      cliffTime: event.params.cliffTime,
      depositAmount: commonParams[3][0],
      endTime: commonParams[7][1],
      funder: commonParams[0],
      recipient: commonParams[2],
      sender: commonParams[1],
      shape: commonParams[8],
      startTime: commonParams[7][0],
      tokenId: event.params.streamId,
      transferable: commonParams[6],
      unlockAmountCliff: event.params.unlockAmounts[1],
      unlockAmountStart: event.params.unlockAmounts[0],
    };
    await createLinearStream({
      context,
      event,
      loaderReturn,
      params,
    });
  },
  loader: Loader.create["v2.0"],
});
