import { Address } from "@graphprotocol/graph-ts";
import { PRBProxy as PRBProxyContract } from "../generated/types/ContractInitializer/PRBProxy";
import { PRBProxyRegistry as PRBProxyRegistryContract } from "../generated/types/ContractInitializer/PRBProxyRegistry";
import { Stream } from "../generated/types/schema";
import { StreamVersion_V20, getContractRegistry } from "../constants";

export function bindProxyOwner(stream: Stream): Stream {
  if (stream.version != StreamVersion_V20) {
    stream.proxied = false;
    return stream;
  }

  let registryValidation = getContractRegistry();
  if (!registryValidation || registryValidation.length === 0) {
    stream.proxied = false;
    return stream;
  }

  let proxy = PRBProxyContract.bind(Address.fromBytes(stream.sender));

  let owner = proxy.try_owner();
  if (owner.reverted) {
    stream.proxied = false;
    return stream;
  }

  let registry = PRBProxyRegistryContract.bind(
    Address.fromString(getContractRegistry()),
  );
  let reverse = registry.try_getProxy(owner.value);

  if (
    reverse.reverted ||
    !reverse.value.equals(Address.fromBytes(stream.sender))
  ) {
    stream.proxied = false;
    return stream;
  }

  stream.parties.push(owner.value);
  stream.proxied = true;
  stream.proxender = owner.value;

  return stream;
}
