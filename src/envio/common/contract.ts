import { contracts } from "@sablier/deployments";
import type { Sablier } from "@sablier/deployments";
import { getIndexedContract } from "@src/contracts";
import type { Indexed } from "@src/types";
import _ from "lodash";
import type { Address } from "./bindings";
import { IndexingError } from "./error";

export function getContract(protocol: Indexed.Protocol, chainId: number, contractAddress: Address): Indexed.Contract {
  const contract = contracts.catalog[protocol][chainId][contractAddress as Sablier.Address];
  if (!contract) {
    throw new IndexingError.ContractNotFound(protocol, chainId, contractAddress);
  }
  if (!contract.alias) {
    throw new IndexingError.AliasNotFound(protocol, chainId, contractAddress);
  }
  return getIndexedContract(contract);
}

export function getContractAlias(protocol: Indexed.Protocol, chainId: number, contractAddress: string) {
  const contract = getContract(protocol, chainId, contractAddress);
  if (!contract.alias) {
    throw new IndexingError.AliasNotFound(protocol, chainId, contractAddress);
  }
  return contract.alias;
}

export function getContractVersion(protocol: Indexed.Protocol, chainId: number, contractAddress: string) {
  const contract = getContract(protocol, chainId, contractAddress);
  return contract.version;
}
