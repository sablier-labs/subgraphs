import { Transfer as EventTransfer } from "./bindings/ERC20/ERC20";

/**
 * Dummy handler for ERC20 Transfer events.
 * This function exists only to generate the necessary bindings and is not meant to be used in production.
 */
export function handleTransfer(event: EventTransfer): void {
  event.params.from.toHexString();
}
