import type { Types } from "../../types";
import type { GraphManifest } from "./manifest-types";

const topSections: Record<Types.Protocol, GraphManifest.TopSection> = {
  airdrops: get("Airdrops"),
  flow: get("Flow"),
  lockup: get("Lockup"),
};

export default topSections;

function get(name: string): GraphManifest.TopSection {
  return {
    specVersion: "1.3.0",
    description: `The Graph indexer for Sablier ${name}`,
    repository: "https://github.com/sablier-labs/indexers",
    schema: {
      file: "../schema.graphql",
    },
    dataSources: [],
  };
}
