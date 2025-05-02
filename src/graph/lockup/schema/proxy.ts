import { Address } from "@graphprotocol/graph-ts";
import { PRB_PROXY_REGISTRY } from "../../constants";
import { ContractPRBProxy, ContractPRBProxyRegistry, EntityStream } from "../bindings";

export function bindProxyOwner(stream: EntityStream): EntityStream {
  // PRBProxy is only used in Lockup v1.0
  // TODO: update this
  if (stream.version !== "V20") {
    stream.proxied = false;
    return stream;
  }

  // Check if the registry exists
  const registry = ContractPRBProxyRegistry.bind(PRB_PROXY_REGISTRY);
  if (registry.try_VERSION().reverted) {
    stream.proxied = false;
    return stream;
  }

  const sender: Address = Address.fromBytes(stream.sender);
  const proxy = ContractPRBProxy.bind(sender);
  const owner = proxy.try_owner();
  if (owner.reverted) {
    stream.proxied = false;
    return stream;
  }

  const reverse = registry.try_getProxy(owner.value);
  if (reverse.reverted || !reverse.value.equals(sender)) {
    stream.proxied = false;
    return stream;
  }

  stream.parties.push(owner.value);
  stream.proxied = true;
  stream.proxender = owner.value;

  return stream;
}
