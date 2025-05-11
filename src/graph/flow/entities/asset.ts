import { Address, BigInt } from "@graphprotocol/graph-ts";
import { DECIMALS_18, ONE, ZERO } from "../../constants";
import { getChainId } from "../../context";
import { ERC20, getAssetName, getAssetSymbol } from "../../erc20";
import { EntityAsset } from "../bindings";

export function getOrCreateEntityAsset(address: Address): EntityAsset {
  const id = address.toHexString();
  let asset = EntityAsset.load(id);

  if (asset == null) {
    asset = new EntityAsset(id);

    const erc20 = ERC20.bind(address);
    const decimals = erc20.decimals();
    const name = getAssetName(address);
    const symbol = getAssetSymbol(address);

    asset.address = address;
    asset.chainId = getChainId();
    asset.decimals = BigInt.fromI32(decimals);
    asset.name = name;
    asset.symbol = symbol;

    asset.save();
  }

  return asset;
}

export function toScaled(from: BigInt, assetAddress: string): BigInt {
  // The protocol doesn't allow tokens with > 18 decimals, so we can assume a difference >= 0
  const asset = getOrCreateEntityAsset(Address.fromString(assetAddress));
  const difference = DECIMALS_18.minus(asset.decimals);

  let padding = BigInt.fromI32(1);
  for (let i = ZERO; i < difference; i = i.plus(ONE)) {
    padding = padding.times(BigInt.fromI32(10));
  }

  return from.times(padding);
}
