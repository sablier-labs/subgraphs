import { describe, expect, it } from "vitest";
import { chainId, Envio, merkle_endpoints, TheGraph } from "../common";
import * as envioQueries from "./queries-envio";
import * as theGraphQueries from "./queries-the-graph";

type Campaign = object & {
  subgraphId: string;
};

interface CampaignResponse {
  campaigns: Campaign[];
}

describe(`Campaigns (Chain Id: ${chainId})`, () => {
  it("All entries are the same (asc)", async () => {
    const variables = {
      chainId,
      first: 1,
      subgraphId: 0,
    };

    let done = false;
    let totalProcessed = 0;

    while (!done) {
      const received_slice = (await Envio(
        merkle_endpoints.envio,
        envioQueries.getCampaigns_Asc,
        variables,
      )) as CampaignResponse;

      const expected_slice = (await TheGraph(
        merkle_endpoints.theGraph,
        theGraphQueries.getCampaigns_Asc,
        variables,
      )) as CampaignResponse;

      // Compare each batch immediately
      expect(received_slice.campaigns.length).toEqual(expected_slice.campaigns.length);
      expect(received_slice.campaigns).toEqual(expected_slice.campaigns);

      totalProcessed += received_slice.campaigns.length;

      const expected_subgraphId = expected_slice.campaigns?.[variables.first - 1]?.subgraphId;
      const received_subgraphId = received_slice.campaigns?.[variables.first - 1]?.subgraphId;

      if (received_slice.campaigns.length < variables.first && expected_slice.campaigns.length < variables.first) {
        done = true;
      } else if (!expected_subgraphId || expected_subgraphId !== received_subgraphId) {
        done = true;
      } else {
        variables.subgraphId = parseInt(expected_slice.campaigns[variables.first - 1].subgraphId);
      }
    }

    console.info(`Successfully compared ${totalProcessed} campaigns across all batches.`);
    expect(totalProcessed).toBeGreaterThan(0);
  }, 1000000); // timeout for slow test
});
