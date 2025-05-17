import { Address } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import { getChainId, getContractAlias } from "../../common/context";
import { EntityFactory } from "../bindings";

export function getOrCreateEntityFactory(address: Address): EntityFactory {
  let factory = EntityFactory.load(address.toHexString());

  if (factory === null) {
    factory = new EntityFactory(address.toHexString());
    factory.address = address;
    factory.alias = getContractAlias();
    factory.campaignCounter = ZERO;
    factory.chainId = getChainId();
  }

  return factory;
}
