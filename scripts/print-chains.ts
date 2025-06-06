import _ from "lodash";
import { GRAPH_CHAINS } from "../src/chains";

if (require.main === module) {
  console.log("✨ Available chains:");
  console.log(
    _.sortBy(GRAPH_CHAINS, (c) => c.graph.name)
      .map((c) => `- ${c.graph.name}`)
      .join("\n"),
  );
}
