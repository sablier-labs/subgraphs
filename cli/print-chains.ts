import { type Command } from "commander";
import _ from "lodash";
import { sablier } from "sablier";
import * as helpers from "./helpers";

export function createPrintChainsCommand(): Command {
  const command = helpers.createBaseCommand("Print all available blockchain chains");

  command.action(async () => {
    console.log("✨ Available chains:");
    console.log(
      _.sortBy(sablier.chains.getAll(), (c) => c.name)
        .map((c) => `• ${c.name}`)
        .join("\n"),
    );
  });

  return command;
}

// Export the command
export const command = createPrintChainsCommand();
