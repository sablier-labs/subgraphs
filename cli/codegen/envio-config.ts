/**
 * @file CLI for generating Envio config file
 *
 * @example
 * pnpm tsx cli codegen envio-config --protocol all
 * pnpm tsx cli codegen envio-config --protocol flow
 *
 * @param {string} --protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */
import { PROTOCOLS } from "cli/constants";
import * as fs from "fs-extra";
import { createEnvioConfig } from "../../src/codegen/envio-config";
import paths from "../../src/paths";
import type { Types } from "../../src/types";
import { logger } from "../../src/winston";
import * as helpers from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

export async function main(): Promise<void> {
  const program = helpers.createBaseCommand("Generate Envio config file");

  helpers.addProtocolOption(program);

  program.parse();

  const options = program.opts();
  const protocolArg = helpers.parseProtocolOption(options.protocol);

  if (protocolArg === "all") {
    codegenAllProtocols();
    return;
  }

  codegen(protocolArg);
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function codegenAllProtocols(): void {
  for (const p of PROTOCOLS) {
    codegen(p);
  }

  logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🎉 Successfully generated all Envio configs!\n");
}

function codegen(protocol: Types.Protocol): void {
  const config = createEnvioConfig(protocol);
  const yaml = helpers.dumpYAML(config);
  const configPath = paths.envio.config(protocol);
  fs.writeFileSync(configPath, yaml);

  logger.info(`✅ Successfully generated the Envio config for ${protocol} protocol`);
  logger.info(`📁 Envio config path: ${helpers.getRelative(configPath)}\n`);
}
