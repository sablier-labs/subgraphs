import type { Sablier } from "@sablier/deployments";
import { contracts } from "@sablier/deployments";
import { getIndexedContract } from "@src/contracts";
import type { Indexed } from "@src/types";
import type { Address } from "./bindings";
import { IndexingError } from "./error";

export function readContract(protocol: Indexed.Protocol, chainId: number, contractAddress: Address): Indexed.Contract {
  const contract = contracts.catalog[protocol][chainId][contractAddress as Sablier.Address];
  if (!contract) {
    throw new IndexingError.ContractNotFound(protocol, chainId, contractAddress);
  }
  if (!contract.alias) {
    throw new IndexingError.AliasNotFound(protocol, chainId, contractAddress);
  }
  return getIndexedContract(contract);
}

export function readContractAlias(protocol: Indexed.Protocol, chainId: number, contractAddress: string) {
  const contract = readContract(protocol, chainId, contractAddress);
  if (!contract.alias) {
    throw new IndexingError.AliasNotFound(protocol, chainId, contractAddress);
  }
  return contract.alias;
}

export function readContractVersion(protocol: Indexed.Protocol, chainId: number, contractAddress: string) {
  const contract = readContract(protocol, chainId, contractAddress);
  return contract.version;
}
