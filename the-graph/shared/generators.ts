import { BigInt as BInt, dataSource, ethereum, log } from "@graphprotocol/graph-ts";
import { Contract } from "../flow/generated/types/schema";
import { getChainId } from "./getters";

// TODO: add example
export function generateActionId(event: ethereum.Event): string {
  const hash = event.transaction.hash.toHexString();
  const index = event.logIndex.toString();
  return `${hash}-${index}`;
}

// TODO: add example
export function generateStreamId(tokenId: BInt): string {
  const contractId = dataSource.address().toHexString();
  const contract = Contract.load(contractId);
  if (contract == null) {
    log.error("[SABLIER] Contract not saved before this event: {}", [contractId]);
    return "";
  }

  const chainId = getChainId().toString();
  const streamId = `${contractId}-${chainId}-${tokenId.toString()}`;
  return streamId;
}

// TODO: add example
export function generateStreamAlias(tokenId: BInt): string {
  const contractId = dataSource.address().toHexString();
  const contract = Contract.load(contractId);
  if (contract == null) {
    log.error("[SABLIER] Contract not saved before this event: {}", [contractId]);
    return "";
  }

  const chainId = getChainId().toString();
  const alias = `${contract.alias}-${chainId}-${tokenId.toString()}`;
  return alias;
}
