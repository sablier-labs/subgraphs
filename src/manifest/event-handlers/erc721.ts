/**
 * Configuration mapping for ERC721 standard events to their handler functions.
 * This file defines the event signatures and their corresponding handler names
 * that will be used by the subgraph to process ERC721 events.
 *
 * @see {@link ../../abi/ERC721.json} for the ABI implementation
 * @see https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.3.0/contracts/token/ERC721/ERC721.sol for the standard implementation
 */
import type { Manifest } from "../../types";
import { resolveEventHandler as resolve } from "../helpers";

const erc721EventHandlers: Manifest.EventHandler[] = [
  resolve("ERC721", "Approval"),
  resolve("ERC721", "ApprovalForAll"),
  resolve("ERC721", "Transfer"),
];

export default erc721EventHandlers;
