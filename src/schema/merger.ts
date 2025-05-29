import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { Protocol } from "@sablier/deployments";
import { SCHEMA_DIR } from "@src/paths";
import { type Indexed } from "@src/types";
import { type DocumentNode, print } from "graphql";
import * as path from "path";
import { getAssetDefs, getStreamDefs, getWatcherDefs } from "./common";
import { getEnumDefs } from "./enums";

/**
 * Generates a merged schema for a given protocol.
 *
 * @param protocol - The protocol to generate a schema for.
 * @returns A merged schema for the given protocol.
 */
export function mergeSchema(protocol: Indexed.Protocol): string {
  const gqlDefs: string[] = [getCommonDefs("scalars"), path.join(SCHEMA_DIR, `${protocol}.graphql`)];
  const tsDefs: DocumentNode[] = [getEnumDefs(protocol), getAssetDefs(protocol), getWatcherDefs(protocol)];

  switch (protocol) {
    case Protocol.Airdrops:
      break;
    case Protocol.Flow:
    case Protocol.Lockup: {
      const actionDefs = getCommonDefs("action");
      const batchDefs = getCommonDefs("batch");
      gqlDefs.push(actionDefs, batchDefs);

      const streamDefs = getStreamDefs(protocol);
      tsDefs.push(streamDefs);
      break;
    }
  }

  const loadedGqlDefs = loadFilesSync(gqlDefs);
  const allDefs = [...loadedGqlDefs, ...tsDefs];
  const mergedSchema = mergeTypeDefs(allDefs, { throwOnConflict: true });
  return print(mergedSchema);
}

function getCommonDefs(file: string): string {
  return path.join(SCHEMA_DIR, "common", `${file}.graphql`);
}
