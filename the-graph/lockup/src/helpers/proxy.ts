import { Address } from "@graphprotocol/graph-ts";
import { StreamVersion_V20, getContractRegistry } from "../constants";
import { PRBProxy as PRBProxyContract } from "../generated/types/ContractInitializer/PRBProxy";
import { PRBProxyRegistry as PRBProxyRegistryContract } from "../generated/types/ContractInitializer/PRBProxyRegistry";
import type { Stream } from "../generated/types/schema";

export function bindProxyOwner(stream: Stream): Stream {
  if (stream.version !== StreamVersion_V20) {
    stream.proxied = false;
    return stream;
  }

  const registryValidation = getContractRegistry();
  if (!registryValidation || registryValidation.length === 0) {
    stream.proxied = false;
    return stream;
  }

  const proxy = PRBProxyContract.bind(Address.fromBytes(stream.sender));

  const owner = proxy.try_owner();
  if (owner.reverted) {
    stream.proxied = false;
    return stream;
  }

  const registry = PRBProxyRegistryContract.bind(Address.fromString(getContractRegistry()));
  const reverse = registry.try_getProxy(owner.value);

  if (reverse.reverted || !reverse.value.equals(Address.fromBytes(stream.sender))) {
    stream.proxied = false;
    return stream;
  }

  stream.parties.push(owner.value);
  stream.proxied = true;
  stream.proxender = owner.value;

  return stream;
}
