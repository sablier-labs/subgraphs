import { Address, BigInt } from "@graphprotocol/graph-ts";
import { getChainId } from "../../context";
import { ERC20, getAssetName, getAssetSymbol } from "../../erc20";
import { EntityAsset } from "../bindings";

export function getOrCreateEntityAsset(address: Address): EntityAsset {
  const id = address.toHexString();
  let entity = EntityAsset.load(id);

  if (entity == null) {
    entity = new EntityAsset(id);

    const contract = ERC20.bind(address);
    const decimals = contract.decimals();
    const name = getAssetName(address);
    const symbol = getAssetSymbol(address);

    entity.address = address;
    entity.chainId = getChainId();
    entity.decimals = BigInt.fromI32(decimals);
    entity.name = name;
    entity.symbol = symbol;

    entity.save();
  }

  return entity;
}
