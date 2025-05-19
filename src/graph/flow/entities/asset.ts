import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../common/bindings";
import { getAssetName, getAssetSymbol } from "../../common/bindings/getters";
import { readChainId } from "../../common/context";
import { EntityAsset } from "../bindings";

export function getOrCreateEntityAsset(address: Address): EntityAsset {
  const id = address.toHexString();
  let asset = EntityAsset.load(id);

  if (asset == null) {
    asset = new EntityAsset(id);

    const erc20 = ERC20.bind(address);
    const decimals = erc20.decimals();

    asset.address = address;
    asset.chainId = readChainId();
    asset.decimals = BigInt.fromI32(decimals);
    asset.name = getAssetName(address);
    asset.symbol = getAssetSymbol(address);

    asset.save();
  }

  return asset;
}
