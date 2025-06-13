/**
 * @file CLI for generating Envio config file
 *
 * @example
 * pnpm tsx cli codegen envio-config --protocol all
 * pnpm tsx cli codegen envio-config --protocol flow
 *
 * @param --protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */

import { type Command } from "commander";
import * as fs from "fs-extra";
import _ from "lodash";
import { createEnvioConfig } from "../../../src/codegen/envio-config";
import paths from "../../../src/paths";
import type { Types } from "../../../src/types";
import { logger } from "../../../src/winston";
import { PROTOCOLS } from "../../constants";
import * as helpers from "../../helpers";

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

    generateConfig(protocolArg);
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
    generateConfig(p);
  }

  logger.info("🎉 Successfully generated all Envio configs!\n");
}

function generateConfig(protocol: Types.Protocol): void {
  const config = createEnvioConfig(protocol);
  const yaml = helpers.dumpYAML(config);
  const configPath = paths.envio.config(protocol);
  fs.writeFileSync(configPath, yaml);

  logger.info(`📁 Envio config path: ${helpers.getRelative(configPath)}`);
  logger.info(`✅ Generated the Envio config for ${_.capitalize(protocol)} protocol\n`);
}
