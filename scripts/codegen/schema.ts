import * as fs from "node:fs";
import * as path from "node:path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { GRAPH_DIR, SCHEMA_DIR } from "@src/paths";
import logger from "@src/winston";
import { print } from "graphql";
import { AUTOGEN_COMMENT } from "../constants";
import { getRelative, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                     CLI                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating GraphQL schema files
 *
 * @example Generate schema for Flow:
 * bun run scripts/codegen/schema.ts flow
 *
 * @example Generate schema for all protocols:
 * bun run scripts/codegen/schema.ts all
 *
 * @param {string} protocol - Required. Either 'flow', 'lockup', or 'all'
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  try {
    const protocolArg = validateProtocolArg(args[0]);

    if (protocolArg === "all") {
      const flowOutputPath = generateSchema("flow");
      logger.info("🎉 Successfully generated schema for flow protocol");
      logger.info(`📁 Schema path: ${flowOutputPath}`);

      const lockupOutputPath = generateSchema("lockup");
      logger.info("🎉 Successfully generated schema for lockup protocol");
      logger.info(`📁 Schema path: ${lockupOutputPath}`);
    } else {
      const protocol = protocolArg as "flow" | "lockup";
      const outputPath = generateSchema(protocol);
      logger.info(`🎉 Successfully generated schema for ${protocol} protocol`);
      logger.info(`📁 Schema path: ${outputPath}`);
    }
  } catch (error) {
    logger.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/*//////////////////////////////////////////////////////////////////////////
                                FUNCTIONS
//////////////////////////////////////////////////////////////////////////*/

/**
 * Generates and writes a GraphQL schema for a specific protocol
 * @param protocol The protocol to generate a schema for
 * @returns Result of the schema generation
 */
function generateSchema(protocol: "flow" | "lockup"): string {
  const commonSchemas = path.join(SCHEMA_DIR, "common/*.graphql");
  const protocolSchema = path.join(SCHEMA_DIR, `${protocol}.graphql`);
  const outputPath = path.join(GRAPH_DIR, protocol, "schema.graphql");

  const typeDefs = loadFilesSync([commonSchemas, protocolSchema]);
  const mergedSchema = mergeTypeDefs(typeDefs, { throwOnConflict: true });
  const printedSchema = print(mergedSchema);
  const schema = `${AUTOGEN_COMMENT}${printedSchema}`;

  fs.writeFileSync(outputPath, schema);
  logger.verbose(`✅ Generated schema: ${getRelative(outputPath)}`);
  return getRelative(outputPath);
}
