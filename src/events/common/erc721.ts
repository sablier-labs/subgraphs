/**
 * Configuration mapping for ERC721 standard events to their handler functions.
 * This file defines the event signatures and their corresponding handler names
 * that will be used by the subgraph to process ERC721 events.
 *
 * @see https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.3.0/contracts/token/ERC721/ERC721.sol
 */
import type { Sablier } from "@sablier/deployments";
import type { Indexed } from "../../types";

export function erc721(
  protocol: Indexed.Protocol,
  version: Sablier.Version.Lockup,
  contractName: string,
): Indexed.Event[] {
  return [
    {
      contractName,
      eventName: "Approval",
      protocol,
      version,
    },
    {
      contractName,
      eventName: "ApprovalForAll",
      protocol,
      version,
    },
    {
      contractName,
      eventName: "Transfer",
      protocol,
      version,
    },
  ];
}
