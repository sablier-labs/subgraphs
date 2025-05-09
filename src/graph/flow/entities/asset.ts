import { Address, BigInt as BInt } from "@graphprotocol/graph-ts";
import { DECIMALS_18, ONE, ZERO } from "../../constants";
import { getChainId } from "../../context";
import { ERC20, getAssetName, getAssetSymbol } from "../../erc20";
import { EntityAsset } from "../bindings";

export function getOrCreateEntityAsset(address: Address): EntityAsset {
  const id = address.toHexString();
  let entity = EntityAsset.load(id);

  if (entity == null) {
    entity = new EntityAsset(id);

    const erc20 = ERC20.bind(address);
    const decimals = erc20.decimals();
    const name = getAssetName(address);
    const symbol = getAssetSymbol(address);

    entity.address = address;
    entity.chainId = getChainId();
    entity.decimals = BInt.fromI32(decimals);
    entity.name = name;
    entity.symbol = symbol;

    entity.save();
  }

  return entity;
}

export function toScaled(from: BInt, assetAddress: string): BInt {
  // The protocol doesn't allow tokens with > 18 decimals, so we can assume a difference >= 0
  const asset = getOrCreateEntityAsset(Address.fromString(assetAddress));
  const difference = DECIMALS_18.minus(asset.decimals);

  let padding = BInt.fromI32(1);
  for (let i = ZERO; i < difference; i = i.plus(ONE)) {
    padding = padding.times(BInt.fromI32(10));
  }

  return from.times(padding);
}
