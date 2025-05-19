import { createEnvioConfig } from "@src/envio-config";
import { paths } from "@src/paths";
import type { Indexed } from "@src/types";
import logger, { logAndThrow } from "@src/winston";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import { AUTOGEN_COMMENT, ENVIO_SCHEMA_COMMENT } from "../constants";
import { getRelative, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating Envio config file
 *
 * @example Generate for Flow:
 * bun run scripts/codegen/envio-config.ts flow
 *
 * @param {string} [protocol='all'] - 'flow' or 'lockup'
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const protocolArg = validateProtocolArg(args[0]);

  // Currently only supporting flow protocol
  if (protocolArg !== "flow" && protocolArg !== "lockup") {
    logAndThrow("Only 'flow' and 'lockup' protocols are currently supported for Envio config generation");
  }

  generateConfig(protocolArg);
}

main().catch((error) => {
  logAndThrow(`❌ Error generating Envio config: ${error.message}`);
});

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function dumpYAML(protocol: Indexed.Protocol): string {
  const config = createEnvioConfig(protocol);

  const yamlContent = yaml.dump(config, {
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });

  return `${AUTOGEN_COMMENT}${ENVIO_SCHEMA_COMMENT}${yamlContent}`;
}

function generateConfig(protocol: Indexed.Protocol): void {
  const config = dumpYAML(protocol);
  const outputPath = paths.envioConfig(protocol);
  fs.writeFileSync(outputPath, config);

  logger.info(`🎉 Successfully generated the Envio config for ${protocol} protocol`);
  logger.info(`📁 Config path: ${getRelative(outputPath)}`);
}
