import { Address } from "@graphprotocol/graph-ts";
import { LOCKUP_V1_0, PRB_PROXY_REGISTRY } from "../../constants";
import { PRBProxy, PRBProxyRegistry } from "../../prb-proxy/bindings";
import { EntityStream } from "../bindings";

export function addProxyOwner(stream: EntityStream): EntityStream {
  // PRBProxy is only used in Lockup v1.0
  if (stream.version !== LOCKUP_V1_0) {
    stream.proxied = false;
    return stream;
  }

  // Check if the registry exists
  const registry = PRBProxyRegistry.bind(PRB_PROXY_REGISTRY);
  if (registry.try_VERSION().reverted) {
    stream.proxied = false;
    return stream;
  }

  const sender: Address = Address.fromBytes(stream.sender);
  const proxy = PRBProxy.bind(sender);
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
