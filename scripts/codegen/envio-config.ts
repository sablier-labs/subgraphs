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

main().catch((error) => {
  logAndThrow(`❌ Error generating Envio config: ${error.message}`);
});

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function getYAMLContent(protocol: Indexed.Protocol): string {
  const config = createEnvioConfig(protocol);

  const yamlContent = yaml.dump(config, {
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });

  return `${AUTOGEN_COMMENT}${ENVIO_SCHEMA_COMMENT}${yamlContent}`;
}

function generateConfig(protocol: Indexed.Protocol): void {
  const content = getYAMLContent(protocol);
  const configPath = paths.envioConfig(protocol);
  fs.writeFileSync(configPath, content);

  logger.info(`✅ Successfully generated the Envio config for ${protocol} protocol`);
  logger.info(`📁 Envio config path: ${getRelative(configPath)}\n`);
}
