/**
 * @file CLI for generating Envio config file
 *
 * @example
 * just codegen-envio-config all
 * just codegen-envio-config flow
 *
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */
import { PROTOCOLS } from "cli/constants";
import * as fs from "fs-extra";
import { createEnvioConfig } from "../../src/codegen/envio-config";
import paths from "../../src/paths";
import type { Types } from "../../src/types";
import logger from "../../src/winston";
import * as helpers from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = helpers.validateProtocolArg(args[0]);

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
