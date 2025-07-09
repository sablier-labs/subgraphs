import { describe, expect, it } from "vitest";
import { chainId, Envio, lockup_endpoints, TheGraph } from "../common";
import * as envioQueries from "./queries-envio";
import * as theGraphQueries from "./queries-the-graph";

type Stream = object & {
  subgraphId: string;
};

interface StreamResponse {
  streams: Stream[];
}

describe(`Streams (Chain Id: ${chainId})`, () => {
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
        lockup_endpoints.envio,
        envioQueries.getStreams_Asc,
        variables,
      )) as StreamResponse;

      const expected_slice = (await TheGraph(
        lockup_endpoints.theGraph,
        theGraphQueries.getStreams_Asc,
        variables,
      )) as StreamResponse;

      // Compare each batch immediately
      expect(received_slice.streams.length).toEqual(expected_slice.streams.length);
      expect(received_slice.streams).toEqual(expected_slice.streams);

      totalProcessed += received_slice.streams.length;

      const expected_subgraphId = expected_slice.streams?.[variables.first - 1]?.subgraphId;
      const received_subgraphId = received_slice.streams?.[variables.first - 1]?.subgraphId;

      if (received_slice.streams.length < variables.first && expected_slice.streams.length < variables.first) {
        done = true;
      } else if (!expected_subgraphId || expected_subgraphId !== received_subgraphId) {
        done = true;
      } else {
        variables.subgraphId = parseInt(expected_slice.streams[variables.first - 1].subgraphId);
      }
    }

    console.info(`Successfully compared ${totalProcessed} streams across all batches.`);
    expect(totalProcessed).toBeGreaterThan(0);
  }, 1000000); // timeout for slow test
});
