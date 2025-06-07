import _ from "lodash";
import { GRAPH_CHAINS } from "../src/exports/chains";

if (require.main === module) {
  console.log("✨ Available chains:");
  console.log(
    _.sortBy(GRAPH_CHAINS, (c) => c.name)
      .map((c) => `• ${c.name}`)
      .join("\n"),
  );
}
