import { CreateMerkleInstant as EventCreateMerkleInstant } from "../../../bindings/SablierMerkleFactory_v1_3/SablierMerkleFactory";
import { SablierMerkleInstant_v1_3 as TemplateInstant } from "../../../bindings/templates";
import { Params } from "../../../helpers/types";
import { Store } from "../../../store";

export function handleCreateMerkleInstant(event: EventCreateMerkleInstant): void {
  /* -------------------------------- CAMPAIGN -------------------------------- */
  const campaign = Store.Campaign.createInstant(event, {
    admin: event.params.baseParams.initialAdmin,
    aggregateAmount: event.params.aggregateAmount,
    asset: event.params.baseParams.token,
    campaignAddress: event.params.merkleInstant,
    category: "Instant",
    expiration: event.params.baseParams.expiration,
    ipfsCID: event.params.baseParams.ipfsCID,
    merkleRoot: event.params.baseParams.merkleRoot,
    minimumFee: event.params.fee,
    name: event.params.baseParams.campaignName,
    recipientCount: event.params.recipientCount,
  });

  /* --------------------------------- ACTION --------------------------------- */
  Store.Action.create(event, campaign, { category: "Create" } as Params.Action);

  /* ---------------------------- CONTRACT TEMPLATE --------------------------- */
  TemplateInstant.create(event.params.merkleInstant);
}
