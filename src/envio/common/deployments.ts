import { type Sablier, sablier } from "@sablier/deployments";
import { getIndexedContract } from "@src/contracts";
import type { Indexed } from "@src/types";
import type { Envio } from "./bindings";
import { IndexingError } from "./error";

export function getContract(
  protocol: Indexed.Protocol,
  chainId: number,
  contractAddress: Envio.Address,
): Indexed.Contract {
  const lowercasedAddress = contractAddress.toLowerCase() as Sablier.Address;
  const contract = sablier.contracts.get({ chainId, contractAddress: lowercasedAddress, protocol });
  if (!contract) {
    throw new IndexingError.ContractNotFound(protocol, chainId, contractAddress);
  }
  if (!contract.alias) {
    throw new IndexingError.AliasNotFound(protocol, chainId, contractAddress);
  }
  return getIndexedContract(contract);
}

export function getContractAlias(protocol: Indexed.Protocol, chainId: number, contractAddress: Envio.Address) {
  const contract = getContract(protocol, chainId, contractAddress);
  if (!contract.alias) {
    throw new IndexingError.AliasNotFound(protocol, chainId, contractAddress);
  }
  return contract.alias;
}

export function getContractVersion(protocol: Indexed.Protocol, chainId: number, contractAddress: Envio.Address) {
  const contract = getContract(protocol, chainId, contractAddress);
  return contract.version;
}
