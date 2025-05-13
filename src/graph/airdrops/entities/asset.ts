import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../common/bindings";
import { getAssetName, getAssetSymbol } from "../../common/bindings/getters";
import { getChainId } from "../../common/context";
import { EntityAsset } from "../bindings";

export function getOrCreateEntityAsset(address: Address): EntityAsset {
  const id = address.toHexString();
  let asset = EntityAsset.load(id);

  if (asset == null) {
    asset = new EntityAsset(id);

    const contract = ERC20.bind(address);
    const decimals = contract.decimals();
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
