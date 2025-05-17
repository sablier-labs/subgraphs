import type { Manifest } from "@src/graph-manifest/types";
import type { Indexed } from "@src/types";

const topSections: Record<Indexed.Protocol, Manifest.TopSection> = {
  airdrops: get("Airdrops"),
  flow: get("Flow"),
  lockup: get("Lockup"),
};

export default topSections;

function get(name: string) {
  return {
    specVersion: "0.0.5",
    description: `The Graph indexer for Sablier ${name}`,
    repository: "https://github.com/sablier-labs/indexers",
    schema: {
      file: "../schema.graphql",
    },
    dataSources: [],
  };
}
