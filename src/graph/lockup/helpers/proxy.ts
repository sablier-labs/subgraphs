import { Address } from "@graphprotocol/graph-ts";
import { PRBProxy, PRBProxyRegistry } from "../../common/bindings";
import { PRB_PROXY_REGISTRY } from "../../common/constants";
import { logError } from "../../common/logger";

/**
 * The proxender is the owner of the proxy that is the sender of the stream.
 */
export function loadProxender(sender: Address): Address | null {
  // Check if the registry exists
  const registry = PRBProxyRegistry.bind(PRB_PROXY_REGISTRY);
  if (registry.try_VERSION().reverted) {
    return null;
  }

  const proxy = PRBProxy.bind(sender);
  const owner = proxy.try_owner();
  if (owner.reverted) {
    return null;
  }

  // Check that the registry has the same owner for the proxy.
  const reverse = registry.try_getProxy(owner.value);
  if (reverse.reverted || !reverse.value.equals(sender)) {
    logError("Proxy registry could not retrieve proxy for owner {}", [owner.value.toHexString()]);
    return null;
  }

  return owner.value;
}
