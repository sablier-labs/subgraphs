import { Airdrops as enums } from "../../../../schema/enums";
import { Contract } from "../../bindings";
import { isOfficialLockup, type Params } from "../../helpers";
import { createMerkleLL } from "../common";
import { Loader } from "../common/loader";

Contract.Factory.MerkleStreamerFactory_v1_1.CreateMerkleStreamerLL.contractRegister(({ context, event }) => {
  const lockupAddress = event.params.merkleStreamer;
  if (!isOfficialLockup(event.chainId, lockupAddress)) {
    throw new Error(`Unknown deployment of LockupLinear ${lockupAddress} used in airdrop campaign`);
  }
  context.addSablierV2MerkleStreamerLL_v1_1(lockupAddress);
});

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/v2-periphery/blob/v1.1.1/src/types/DataTypes.sol
https://github.com/sablier-labs/v2-periphery/blob/v1.1.1/src/interfaces/ISablierV2MerkleStreamerFactory.sol#L18-L31
──────────────────────────────────────────────────────────────

event CreateMerkleStreamerLL(
    ISablierV2MerkleStreamerLL merkleStreamer,
    address indexed admin,
    ISablierV2LockupLinear indexed lockupLinear,
    IERC20 indexed asset,
    bytes32 merkleRoot,
    uint40 expiration,
    LockupLinear.Durations streamDurations,
    bool cancelable,
    bool transferable,
    string ipfsCID,
    uint256 aggregateAmount,
    uint256 recipientsCount
);

struct Durations {
    uint40 cliff; [0]
    uint40 total; [1]
}

──────────────────────────────────────────────────────────────
*/

Contract.Factory.MerkleStreamerFactory_v1_1.CreateMerkleStreamerLL.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const params: Params.CreateCampaignLL = {
      admin: event.params.admin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.asset,
      campaignAddress: event.params.merkleStreamer,
      cancelable: event.params.cancelable,
      category: enums.CampaignCategory.LockupLinear,
      cliffDuration: event.params.streamDurations[0],
      cliffPercentage: undefined,
      expiration: event.params.expiration,
      ipfsCID: event.params.ipfsCID,
      lockup: event.params.lockupLinear,
      merkleRoot: event.params.merkleRoot,
      minimumFee: undefined,
      name: undefined,
      recipientCount: event.params.recipientsCount,
      shape: undefined,
      startPercentage: undefined,
      startTime: undefined, // all v1.1 streams use the claim time as the start time
      totalDuration: event.params.streamDurations[1],
      transferable: event.params.transferable,
    };
    await createMerkleLL({
      context,
      event,
      loaderReturn,
      params,
    });
  },
  loader: Loader.create["v1.1"],
});
