import { type Command } from "commander";
import * as fs from "fs-extra";
import { print } from "graphql";
import paths from "../../../src/paths";
import { getMergedSchema } from "../../../src/schema";
import { PROTOCOLS } from "../../constants";
import * as helpers from "../../helpers";

export function buildSchemaCommand(): Command {
  const command = helpers.createBaseCommand("Copy GraphQL schemas to the dist directory");

  command.action(async () => {
    fs.ensureDirSync(paths.dist.schemas());
    for (const protocol of PROTOCOLS) {
      const schema = print(getMergedSchema(protocol));
      const outputPath = paths.dist.schemas(protocol);
      fs.writeFileSync(outputPath, schema);
    }
  });

  return command;
}

export const command = buildSchemaCommand();
