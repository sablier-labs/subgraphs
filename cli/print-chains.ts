import _ from "lodash";
import { graphChains } from "../src/exports/chains";

if (require.main === module) {
  console.log("✨ Available chains:");
  console.log(
    _.sortBy(graphChains, (c) => c.graph.name)
      .map((c) => `- ${c.graph.name}`)
      .join("\n"),
  );
}
