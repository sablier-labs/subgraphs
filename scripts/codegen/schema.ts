import * as fs from "node:fs";
import { print } from "graphql";
import paths from "../../src/paths";
import { mergeSchema } from "../../src/schema";
import type { Indexed } from "../../src/types";
import logger from "../../src/winston";
import { AUTOGEN_COMMENT, PROTOCOLS, VENDORS } from "../constants";
import { getRelative, validateProtocolArg, validateVendorArg } from "../helpers";
import { type ProtocolArg } from "../types";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating GraphQL schema files
 *
 * @example Generate for all protocols:
 * just codegen-schema all
 *
 * @example Generate for Flow:
 * just codegen-schema flow
 *
 * @example Generate for Flow with Graph vendor:
 * just codegen-schema flow graph
 *
 * @param {string} vendor - Required: 'graph', 'envio', or 'all'
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const vendorArg = validateVendorArg(args[0]);
  const protocolArg = validateProtocolArg(args[1]);

  if (vendorArg === "all") {
    codegenAllVendors(protocolArg);
  } else if (protocolArg === "all") {
    codegenAllProtocols(vendorArg as Indexed.Vendor);
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info("🎉 Successfully generated all GraphQL schemas!\n");
  } else {
    codegen(vendorArg as Indexed.Vendor, protocolArg);
  }
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function codegenAllProtocols(vendor: Indexed.Vendor): void {
  for (const p of PROTOCOLS) {
    codegen(vendor, p);
  }
}

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

/**
 * Generates and writes a GraphQL schema for a specific protocol
 * @param vendor The vendor to generate schemas for
 * @param protocol The protocol to generate a schema for
 * @returns Result of the schema generation
 */
function codegen(vendor: Indexed.Vendor, protocol: Indexed.Protocol): void {
  const mergedSchema = print(mergeSchema(protocol));
  const schema = `${AUTOGEN_COMMENT}${mergedSchema}`;

  const outputPath = paths.schema(vendor, protocol);
  fs.writeFileSync(outputPath, schema);

  logger.info(`📁 Schema path: ${getRelative(outputPath)}`);
  logger.info(`✅ Successfully generated GraphQL schema for ${vendor} ${protocol}`);
  console.log();
}
