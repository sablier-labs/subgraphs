import { createEnvioConfig } from "@src/envio-config";
import { paths } from "@src/paths";
import type { Indexed } from "@src/types";
import logger, { logAndThrow } from "@src/winston";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import { AUTOGEN_COMMENT, ENVIO_SCHEMA_COMMENT } from "../constants";
import { getRelative, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                     CLI                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating Envio config file
 *
 * @example Generate for Flow:
 * bun run scripts/codegen/envio-config.ts flow
 *
 * @param {string} protocol - Required: currently only 'flow' is supported
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  const protocolArg = validateProtocolArg(args[0]);

  // Currently only supporting flow protocol
  if (protocolArg !== "flow") {
    logAndThrow(`Only 'flow' protocol is currently supported for Envio config generation`);
  }

  try {
    generateConfig(protocolArg);
  } catch (error) {
    logAndThrow(`❌ Unhandled error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function createConfigYAML(protocol: Indexed.Protocol): string {
  const config = createEnvioConfig(protocol);

  const yamlContent = yaml.dump(config, {
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });

  return `${AUTOGEN_COMMENT}${ENVIO_SCHEMA_COMMENT}${yamlContent}`;
}

function generateConfig(protocol: Indexed.Protocol): void {
  try {
    const config = createConfigYAML(protocol);
    const outputPath = paths.envioConfig(protocol);
    fs.writeFileSync(outputPath, config);

    logger.info(`🎉 Successfully generated the Envio config for ${protocol} protocol`);
    logger.info(`📁 Config path: ${getRelative(outputPath)}`);
  } catch (error) {
    logAndThrow(
      `❌ Error generating config for ${protocol} protocol: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
