import { dataSource } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import { readChainId, readContractAlias } from "../../common/context";
import { EntityFactory } from "../bindings";

export function getOrCreateFactory(): EntityFactory {
  const address = dataSource.address();
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
