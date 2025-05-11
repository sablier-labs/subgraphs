/**
 * Configuration mapping for ERC721 standard events to their handler functions.
 * This file defines the event signatures and their corresponding handler names
 * that will be used by the subgraph to process ERC721 events.
 *
 * @see {@link ../../../abi/ERC721.json} for the ABI implementation
 * @see https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.3.0/contracts/token/ERC721/ERC721.sol for the standard implementation
 */
import type { Manifest } from "@src/types";
import { resolveEventHandler as resolve } from "./helpers";

const erc721Handlers: Manifest.EventHandler[] = [
  resolve({
    contractName: "ERC721",
    eventName: "Approval",
  }),
  resolve({
    contractName: "ERC721",
    eventName: "ApprovalForAll",
  }),
  resolve({
    contractName: "ERC721",
    eventName: "Transfer",
  }),
];

export default erc721Handlers;
