import { type Command } from "commander";
import _ from "lodash";
import { sablier } from "sablier";
import { getGraphChainSlug } from "../../src/exports/indexers/graph";
import * as helpers from "../helpers";

export function createPrintChainsCommand(): Command {
  const command = helpers.createBaseCmd("Print all available blockchain chains");

  command.action(async (options) => {
    const useGraphSlugs = Boolean(options.graph);

    console.log("✨ Available chain slugs to use in the CLI:");
    console.log(
      _.sortBy(sablier.chains.getAll(), (c) => c.slug)
        .map((c) => (useGraphSlugs ? getGraphChainSlug(c.id) : c.slug))
        .map((c) => `• ${c}`)
        .join("\n"),
    );

    if (!useGraphSlugs) {
      console.log("ℹ Note: these are not the slugs used by The Graph. Pass the --graph flag if you want those.");
    }
  });

  return command;
}

// Export the command
export const printChainsCmd = createPrintChainsCommand();
