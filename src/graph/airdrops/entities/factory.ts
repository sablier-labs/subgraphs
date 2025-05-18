import { Address } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import { readChainId, readContractAlias } from "../../common/context";
import { EntityFactory } from "../bindings";

export function getOrCreateEntityFactory(address: Address): EntityFactory {
  let factory = EntityFactory.load(address.toHexString());

  if (factory === null) {
    factory = new EntityFactory(address.toHexString());
    factory.address = address;
    factory.alias = readContractAlias();
    factory.campaignCounter = ZERO;
    factory.chainId = readChainId();
  }

  return factory;
}
