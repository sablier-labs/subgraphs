import * as fs from "node:fs";
import { print } from "graphql";
import paths from "../../src/paths";
import { mergeSchema } from "../../src/schema";
import type { Indexed } from "../../src/types";
import logger from "../../src/winston";
import { AUTOGEN_COMMENT } from "../constants";
import { getRelative, validateProtocolArg, validateVendorArg } from "../helpers";

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
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} vendor - Optional: 'graph', 'envio', or 'all' (default: 'all')
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const vendorArg = validateVendorArg(args[0]);
  const protocolArg = validateProtocolArg(args[1]);

  function handleAllProtocols(vendor: Indexed.Vendor): void {
    const protocols: Indexed.Protocol[] = ["airdrops", "flow", "lockup"];

    for (const p of protocols) {
      generateSchema(vendor, p);
    }
  }

  function handleAllVendors(): void {
    const vendors: Indexed.Vendor[] = ["envio", "graph"];

    for (const v of vendors) {
      if (protocolArg === "all") {
        handleAllProtocols(v);
      } else {
        generateSchema(v, protocolArg);
      }
    }

    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info("🎉 Successfully generated all GraphQL schemas!\n");
  }

  if (vendorArg === "all") {
    handleAllVendors();
  } else if (protocolArg === "all") {
    handleAllProtocols(vendorArg as Indexed.Vendor);
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info("🎉 Successfully generated all GraphQL schemas!\n");
  } else {
    generateSchema(vendorArg as Indexed.Vendor, protocolArg);
  }
}

main();

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Generates and writes a GraphQL schema for a specific protocol
 * @param vendor The vendor to generate schemas for
 * @param protocol The protocol to generate a schema for
 * @returns Result of the schema generation
 */
function generateSchema(vendor: Indexed.Vendor, protocol: Indexed.Protocol): void {
  const mergedSchema = print(mergeSchema(protocol));
  const schema = `${AUTOGEN_COMMENT}${mergedSchema}`;

  const outputPath = paths.schema(vendor, protocol);
  fs.writeFileSync(outputPath, schema);

  logger.info(`📁 Schema path: ${getRelative(outputPath)}`);
  logger.info(`✅ Successfully generated GraphQL schema for ${vendor} ${protocol}`);
  console.log();
}
