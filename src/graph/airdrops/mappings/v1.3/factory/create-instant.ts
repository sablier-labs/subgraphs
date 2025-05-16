import { CreateMerkleInstant as EventCreateMerkleInstant } from "../../../bindings/SablierMerkleFactory_v1_3/SablierMerkleFactory";
import { SablierMerkleInstant_v1_3 as TemplateInstant } from "../../../bindings/templates";
import { createEntityAction, createEntityCampaignInstant } from "../../../entities";

export function handleCreateMerkleInstant(event: EventCreateMerkleInstant): void {
  const campaign = createEntityCampaignInstant(event, {
    admin: event.params.baseParams.initialAdmin,
    aggregateAmount: event.params.aggregateAmount,
    asset: event.params.baseParams.token,
    campaignAddress: event.params.merkleInstant,
    category: "Instant",
    expiration: event.params.baseParams.expiration,
    ipfsCID: event.params.baseParams.ipfsCID,
    minimumFee: event.params.fee,
    name: event.params.baseParams.campaignName,
    recipientCount: event.params.recipientCount,
    root: event.params.baseParams.merkleRoot,
  });
  createEntityAction(event, campaign, "Create");

  // Create an instance of the campaign template so that future events can be indexed.
  TemplateInstant.create(event.params.merkleInstant);
}
