/**
 * @file Main CLI entry point for Sablier Indexers utilities
 *
 * @example
 * pnpm tsx cli check-vendors --chain-id 1
 * pnpm tsx cli codegen schema --vendor graph --protocol flow
 * pnpm tsx cli fetch-assets --protocol flow --chain ethereum
 * pnpm tsx cli print-chains
 */

import { Command } from "commander";

export async function main() {
  const program = new Command();
  program.name("indexers-cli").description("CLI for Sablier Indexers utilities");

  /* -------------------------------------------------------------------------- */
  /*                            CODEGEN COMMANDS                               */
  /* -------------------------------------------------------------------------- */
  const codegen = program.command("codegen").description("Code generation commands");

  // Import and add codegen commands
  const { command: envioConfigCmd } = await import("./commands/codegen/envio-config.js");
  const { command: graphManifestCmd } = await import("./commands/codegen/graph-manifest.js");
  const { command: schemaCmd } = await import("./commands/codegen/schema.js");

  codegen.addCommand(envioConfigCmd.name("envio-config"));
  codegen.addCommand(graphManifestCmd.name("graph-manifest"));
  codegen.addCommand(schemaCmd.name("schema"));

  /* -------------------------------------------------------------------------- */
  /*                               PRINT COMMANDS                               */
  /* -------------------------------------------------------------------------- */
  const print = program.command("print").description("Print information commands");

  // Import and add print command
  const { command: printChainsCmd } = await import("./commands/print-chains.js");
  print.addCommand(printChainsCmd.name("chains"));

  /* -------------------------------------------------------------------------- */
  /*                                    OTHER                                   */
  /* -------------------------------------------------------------------------- */

  // Import and add export schemas command
  const { command: exportSchemasCmd } = await import("./commands/export-schemas.js");
  program.addCommand(exportSchemasCmd.name("export-schemas"));

  // Import and add fetch command
  const { command: fetchAssetsCmd } = await import("./commands/fetch-assets.js");
  program.addCommand(fetchAssetsCmd.name("fetch-assets"));

  // Import and add check-vendors command
  const { command: checkVendorsCmd } = await import("./commands/check-vendors.js");
  program.addCommand(checkVendorsCmd.name("check-vendors"));

  program.parse();
}

if (require.main === module) {
  main().catch(console.error);
}
