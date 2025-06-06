import * as fs from "fs-extra";
import { PROTOCOLS } from "scripts/constants";
import { createEnvioConfig } from "../../src/envio-config";
import paths from "../../src/paths";
import type { Indexed } from "../../src/types";
import logger from "../../src/winston";
import { dumpYAML, getRelative, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating Envio config file
 *
 * @example Generate for Flow:
 * pnpm tsx scripts/codegen/envio-config.ts flow
 *
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = validateProtocolArg(args[0]);

  if (protocolArg === "all") {
    codegenAllProtocols();
  } else {
    codegenSpecificProtocol(protocolArg);
  }
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function codegenAllProtocols(): void {
  for (const p of PROTOCOLS) {
    codegenSpecificProtocol(p);
  }

  logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🎉 Successfully generated all Envio configs!\n");
}

function codegenSpecificProtocol(protocol: Indexed.Protocol): void {
  const config = createEnvioConfig(protocol);
  const yaml = dumpYAML(config);
  const configPath = paths.envio.config(protocol);
  fs.writeFileSync(configPath, yaml);

  logger.info(`✅ Successfully generated the Envio config for ${protocol} protocol`);
  logger.info(`📁 Envio config path: ${getRelative(configPath)}\n`);
}
