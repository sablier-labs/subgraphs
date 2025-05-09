import type { Manifest } from "../types";

const topConfigs: Record<string, Omit<Manifest.TopConfig, "dataSources">> = {
  airdrops: {
    ...get("Airdrops"),
  },
  flow: {
    ...get("Flow"),
  },
  lockup: {
    ...get("Lockup"),
  },
};

export default topConfigs;

function get(name: string) {
  return {
    specVersion: "0.0.5",
    description: `The Graph indexer for Sablier ${name}`,
    repository: "https://github.com/sablier-labs/indexers",
    schema: {
      file: "../schema.graphql",
    },
  };
}
