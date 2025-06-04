import type { Sablier } from "@sablier/deployments";
import type { Indexed, ProtocolMap } from "../types";
import logger from "../winston";
import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

const indexedContracts: ProtocolMap<Indexed.ContractSource<Sablier.Version>[]> = {
  airdrops,
  flow,
  lockup,
};

export function getIndexedContract(contract: Sablier.Contract): Indexed.Contract {
  if (!contract.alias) {
    logger.debug(`Contract ${contract.name} has no alias`);
  }
  if (!contract.block) {
    logger.debug(`Contract ${contract.name} has no block`);
  }
  return {
    address: contract.address.toLowerCase(),
    alias: contract.alias ?? "",
    block: contract.block ?? 0,
    name: contract.name,
    protocol: contract.protocol as Indexed.Protocol,
    version: contract.version,
  };
}

export default indexedContracts;
