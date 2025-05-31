import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../common/bindings";
import { getAssetName, getAssetSymbol } from "../../common/bindings/getters";
import { readChainId } from "../../common/context";
import { Id } from "../../common/id";
import { EntityAsset } from "../bindings";

export function getOrCreateAsset(address: Address): EntityAsset {
  const id = Id.asset(address);
  let asset = EntityAsset.load(id);

  if (asset === null) {
    asset = new EntityAsset(id);

    const erc20 = ERC20.bind(address);
    const decimals = erc20.decimals();
    const name = getAssetName(address);
    const symbol = getAssetSymbol(address);

    asset.address = address;
    asset.chainId = readChainId();
    asset.decimals = BigInt.fromI32(decimals);
    asset.name = name;
    asset.symbol = symbol;

    asset.save();
  }

  return asset;
}
