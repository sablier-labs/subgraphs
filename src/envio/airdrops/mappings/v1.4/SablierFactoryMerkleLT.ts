import { Airdrops as enums } from "../../../../schema/enums";
import { Contract } from "../../bindings";
import { convertTranches, isOfficialLockup } from "../../helpers";
import { type Params } from "../../helpers/types";
import { createMerkleLT } from "../common";
import { Loader } from "../common/loader";

Contract.Factory.MerkleFactoryLT_v1_4.CreateMerkleLT.contractRegister(({ context, event }) => {
  const lockupAddress = event.params.params[5];
  if (!isOfficialLockup(event.chainId, lockupAddress)) {
    throw new Error(`Unknown deployment of LockupTranched ${lockupAddress} used in airdrop campaign`);
  }
  context.addSablierMerkleLT_v1_4(event.params.merkleLT);
});

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/airdrops/blob/v1.3/src/types/DataTypes.sol
https://github.com/sablier-labs/airdrops/blob/v1.3/src/interfaces/ISablierMerkleFactory.sol#L51-L63
──────────────────────────────────────────────────────────────

{
    "type": "event",
    "name": "CreateMerkleLT",
    "inputs": [
      { "name": "merkleLT", "type": "address", "indexed": true, "internalType": "contract ISablierMerkleLT" },
      {
        "name": "params",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct MerkleLT.ConstructorParams",
        "components": [
          { "name": "campaignName", "type": "string", "internalType": "string" },
          { "name": "cancelable", "type": "bool", "internalType": "bool" },
          { "name": "expiration", "type": "uint40", "internalType": "uint40" },
          { "name": "initialAdmin", "type": "address", "internalType": "address" },
          { "name": "ipfsCID", "type": "string", "internalType": "string" },
          { "name": "lockup", "type": "address", "internalType": "contract ISablierLockup" },
          { "name": "merkleRoot", "type": "bytes32", "internalType": "bytes32" },
          { "name": "shape", "type": "string", "internalType": "string" },
          { "name": "startTime", "type": "uint40", "internalType": "uint40" },
          { "name": "token", "type": "address", "internalType": "contract IERC20" },
          {
            "name": "tranchesWithPercentages",
            "type": "tuple[]",
            "internalType": "struct MerkleLT.TrancheWithPercentage[]",
            "components": [
              { "name": "unlockPercentage", "type": "uint64", "internalType": "UD2x18" },
              { "name": "duration", "type": "uint40", "internalType": "uint40" }
            ]
          },
          { "name": "transferable", "type": "bool", "internalType": "bool" }
        ]
      },
      { "name": "aggregateAmount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "recipientCount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "totalDuration", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "minFeeUSD", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "oracle", "type": "address", "indexed": false, "internalType": "address" }
    ],
    "anonymous": false
  },

──────────────────────────────────────────────────────────────
*/

Contract.Factory.MerkleFactoryLT_v1_4.CreateMerkleLT.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const baseParams = event.params.params;
    const params: Params.CreateCampaignLT = {
      admin: baseParams[3],
      aggregateAmount: event.params.aggregateAmount,
      asset: baseParams[9],
      campaignAddress: event.params.merkleLT,
      cancelable: baseParams[1],
      category: enums.CampaignCategory.LockupTranched,
      expiration: baseParams[2],
      ipfsCID: baseParams[4],
      lockup: baseParams[5],
      merkleRoot: baseParams[6],
      minimumFee: event.params.minFeeUSD,
      name: baseParams[0],
      recipientCount: event.params.recipientCount,
      shape: baseParams[7],
      startTime: baseParams[8],
      totalDuration: event.params.totalDuration,
      tranchesWithPercentages: convertTranches(baseParams[10]),
      transferable: baseParams[11],
    };
    await createMerkleLT({
      context,
      event,
      loaderReturn,
      params,
    });
  },
  loader: Loader.createLT["v1.4"],
});
