import { Transfer as EventTransfer } from "./bindings/ERC20/ERC20";

// Dummy mapping for ERC-20 transfer needed solely for generating the ERC-20 types
// NOT meant to be used in any deployed subgraph
export function handleTransfer(event: EventTransfer): void {
  event.params.from.toHexString();
}
