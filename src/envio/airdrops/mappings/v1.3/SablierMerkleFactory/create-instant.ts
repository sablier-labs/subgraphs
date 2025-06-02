import { Contract } from "@envio-airdrops/bindings";
import { Loader } from "@envio-airdrops/mappings/loader";
import { Store } from "@envio-airdrops/store";
import { Airdrops as enums } from "@src/schema/enums";

Contract.Factory.MerkleFactory_v1_3.CreateMerkleInstant.contractRegister(({ event, context }) => {
  context.addSablierMerkleInstant_v1_3(event.params.merkleInstant);
});

/*
──────────────────────────────────────────────────────────────
Solidity Event Reference
https://github.com/sablier-labs/airdrops/blob/v1.3/src/types/DataTypes.sol
https://github.com/sablier-labs/airdrops/blob/v1.3/src/interfaces/ISablierMerkleFactory.sol#L29-L35
──────────────────────────────────────────────────────────────

event CreateMerkleInstant(
    ISablierMerkleInstant indexed merkleInstant,
    MerkleBase.ConstructorParams baseParams,
    uint256 aggregateAmount,
    uint256 recipientCount,
    uint256 fee
);

struct ConstructorParams {
    IERC20 token;         [0]
    uint40 expiration;    [1]
    address initialAdmin; [2]
    string ipfsCID;       [3]
    bytes32 merkleRoot;   [4]
    string campaignName;  [5]
    string shape;         [6]
}

──────────────────────────────────────────────────────────────
*/

Contract.Factory.MerkleFactory_v1_3.CreateMerkleInstant.handlerWithLoader({
  handler: async ({ context, event, loaderReturn }) => {
    const entities = {
      asset: loaderReturn.asset ?? (await Store.Asset.create(context, event.chainId, event.params.baseParams[0])),
      factory: loaderReturn.factory ?? (await Store.Factory.create(context, event.chainId, event.srcAddress)),
      watcher: loaderReturn.watcher ?? (await Store.Watcher.create(event.chainId)),
    };

    /* -------------------------------- CAMPAIGN -------------------------------- */
    const params = event.params;
    const baseParams = event.params.baseParams;
    const campaign = await Store.Campaign.createInstant(context, event, entities, {
      admin: baseParams[2],
      aggregateAmount: params.aggregateAmount,
      asset: entities.asset.address,
      campaignAddress: params.merkleInstant,
      category: enums.CampaignCategory.Instant,
      expiration: baseParams[1],
      ipfsCID: baseParams[3],
      merkleRoot: baseParams[4],
      minimumFee: params.fee,
      name: baseParams[5],
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
  loader: Loader.create["v1.3"],
});
