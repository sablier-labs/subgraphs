/**
 * @file CLI for generating Envio config file
 *
 * @example
 * pnpm tsx cli codegen envio-config --protocol all
 * pnpm tsx cli codegen envio-config --protocol flow
 *
 * @param {string} --protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */

import { type Command } from "commander";
import * as fs from "fs-extra";
import { createEnvioConfig } from "../../src/codegen/envio-config";
import paths from "../../src/paths";
import type { Types } from "../../src/types";
import { logger } from "../../src/winston";
import { PROTOCOLS } from "../constants";
import * as helpers from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                  COMMAND                                   */
/* -------------------------------------------------------------------------- */

export function createEnvioConfigCommand(): Command {
  const command = helpers.createBaseCommand("Generate Envio config file");

  helpers.addProtocolOption(command);

  command.action(async (options) => {
    const protocolArg = helpers.parseProtocolOption(options.protocol);

    if (protocolArg === "all") {
      generateAllProtocolConfigs();
      return;
    }

    generateEnvioConfig(protocolArg);
  });

  return command;
}

// Export the command
export const command = createEnvioConfigCommand();

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function generateAllProtocolConfigs(): void {
  for (const p of PROTOCOLS) {
    generateEnvioConfig(p);
  }

  logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🎉 Successfully generated all Envio configs!\n");
}

function generateEnvioConfig(protocol: Types.Protocol): void {
  const config = createEnvioConfig(protocol);
  const yaml = helpers.dumpYAML(config);
  const configPath = paths.envio.config(protocol);
  fs.writeFileSync(configPath, yaml);

  logger.info(`✅ Successfully generated the Envio config for ${protocol} protocol`);
  logger.info(`📁 Envio config path: ${helpers.getRelative(configPath)}\n`);
}
