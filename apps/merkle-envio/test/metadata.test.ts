import { Envio, TheGraph } from "./setup/networking";
import { cleanup } from "./setup/cleanup";
import { chainId, configuration, SKIP_CLEANUP } from "./setup/constants";
import * as envioQueries from "./setup/queries-envio";
import * as theGraphQueries from "./setup/queries-the-graph";

describe(`Campaigns (Campaign Id: ${configuration.airdropIds[0]}, Chain Id: ${chainId}, Envio: ${configuration.endpoint.Envio})`, () => {
  test.skip("Metadata results are the same", async () => {
    const variables = {
      campaignId: configuration.airdropIds[0],
      campaignIdClone: configuration.airdropIds[0],
      dayFrom: 1,
      dayTo: 7,
    } as const;

    const received = cleanup.metadata(
      await Envio(envioQueries.getMetadata_ByCampaign, variables),
      SKIP_CLEANUP,
      "Envio",
    );

    const expected = cleanup.metadata(
      await TheGraph(theGraphQueries.getMetadata_ByCampaign, variables),
      SKIP_CLEANUP,
      "TheGraph",
    );

    expect({
      actions: received.actions,
      campaign: received.campaign,
    }).toEqual({
      actions: expected.actions,
      campaign: expected.campaign,
    });
  });
});
