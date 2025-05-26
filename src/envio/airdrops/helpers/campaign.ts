import { type Entity } from "@envio-airdrops/bindings";
import { type Address } from "@envio-common/bindings";
import { queries, type Sablier } from "@sablier/deployments";

/**
 * Generates a nickname by using the asset symbol and the admin address.
 * If the name is not provided, it will use the first 6 and last 4 characters of the admin address.
 * @example "USDC by 0xcafe..beef"
 */
export function getNickname(admin: Address, asset: Entity.Asset, name: string | undefined): string {
  if (name === null) {
    const prefix = admin.slice(0, 6);
    const suffix = admin.slice(-4);
    return `${asset.symbol} by ${prefix}..${suffix}`;
  }
  return `${asset.symbol} in ${name}`;
}

/**
 * Checks if the given address is an official Lockup contract. This check is needed because the Lockup contract
 * is passed as function parameters when creating an airdrop campaign.
 * Note: the contract catalog provides a reverse mapping from addresses to contracts.
 */
export function isOfficialLockup(chainId: number, address: Address): boolean {
  const lowercasedAddress = address.toLowerCase() as Sablier.Address;
  const contract = queries.contracts.get({ chainId, contractAddress: lowercasedAddress, protocol: "lockup" });
  if (!contract) {
    return false;
  }
  return true;
}
