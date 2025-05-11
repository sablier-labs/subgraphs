import { Address, BigInt } from "@graphprotocol/graph-ts";
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
