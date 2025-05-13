import type { Sablier } from "@sablier/deployments";
import type { Manifest } from "@src/types";

const topConfigs: Record<Exclude<Sablier.Protocol, "legacy">, Manifest.TopConfig> = {
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
