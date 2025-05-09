import { DeployProxy as EventDeployProxy } from "./bindings/PRBProxyRegistry/PRBProxyRegistry";

/**
 * Dummy handler for PRBProxyRegistry events.
 * This function exists only to generate the necessary bindings and is not meant to be used in production.
 */
export function handleDeployProxy(event: EventDeployProxy): void {
  event.params.proxy.toHexString();
}
