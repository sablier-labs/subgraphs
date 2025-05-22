import { Address } from "@graphprotocol/graph-ts";
import { readLockups } from "../../common/context";
import { EntityAsset } from "../bindings";

/**
 * Generates a nickname by using the asset symbol and the admin address.
 * If the name is not provided, it will use the first 6 and last 4 characters of the admin address.
 * @example "USDC by 0xcafe..beef"
 */
export function getNickname(admin: Address, asset: EntityAsset, name: string | null): string {
  if (name === null) {
    const prefix = admin.toHexString().slice(0, 6);
    const suffix = admin.toHexString().slice(-4);
    return `${asset.symbol} by ${prefix}..${suffix}`;
  }
  return `${asset.symbol} in ${name}`;
}

/**
 * Checks if the given address is an official Lockup contract. This check is needed because the Lockup contract
 * is passed as function parameters when creating an airdrop campaign.
 */
export function isOfficialLockup(address: Address): boolean {
  const lockups = readLockups();
  for (let i = 0; i < lockups.length; i++) {
    if (lockups[i].toLowerCase() === address.toHexString().toLowerCase()) {
      return true;
    }
  }
  return false;
}
