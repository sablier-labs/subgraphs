import { Address } from "@graphprotocol/graph-ts";
import { ZERO } from "../../constants";
import { getChainId } from "../../context";
import { EntityFactory } from "../bindings";

export function getFactoryByAddress(address: Address): EntityFactory | null {
  const id = address.toHexString();
  return EntityFactory.load(id);
}

export function createFactory(address: Address, alias: string, version: string): EntityFactory {
  const id = address.toHexString();
  let entity = getFactoryByAddress(address);
  if (entity == null) {
    entity = new EntityFactory(id);
  }

  entity.alias = alias.toLowerCase();
  entity.chainId = getChainId();
  entity.address = address;
  entity.campaignIndex = ZERO;

  entity.version = version;

  entity.save();
  return entity;
}
