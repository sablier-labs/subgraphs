import * as fs from "node:fs";
import * as path from "node:path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GRAPH_DIR, SCHEMA_DIR } from "@src/paths";
import * as enums from "@src/schema/enums";
import logger from "@src/winston";
import { type EnumTypeDefinitionNode, parse, print, printSchema } from "graphql";
import _ from "lodash";
import { AUTOGEN_COMMENT } from "../constants";
import { getRelative, validateProtocolArg } from "../helpers";
import type { ProtocolArg } from "../types";

/* -------------------------------------------------------------------------- */
/*                                     CLI                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating GraphQL schema files
 *
 * @example Generate for Flow:
 * bun run scripts/codegen/schema.ts flow
 *
 * @example Generate for all protocols:
 * bun run scripts/codegen/schema.ts all
 *
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  try {
    const protocolArg = validateProtocolArg(args[0]);

    /**
     * Handles generation of schema files for all supported protocols
     */
    function handleAllProtocols(): void {
      const protocols: ProtocolArg[] = ["airdrops", "flow", "lockup"];

      for (const p of protocols) {
        const outputPath = generateSchema(p);
        logger.info(`✅ Successfully generated schema for ${p} protocol`);
        logger.info(`📁 Schema path: ${outputPath}`);
      }

      logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info("🎉 Successfully generated all GraphQL schemas!");
    }

    if (protocolArg === "all") {
      handleAllProtocols();
    } else {
      const outputPath = generateSchema(protocolArg);
      logger.info(`✅ Successfully generated schema for ${protocolArg} protocol`);
      logger.info(`📁 Schema path: ${outputPath}`);
    }
  } catch (error) {
    logger.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Generates and writes a GraphQL schema for a specific protocol
 * @param protocol The protocol to generate a schema for
 * @returns Result of the schema generation
 */
function generateSchema(protocol: ProtocolArg): string {
  const outputPath = path.join(GRAPH_DIR, protocol, "schema.graphql");

  const enumDefs = getEnumDefs(protocol);

  const typeDefsPaths = getTypeDefsPaths(protocol);
  const typeDefs = loadFilesSync(typeDefsPaths);

  const mergedSchema = mergeTypeDefs([enumDefs, typeDefs], { throwOnConflict: true });
  const printedSchema = print(mergedSchema);
  const schema = `${AUTOGEN_COMMENT}${printedSchema}`;

  fs.writeFileSync(outputPath, schema);
  logger.verbose(`✅ Generated schema: ${getRelative(outputPath)}`);
  return getRelative(outputPath);
}

function getEnum<T extends Record<string, string>>(enumObj: T, name: string): string {
  const enumValues = _.keys(enumObj)
    .map((key) => `  ${enumObj[key]}`)
    .join("\n");

  return `enum ${name} {\n${enumValues}\n}`;
}

function getEnumDefs(protocol: ProtocolArg) {
  const enumDefs: string[] = [];
  switch (protocol) {
    case "airdrops":
      enumDefs.push(
        getEnum(enums.Airdrops.ActionCategory, "ActionCategory"),
        getEnum(enums.Airdrops.CampaignCategory, "CampaignCategory"),
      );
      break;
    case "flow":
      enumDefs.push(
        getEnum(enums.Flow.ActionCategory, "ActionCategory"),
        getEnum(enums.Flow.StreamCategory, "StreamCategory"),
      );
      break;
    case "lockup":
      enumDefs.push(
        getEnum(enums.Lockup.ActionCategory, "ActionCategory"),
        getEnum(enums.Lockup.StreamCategory, "StreamCategory"),
      );
      break;
    default:
      logger.error(`getEnumDefs: unknown protocol: ${protocol}`);
      process.exit(1);
  }
  return makeExecutableSchema({ typeDefs: enumDefs });
}

function getTypeDefsPaths(protocol: ProtocolArg): string[] {
  const protocolPath = path.join(SCHEMA_DIR, `${protocol}.graphql`);

  const actionPath = path.join(SCHEMA_DIR, "common/action.graphql");
  const assetPath = path.join(SCHEMA_DIR, "common/asset.graphql");
  const batchPath = path.join(SCHEMA_DIR, "common/batch.graphql");
  const watcherPath = path.join(SCHEMA_DIR, "common/watcher.graphql");

  switch (protocol) {
    case "airdrops":
      return [protocolPath]; // Airdrops uses variations of the type defs above
    case "flow":
    case "lockup":
      return [actionPath, assetPath, batchPath, watcherPath, protocolPath];
    default:
      logger.error(`getTypeDefs: unknown protocol: ${protocol}`);
      process.exit(1);
  }
}
