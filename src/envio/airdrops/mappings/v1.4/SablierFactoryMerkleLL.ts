import { Airdrops as enums } from "../../../../schema/enums";
import { Contract } from "../../bindings";
import { isOfficialLockup, type Params } from "../../helpers";
import { createMerkleLL } from "../common";
import { Loader } from "../common/loader";

Contract.Factory.MerkleFactoryLL_v1_4.CreateMerkleLL.contractRegister(({ context, event }) => {
  const lockupAddress = event.params.params[7];
  if (!isOfficialLockup(event.chainId, lockupAddress)) {
    throw new Error(`Unknown deployment of LockupLinear ${lockupAddress} used in airdrop campaign`);
  }
  context.addSablierFactoryMerkleLL_v1_4(lockupAddress);
});

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/airdrops/blob/v1.3/src/types/DataTypes.sol
https://github.com/sablier-labs/airdrops/blob/v1.3/src/interfaces/ISablierMerkleFactory.sol#L38-L48
──────────────────────────────────────────────────────────────

{
    "type": "event",
    "name": "CreateMerkleLL",
    "inputs": [
      { "name": "merkleLL", "type": "address", "indexed": true, "internalType": "contract ISablierMerkleLL" },
      {
        "name": "params",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct MerkleLL.ConstructorParams",
        "components": [
          { "name": "campaignName", "type": "string", "internalType": "string" },
          { "name": "cancelable", "type": "bool", "internalType": "bool" },
          { "name": "cliffDuration", "type": "uint40", "internalType": "uint40" },
          { "name": "cliffUnlockPercentage", "type": "uint256", "internalType": "UD60x18" },
          { "name": "expiration", "type": "uint40", "internalType": "uint40" },
          { "name": "initialAdmin", "type": "address", "internalType": "address" },
          { "name": "ipfsCID", "type": "string", "internalType": "string" },
          { "name": "lockup", "type": "address", "internalType": "contract ISablierLockup" },
          { "name": "merkleRoot", "type": "bytes32", "internalType": "bytes32" },
          { "name": "shape", "type": "string", "internalType": "string" },
          { "name": "startTime", "type": "uint40", "internalType": "uint40" },
          { "name": "startUnlockPercentage", "type": "uint256", "internalType": "UD60x18" },
          { "name": "token", "type": "address", "internalType": "contract IERC20" },
          { "name": "totalDuration", "type": "uint40", "internalType": "uint40" },
          { "name": "transferable", "type": "bool", "internalType": "bool" }
        ]
      },
      { "name": "aggregateAmount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "recipientCount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "minFeeUSD", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "oracle", "type": "address", "indexed": false, "internalType": "address" }
    ],
    "anonymous": false
  },
──────────────────────────────────────────────────────────────
*/

Contract.Factory.MerkleFactoryLL_v1_4.CreateMerkleLL.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const baseParams = event.params.params;
    const params: Params.CreateCampaignLL = {
      admin: baseParams[5],
      aggregateAmount: event.params.aggregateAmount,
      asset: baseParams[12],
      campaignAddress: event.params.merkleLL,
      cancelable: baseParams[1],
      category: enums.CampaignCategory.LockupLinear,
      cliffDuration: baseParams[2],
      cliffPercentage: baseParams[3],
      expiration: baseParams[4],
      ipfsCID: baseParams[6],
      lockup: baseParams[7],
      merkleRoot: baseParams[8],
      minimumFee: event.params.minFeeUSD,
      name: baseParams[0],
      recipientCount: event.params.recipientCount,
      shape: baseParams[9],
      startPercentage: baseParams[11],
      startTime: baseParams[10],
      totalDuration: baseParams[13],
      transferable: baseParams[14],
    };
    await createMerkleLL({
      context,
      event,
      loaderReturn,
      params,
    });
  },
  loader: Loader.createLL["v1.4"],
});
