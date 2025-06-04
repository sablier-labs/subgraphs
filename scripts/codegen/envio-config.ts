import * as fs from "fs-extra";
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
 * pnpm ts-node scripts/codegen/envio-config.ts flow
 *
 * @param {string} [protocol='all'] - 'flow' or 'lockup'
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = validateProtocolArg(args[0]);

  function handleAll(): void {
    const protocols: Indexed.Protocol[] = ["airdrops", "flow", "lockup"];

    for (const p of protocols) {
      generateConfig(p);
    }

    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info("🎉 Successfully generated all Envio configs!\n");
  }

  if (protocolArg === "all") {
    handleAll();
  } else {
    generateConfig(protocolArg);
  }
}

main();

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function generateConfig(protocol: Indexed.Protocol): void {
  const config = createEnvioConfig(protocol);
  const yaml = dumpYAML(config);
  const configPath = paths.envio.config(protocol);
  fs.writeFileSync(configPath, yaml);

  logger.info(`✅ Successfully generated the Envio config for ${protocol} protocol`);
  logger.info(`📁 Envio config path: ${getRelative(configPath)}\n`);
}
