import { type Command } from "commander";
import * as fs from "fs-extra";
import { print } from "graphql";
import paths from "../../src/paths";
import { getMergedSchema } from "../../src/schema";
import { PROTOCOLS } from "../constants";
import * as helpers from "../helpers";

export function exportSchemasCommand(): Command {
  const command = helpers.createBaseCmd("Copy GraphQL schemas to the dist directory");

  command.action(async () => {
    fs.ensureDirSync(paths.exports.schemas());
    for (const protocol of PROTOCOLS) {
      const schema = print(getMergedSchema(protocol));
      const outputPath = paths.exports.schema(protocol);
      fs.writeFileSync(outputPath, schema);
    }
  });

  return command;
}

export const exportSchemasCmd = exportSchemasCommand();
