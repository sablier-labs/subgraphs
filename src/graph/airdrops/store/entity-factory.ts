import { dataSource } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import { readChainId, readContractAlias } from "../../common/context";
import * as Entity from "../bindings/schema";

export function getOrCreateFactory(): Entity.Factory {
  const address = dataSource.address();
  let factory = Entity.Factory.load(address.toHexString());

  if (factory === null) {
    factory = new Entity.Factory(address.toHexString());
    factory.address = address;
    factory.alias = readContractAlias();
    factory.campaignCounter = ZERO;
    factory.chainId = readChainId();
  }

  return factory;
}
