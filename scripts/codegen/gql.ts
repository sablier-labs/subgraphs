import { generate } from "@graphql-codegen/cli";
import config from "@src/gql/config";
import { type Indexed } from "@src/types";
import logger from "@src/winston";
import { validateProtocolArg, validateVendorArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating GQL files
 *
 * @example Generate for Flow:
 * pnpm tsx scripts/codegen/gql.ts flow
 *
 * @param {string} [protocol='all'] - 'flow' or 'lockup'
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const vendorArg = validateVendorArg(args[0]);
  const protocolArg = validateProtocolArg(args[1]);

  function handleAllProtocols(vendor: Indexed.Vendor): void {
    const protocols: Indexed.Protocol[] = ["airdrops", "flow", "lockup"];

    for (const p of protocols) {
      generateGQL(vendor, p);
    }
  }

  function handleAllVendors(): void {
    const vendors: Indexed.Vendor[] = ["envio", "graph"];

    for (const v of vendors) {
      if (protocolArg === "all") {
        handleAllProtocols(v);
      } else {
        generateGQL(v, protocolArg);
      }
    }

    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info("🎉 Successfully generated all GQL configs!\n");
  }

  if (vendorArg === "all") {
    handleAllVendors();
  } else if (protocolArg === "all") {
    handleAllProtocols(vendorArg as Indexed.Vendor);
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info("🎉 Successfully generated all GQL configs!\n");
  } else {
    generateGQL(vendorArg as Indexed.Vendor, protocolArg);
  }
}

main();

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

async function generateGQL(vendor: Indexed.Vendor, protocol: Indexed.Protocol): Promise<void> {
  await generate(config[vendor][protocol], true);
  logger.info(`✅ Successfully generated the GQL types for ${vendor} ${protocol}`);
}
