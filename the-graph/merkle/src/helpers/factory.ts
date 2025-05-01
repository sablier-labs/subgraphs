import { Address } from "@graphprotocol/graph-ts";
import { Factory } from "../generated/types/schema";
import { getChainId, zero } from "../constants";

export function getFactoryByAddress(address: Address): Factory | null {
  const id = generateFactoryId(address);
  return Factory.load(id);
}

export function createFactory(
  address: Address,
  alias: string,
  version: string,
): Factory {
  let id = generateFactoryId(address);
  let entity = getFactoryByAddress(address);
  if (entity == null) {
    entity = new Factory(id);
  }

  entity.alias = alias.toLowerCase();
  entity.chainId = getChainId();
  entity.address = address;
  entity.campaignIndex = zero;

  entity.version = version;

  entity.save();
  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateFactoryId(address: Address): string {
  return "".concat(address.toHexString());
}
