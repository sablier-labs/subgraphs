import { sablier } from "@sablier/deployments";
import _ from "lodash";
import * as helpers from "./helpers";

export async function main(): Promise<void> {
  const program = helpers.createBaseCommand("Print all available blockchain chains");

  program.parse();

  console.log("✨ Available chains:");
  console.log(
    _.sortBy(sablier.chains.getAll(), (c) => c.name)
      .map((c) => `• ${c.name}`)
      .join("\n"),
  );
}

if (require.main === module) {
  main();
}
