import * as fs from "node:fs";
import * as path from "node:path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { SCHEMA_DIR, paths } from "@src/paths";
import * as enums from "@src/schema/enums";
import type { Indexed } from "@src/types";
import logger, { logAndThrow } from "@src/winston";
import { print } from "graphql";
import _ from "lodash";
import { AUTOGEN_COMMENT } from "../constants";
import { getRelative, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                     CLI                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating GraphQL schema files
 *
 * @example Generate for Flow:
 * just codegen-schema flow
 *
 * @example Generate for all protocols:
 * just codegen-schema all
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
      const protocols: Indexed.Protocol[] = ["airdrops", "flow", "lockup"];

      for (const p of protocols) {
        generateSchema(p);
        logger.info(`✅ Successfully generated schema for ${p} protocol`);
      }

      logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info("🎉 Successfully generated all GraphQL schemas!");
    }

    if (protocolArg === "all") {
      handleAllProtocols();
    } else {
      generateSchema(protocolArg);
      logger.info(`✅ Successfully generated schema for ${protocolArg} protocol`);
    }
  } catch (error) {
    logAndThrow(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
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
function generateSchema(protocol: Indexed.Protocol): void {
  const enumDefs = getEnumDefs(protocol);

  const typeDefsPaths = getTypeDefsPaths(protocol);
  const typeDefs = loadFilesSync(typeDefsPaths);

  const mergedSchema = mergeTypeDefs([enumDefs, typeDefs], { throwOnConflict: true });
  const printedSchema = print(mergedSchema);
  const schema = `${AUTOGEN_COMMENT}${printedSchema}`;

  const outputPaths = {
    envio: paths.envioSchema(protocol),
    graph: paths.graphSchema(protocol),
  };
  fs.writeFileSync(outputPaths.graph, schema);
  fs.writeFileSync(outputPaths.envio, schema);
  logger.verbose(`📁 GraphQL schema path: ${getRelative(outputPaths.graph)}`);
  logger.verbose(`📁 Envio schema path: ${getRelative(outputPaths.envio)}`);
}

function getEnum<T extends Record<string, string>>(enumObj: T, name: string): string {
  const enumValues = _.keys(enumObj)
    .map((key) => `  ${enumObj[key]}`)
    .join("\n");

  return `enum ${name} {\n${enumValues}\n}`;
}

function getEnumDefs(protocol: Indexed.Protocol) {
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
      logAndThrow(`getEnumDefs: unknown protocol: ${protocol}`);
  }
  return makeExecutableSchema({ typeDefs: enumDefs });
}

function getTypeDefsPaths(protocol: Indexed.Protocol): string[] {
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
      logAndThrow(`getTypeDefs: unknown protocol: ${protocol}`);
  }
}
