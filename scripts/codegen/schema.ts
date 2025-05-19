import * as fs from "node:fs";
import * as path from "node:path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { paths, SCHEMA_DIR } from "@src/paths";
import { enums, getAssetDefs, getWatcherDefs } from "@src/schema";
import type { Indexed } from "@src/types";
import logger, { logAndThrow } from "@src/winston";
import { print } from "graphql";
import _ from "lodash";
import { AUTOGEN_COMMENT } from "../constants";
import { getRelative, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
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
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = validateProtocolArg(args[0]);

  /**
   * Handles generation of schema files for all supported protocols
   */
  function handleAllProtocols(): void {
    const protocols: Indexed.Protocol[] = ["airdrops", "flow", "lockup"];

    for (const p of protocols) {
      generateSchema(p);
    }

    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info("🎉 Successfully generated all GraphQL schemas!");
  }

  if (protocolArg === "all") {
    handleAllProtocols();
  } else {
    generateSchema(protocolArg);
  }
}

main().catch((error) => {
  logAndThrow(`❌ Error generating GraphQL schema: ${error.message}`);
});

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Generates and writes a GraphQL schema for a specific protocol
 * @param protocol The protocol to generate a schema for
 * @returns Result of the schema generation
 */
function generateSchema(protocol: Indexed.Protocol): void {
  const typeDefs = loadTypeDefs(protocol);
  const mergedSchema = mergeTypeDefs(typeDefs, { throwOnConflict: true });
  const printedSchema = print(mergedSchema);
  const schema = `${AUTOGEN_COMMENT}${printedSchema}`;

  const outputPaths = {
    envio: paths.envioSchema(protocol),
    graph: paths.graphSchema(protocol),
  };
  fs.writeFileSync(outputPaths.graph, schema);
  fs.writeFileSync(outputPaths.envio, schema);

  logger.info(`✅ Successfully generated GraphQL schema for ${protocol} protocol`);
  logger.info(`📁 GraphQL schema path: ${getRelative(outputPaths.graph)}`);
  logger.info(`📁 Envio schema path: ${getRelative(outputPaths.envio)}`);
  console.log();
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
  }
  return makeExecutableSchema({ typeDefs: enumDefs });
}

function loadTypeDefs(protocol: Indexed.Protocol): string[] {
  const enumDefs = getEnumDefs(protocol);
  const assetDefs = getAssetDefs(protocol);
  const watcherDefs = getWatcherDefs(protocol);

  const schemaPaths = [];
  const protocolPath = path.join(SCHEMA_DIR, `${protocol}.graphql`);

  switch (protocol) {
    case "airdrops":
      schemaPaths.push(protocolPath);
      break;
    case "flow":
    case "lockup":
      schemaPaths.push(
        protocolPath,
        path.join(SCHEMA_DIR, "common/action.graphql"),
        path.join(SCHEMA_DIR, "common/batch.graphql"),
      );
      break;
  }

  const otherTypeDefs = loadFilesSync(schemaPaths);
  return [enumDefs, assetDefs, watcherDefs, ...otherTypeDefs];
}
