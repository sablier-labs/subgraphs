import type { Sablier } from "sablier";
import type { Types } from "../types";
import { airdropsContracts } from "./airdrops";
import { flowContracts } from "./flow";
import { lockupContracts } from "./lockup";

type CS = Types.ContractSource<Sablier.Version>;

export const indexedContracts: Types.ProtocolMap<CS[]> = {
  airdrops: airdropsContracts,
  flow: flowContracts,
  lockup: lockupContracts,
};

/**
 * This function is called from the Envio indexer so we should not use the Winston logger.
 */
export function convertToIndexed(contract: Sablier.Contract): Types.Contract {
  return {
    address: contract.address.toLowerCase() as Sablier.Address,
    alias: contract.alias ?? "",
    block: contract.block ?? 0,
    chainId: contract.chainId,
    name: contract.name,
    protocol: contract.protocol as Types.Protocol,
    version: contract.version,
  };
}
