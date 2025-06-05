import { Airdrops as enums } from "../../../../../schema/enums";
import { Contract } from "../../../bindings";
import { isOfficialLockup, type Params } from "../../../helpers";
import { createMerkleLL } from "../../common";
import { Loader } from "../../common/loader";

Contract.Factory.MerkleLockupFactory_v1_2.CreateMerkleLL.contractRegister(({ context, event }) => {
  const lockupAddress = event.params.lockupLinear;
  if (!isOfficialLockup(event.chainId, lockupAddress)) {
    throw new Error(`Unknown deployment of LockupLinear ${lockupAddress} used in airdrop campaign`);
  }
  context.addSablierV2MerkleLL_v1_2(lockupAddress);
});

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/v2-periphery/blob/v1.2.0/src/types/DataTypes.sol
https://github.com/sablier-labs/v2-periphery/blob/v1.2.0/src/interfaces/ISablierV2MerkleLockupFactory.sol#L20-L27
──────────────────────────────────────────────────────────────

event CreateMerkleLL(
    ISablierV2MerkleLL indexed merkleLL,
    MerkleLockup.ConstructorParams baseParams,
    ISablierV2LockupLinear lockupLinear,
    LockupLinear.Durations streamDurations,
    uint256 aggregateAmount,
    uint256 recipientCount
);

struct ConstructorParams {
    IERC20 asset;         [0]
    bool cancelable;      [1]
    uint40 expiration;    [2]
    address initialAdmin; [3]
    string ipfsCID;       [4]
    bytes32 merkleRoot;   [5]
    string name;          [6]
    bool transferable;    [7]
}

struct Durations {
    uint40 cliff; [0]
    uint40 total; [1]
}

──────────────────────────────────────────────────────────────
*/

Contract.Factory.MerkleLockupFactory_v1_2.CreateMerkleLL.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const baseParams = event.params.baseParams;
    const params: Params.CreateCampaignLL = {
      admin: baseParams[3],
      aggregateAmount: event.params.aggregateAmount,
      campaignAddress: event.params.merkleLL,
      cancelable: baseParams[1],
      category: enums.CampaignCategory.LockupLinear,
      cliffDuration: event.params.streamDurations[0],
      cliffPercentage: undefined,
      entities: loaderReturn,
      expiration: baseParams[2],
      ipfsCID: baseParams[4],
      lockup: event.params.lockupLinear,
      merkleRoot: baseParams[5],
      minimumFee: undefined,
      name: baseParams[6],
      recipientCount: event.params.recipientCount,
      shape: undefined,
      startPercentage: undefined,
      startTime: undefined, // all v1.2 streams use the claim time as the start time
      totalDuration: event.params.streamDurations[1],
      transferable: baseParams[7],
    };
    await createMerkleLL({
      context,
      event,
      params,
    });
  },
  loader: Loader.create["v1.2"],
});
