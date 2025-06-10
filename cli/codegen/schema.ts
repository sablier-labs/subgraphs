/**
 * @file CLI for generating GraphQL schema files
 *
 * @example
 * pnpm tsx cli codegen schema --vendor all --protocol all
 * pnpm tsx cli codegen schema --vendor all --protocol flow
 * pnpm tsx cli codegen schema --vendor graph --protocol flow
 *
 * @param {string} --vendor - Required: 'graph', 'envio', or 'all'
 * @param {string} --protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */
import * as fs from "node:fs";
import { type Command } from "commander";
import { print } from "graphql";
import paths from "../../src/paths";
import { mergeSchema } from "../../src/schema";
import type { Types } from "../../src/types";
import { logger } from "../../src/winston";
import { AUTOGEN_COMMENT, PROTOCOLS, VENDORS } from "../constants";
import * as helpers from "../helpers";
import { type ProtocolArg } from "../types";

/* -------------------------------------------------------------------------- */
/*                                  COMMAND                                   */
/* -------------------------------------------------------------------------- */

export function createSchemaCommand(): Command {
  const command = helpers.createBaseCommand("Generate GraphQL schema files");

  helpers.addVendorOption(command);
  helpers.addProtocolOption(command);

  command.action(async (options) => {
    const vendorArg = helpers.parseVendorOption(options.vendor);
    const protocolArg = helpers.parseProtocolOption(options.protocol);

    if (vendorArg === "all") {
      generateAllVendorSchemas(protocolArg);
      return;
    }

    if (protocolArg === "all") {
      generateAllProtocolSchemas(vendorArg);
      return;
    }

    generateSchema(vendorArg, protocolArg);
  });

  return command;
}

// Export the command
export const command = createSchemaCommand();

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function generateAllVendorSchemas(protocolArg: ProtocolArg): void {
  for (const v of VENDORS) {
    if (protocolArg === "all") {
      generateAllProtocolSchemas(v);
    } else {
      generateSchema(v, protocolArg);
    }
  }

  logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🎉 Successfully generated all GraphQL schemas!\n");
}

function generateAllProtocolSchemas(vendor: Types.Vendor): void {
  for (const p of PROTOCOLS) {
    generateSchema(vendor, p);
  }
  logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🎉 Successfully generated all GraphQL schemas!\n");
}

/**
 * Generates and writes a GraphQL schema for a specific protocol
 * @param vendor The vendor to generate schemas for
 * @param protocol The protocol to generate a schema for
 * @returns Result of the schema generation
 */
function generateSchema(vendor: Types.Vendor, protocol: Types.Protocol): void {
  const mergedSchema = print(mergeSchema(protocol));
  const schema = `${AUTOGEN_COMMENT}${mergedSchema}`;

  const outputPath = paths.schema(vendor, protocol);
  logger.info(outputPath);
  fs.writeFileSync(outputPath, schema);

  logger.info(`📁 Schema path: ${helpers.getRelative(outputPath)}`);
  logger.info(`✅ Successfully generated GraphQL schema for ${vendor} ${protocol}`);
  console.log();
}
