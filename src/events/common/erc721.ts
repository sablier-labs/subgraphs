/**
 * Configuration mapping for ERC721 standard events to their handler functions.
 * This file defines the event signatures and their corresponding handler names
 * that will be used by the subgraph to process ERC721 events.
 *
 * @see https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.3.0/contracts/token/ERC721/ERC721.sol
 */
import type { Indexed } from "@src/types";

const erc721Events: Indexed.Event[] = [
  {
    contractName: "ERC721",
    eventName: "Approval",
  },
  {
    contractName: "ERC721",
    eventName: "ApprovalForAll",
  },
  {
    contractName: "ERC721",
    eventName: "Transfer",
  },
];

export default erc721Events;
