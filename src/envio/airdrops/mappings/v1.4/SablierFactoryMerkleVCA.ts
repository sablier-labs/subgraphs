import { Airdrops as enums } from "../../../../schema/enums";
import { CommonStore } from "../../../common/store";
import { Contract } from "../../bindings";
import { Store } from "../../store";
import { Loader } from "../common/loader";

Contract.Factory.MerkleFactoryVCA_v1_4.CreateMerkleVCA.contractRegister(({ event, context }) => {
  context.addSablierMerkleVCA_v1_4(event.params.merkleVCA);
});

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/airdrops/blob/staging/src/types/DataTypes.sol
https://github.com/sablier-labs/airdrops/blob/72b6aae5566523e53884470980a9e9528a8446da/src/interfaces/ISablierFactoryMerkleInstant.sol#L17-L24
──────────────────────────────────────────────────────────────

{
    "type": "event",
    "name": "CreateMerkleVCA",
    "inputs": [
      { "name": "merkleVCA", "type": "address", "indexed": true, "internalType": "contract ISablierMerkleVCA" },
      {
        "name": "params",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct MerkleVCA.ConstructorParams",
        "components": [
          { "name": "campaignName", "type": "string", "internalType": "string" },
          { "name": "endTime", "type": "uint40", "internalType": "uint40" },
          { "name": "expiration", "type": "uint40", "internalType": "uint40" },
          { "name": "initialAdmin", "type": "address", "internalType": "address" },
          { "name": "ipfsCID", "type": "string", "internalType": "string" },
          { "name": "merkleRoot", "type": "bytes32", "internalType": "bytes32" },
          { "name": "startTime", "type": "uint40", "internalType": "uint40" },
          { "name": "token", "type": "address", "internalType": "contract IERC20" },
          { "name": "unlockPercentage", "type": "uint256", "internalType": "UD60x18" }
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

Contract.Factory.MerkleFactoryVCA_v1_4.CreateMerkleVCA.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const { asset, assetMetadata, factory, watcher } = loaderReturn;
    const baseParams = event.params.params;
    const assetAddress = baseParams[7];

    const entities = {
      asset: asset ?? (await CommonStore.Asset.create(context, event.chainId, assetAddress, assetMetadata)),
      factory: factory ?? (await Store.Factory.create(context, event.chainId, event.srcAddress)),
      watcher: watcher ?? (await Store.Watcher.create(event.chainId)),
    };

    /* -------------------------------- CAMPAIGN -------------------------------- */
    const params = event.params;
    const campaign = await Store.Campaign.createVCA(context, event, entities, {
      admin: baseParams[3],
      aggregateAmount: params.aggregateAmount,
      asset: assetAddress,
      campaignAddress: params.merkleVCA,
      category: enums.CampaignCategory.Instant,
      expiration: baseParams[2],
      ipfsCID: baseParams[4],
      merkleRoot: baseParams[5],
      minimumFee: params.minFeeUSD,
      name: baseParams[0],
      recipientCount: params.recipientCount,
      startTime: baseParams[6],
      endTime: baseParams[1],
      unlockPercentage: baseParams[8],
    });

    /* --------------------------------- ACTION --------------------------------- */
    const actionEntities = {
      campaign,
      factory: entities.factory,
      watcher: entities.watcher,
    };
    await Store.Action.create(context, event, actionEntities, {
      category: enums.ActionCategory.Create,
    });
  },
  loader: Loader.createVCA["v1.4"],
});
