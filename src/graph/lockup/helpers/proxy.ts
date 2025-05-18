import { Address } from "@graphprotocol/graph-ts";
import { PRBProxy, PRBProxyRegistry } from "../../common/bindings";
import { LOCKUP_V1_0, PRB_PROXY_REGISTRY } from "../../common/constants";
import { readContractVersion } from "../../common/context";
import { logError } from "../../common/logger";

export function loadProxy(sender: Address): Address | null {
  // PRBProxy was only used in Lockup v1.0
  if (readContractVersion() !== LOCKUP_V1_0) {
    return null;
  }

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

  const reverse = registry.try_getProxy(owner.value);
  if (reverse.reverted || !reverse.value.equals(sender)) {
    logError("Proxy registry could not retrieve proxy for owner {}", [owner.value.toHexString()]);
    return null;
  }

  return owner.value;
}
