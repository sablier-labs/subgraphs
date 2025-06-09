import _ from "lodash";
import { GRAPH_CHAIN_CONFIGS } from "../src/exports/chains";
import * as helpers from "./helpers";

export async function main(): Promise<void> {
  const program = helpers.createBaseCommand("Print all available blockchain chains");

  program.parse();

  console.log("✨ Available chains:");
  console.log(
    _.sortBy(GRAPH_CHAIN_CONFIGS, (c) => c.name)
      .map((c) => `• ${c.name}`)
      .join("\n"),
  );
}

if (require.main === module) {
  main();
}
