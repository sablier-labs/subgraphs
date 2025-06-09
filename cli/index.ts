/**
 * @file Main CLI entry point for Sablier Indexers utilities
 *
 * @example
 * pnpm tsx cli fetch-assets --protocol flow --chain ethereum
 * pnpm tsx cli codegen schema --vendor graph --protocol flow
 * pnpm tsx cli print-chains
 */

import { Command } from "commander";
import * as helpers from "./helpers.js";

const program = new Command();
program.name("indexers-cli").description("CLI for Sablier Indexers utilities");

/* -------------------------------------------------------------------------- */
/*                            CODEGEN ENVIO CONFIG                            */
/* -------------------------------------------------------------------------- */
const codegen = program.command("codegen").description("Code generation utilities");
const envioConfigCmd = codegen.command("envio-config").description("Generate Envio config file");

helpers.addProtocolOption(envioConfigCmd);

envioConfigCmd.action(async (options) => {
  process.argv = ["node", "envio-config.ts", "--protocol", options.protocol];
  const { main } = await import("./codegen/envio-config.js");
  await main();
});

/* -------------------------------------------------------------------------- */
/*                           CODEGEN GRAPH MANIFEST                           */
/* -------------------------------------------------------------------------- */
const graphManifestCmd = codegen.command("graph-manifest").description("Generate subgraph manifests");

helpers.addProtocolOption(graphManifestCmd);
helpers.addChainOption(graphManifestCmd);

graphManifestCmd.action(async (options) => {
  process.argv = ["node", "graph-manifest.ts", "--protocol", options.protocol, "--chain", options.chain];
  const { main } = await import("./codegen/graph-manifest.js");
  await main();
});

/* -------------------------------------------------------------------------- */
/*                               CODEGEN SCHEMA                               */
/* -------------------------------------------------------------------------- */
const schemaCmd = codegen.command("schema").description("Generate GraphQL schema files");

helpers.addVendorOption(schemaCmd);
helpers.addProtocolOption(schemaCmd);

schemaCmd.action(async (options) => {
  process.argv = ["node", "schema.ts", "--vendor", options.vendor, "--protocol", options.protocol];
  const { main } = await import("./codegen/schema.js");
  await main();
});

/* -------------------------------------------------------------------------- */
/*                                FETCH ASSETS                                */
/* -------------------------------------------------------------------------- */
const fetchAssetsCmd = program.command("fetch-assets").description("Fetch ERC20 token data from The Graph subgraphs");

helpers.addProtocolOption(fetchAssetsCmd);
helpers.addChainOption(fetchAssetsCmd);

fetchAssetsCmd.action(async (options) => {
  process.argv = ["node", "fetch-assets.ts", "--protocol", options.protocol, "--chain", options.chain];
  const { main } = await import("./fetch/assets.js");
  await main();
});

/* -------------------------------------------------------------------------- */
/*                                    PRINT                                   */
/* -------------------------------------------------------------------------- */
const print = program.command("print").description("Print information utilities");

print
  .command("chains")
  .description("Print all available blockchain chains")
  .action(async () => {
    process.argv = ["node", "print-chains.ts"];
    const { main } = await import("./print-chains.js");
    await main();
  });

program.parse();
