/**
 * @file Main CLI entry point for Sablier Indexers utilities
 *
 * @example
 * pnpm tsx cli fetch-assets --protocol flow --chain ethereum
 * pnpm tsx cli codegen schema --vendor graph --protocol flow
 * pnpm tsx cli print-chains
 */

import { Command } from "commander";

async function main() {
  const program = new Command();
  program.name("indexers-cli").description("CLI for Sablier Indexers utilities");

  /* -------------------------------------------------------------------------- */
  /*                            CODEGEN COMMANDS                               */
  /* -------------------------------------------------------------------------- */
  const codegen = program.command("codegen").description("Code generation utilities");

  // Import and add codegen commands
  const { command: envioConfigCmd } = await import("./codegen/envio-config.js");
  const { command: graphManifestCmd } = await import("./codegen/graph-manifest.js");
  const { command: schemaCmd } = await import("./codegen/schema.js");

  codegen.addCommand(envioConfigCmd.name("envio-config"));
  codegen.addCommand(graphManifestCmd.name("graph-manifest"));
  codegen.addCommand(schemaCmd.name("schema"));

  /* -------------------------------------------------------------------------- */
  /*                               FETCH COMMANDS                               */
  /* -------------------------------------------------------------------------- */

  // Import and add fetch command
  const { command: fetchAssetsCmd } = await import("./fetch/assets.js");
  program.addCommand(fetchAssetsCmd.name("fetch-assets"));

  /* -------------------------------------------------------------------------- */
  /*                               PRINT COMMANDS                               */
  /* -------------------------------------------------------------------------- */
  const print = program.command("print").description("Print information utilities");

  // Import and add print command
  const { command: printChainsCmd } = await import("./print-chains.js");
  print.addCommand(printChainsCmd.name("chains"));

  program.parse();
}

main().catch(console.error);
