import { Airdrops as enums } from "../../../../schema/enums";
import { CommonStore } from "../../../common/store";
import { Contract } from "../../bindings";
import { Store } from "../../store";
import { Loader } from "../common/loader";

Contract.Factory.MerkleFactoryInstant_v1_4.CreateMerkleInstant.contractRegister(({ event, context }) => {
  context.addSablierMerkleInstant_v1_4(event.params.merkleInstant);
});

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/airdrops/blob/staging/src/types/DataTypes.sol
https://github.com/sablier-labs/airdrops/blob/72b6aae5566523e53884470980a9e9528a8446da/src/interfaces/ISablierFactoryMerkleInstant.sol#L17-L24
──────────────────────────────────────────────────────────────

{
    "type": "event",
    "name": "CreateMerkleInstant",
    "inputs": [
      {
        "name": "merkleInstant",
        "type": "address",
        "indexed": true,
        "internalType": "contract ISablierMerkleInstant"
      },
      {
        "name": "params",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct MerkleInstant.ConstructorParams",
        "components": [
          { "name": "campaignName", "type": "string", "internalType": "string" },
          { "name": "expiration", "type": "uint40", "internalType": "uint40" },
          { "name": "initialAdmin", "type": "address", "internalType": "address" },
          { "name": "ipfsCID", "type": "string", "internalType": "string" },
          { "name": "merkleRoot", "type": "bytes32", "internalType": "bytes32" },
          { "name": "token", "type": "address", "internalType": "contract IERC20" }
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

Contract.Factory.MerkleFactoryInstant_v1_4.CreateMerkleInstant.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const { asset, assetMetadata, factory, watcher } = loaderReturn;
    const baseParams = event.params.params;
    const assetAddress = baseParams[5];

    const entities = {
      asset: asset ?? (await CommonStore.Asset.create(context, event.chainId, assetAddress, assetMetadata)),
      factory: factory ?? (await Store.Factory.create(context, event.chainId, event.srcAddress)),
      watcher: watcher ?? (await Store.Watcher.create(event.chainId)),
    };

    /* -------------------------------- CAMPAIGN -------------------------------- */
    const params = event.params;
    const campaign = await Store.Campaign.createInstant(context, event, entities, {
      admin: baseParams[2],
      aggregateAmount: params.aggregateAmount,
      asset: assetAddress,
      campaignAddress: params.merkleInstant,
      category: enums.CampaignCategory.Instant,
      expiration: baseParams[1],
      ipfsCID: baseParams[3],
      merkleRoot: baseParams[4],
      minimumFee: params.minFeeUSD,
      name: baseParams[0],
      recipientCount: params.recipientCount,
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
  loader: Loader.createInstant["v1.4"],
});
