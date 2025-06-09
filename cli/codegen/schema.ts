/**
 * @file CLI for generating GraphQL schema files
 *
 * @example
 * just codegen-schema all all
 * just codegen-schema all flow
 * just codegen-schema graph flow
 *
 * @param {string} vendor - Required: 'graph', 'envio', or 'all'
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */
import * as fs from "node:fs";
import { print } from "graphql";
import paths from "../../src/paths";
import { mergeSchema } from "../../src/schema";
import type { Types } from "../../src/types";
import logger from "../../src/winston";
import { AUTOGEN_COMMENT, PROTOCOLS, VENDORS } from "../constants";
import * as helpers from "../helpers";
import { type ProtocolArg } from "../types";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const vendorArg = helpers.validateVendorArg(args[0]);
  const protocolArg = helpers.validateProtocolArg(args[1]);

  if (vendorArg === "all") {
    codegenAllVendors(protocolArg);
    return;
  }

  if (protocolArg === "all") {
    codegenAllProtocols(vendorArg);
    return;
  }

  codegen(vendorArg, protocolArg);
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function codegenAllVendors(protocolArg: ProtocolArg): void {
  for (const v of VENDORS) {
    if (protocolArg === "all") {
      codegenAllProtocols(v);
    } else {
      codegen(v, protocolArg);
    }
  }

  logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🎉 Successfully generated all GraphQL schemas!\n");
}

function codegenAllProtocols(vendor: Types.Vendor): void {
  for (const p of PROTOCOLS) {
    codegen(vendor, p);
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
function codegen(vendor: Types.Vendor, protocol: Types.Protocol): void {
  const mergedSchema = print(mergeSchema(protocol));
  const schema = `${AUTOGEN_COMMENT}${mergedSchema}`;

  const outputPath = paths.schema(vendor, protocol);
  logger.info(outputPath);
  fs.writeFileSync(outputPath, schema);

  logger.info(`📁 Schema path: ${helpers.getRelative(outputPath)}`);
  logger.info(`✅ Successfully generated GraphQL schema for ${vendor} ${protocol}`);
  console.log();
}
