import { Address, BigInt as BInt } from "@graphprotocol/graph-ts";
import { DECIMALS_18, ONE, ZERO } from "../../constants";
import { ContractERC20, ContractERC20Bytes } from "../../erc20/bindings";
import { getChainId } from "../../getters";
import { logInfo } from "../../logger";
import { EntityAsset } from "../bindings";

export function getOrCreateAsset(address: Address): EntityAsset {
  const id = address.toHexString();
  let entity = EntityAsset.load(id);

  if (entity == null) {
    entity = new EntityAsset(id);

    const contract = ContractERC20.bind(address);
    const decimals = contract.decimals();
    const name = getAssetName(address);
    const symbol = getAssetSymbol(address);

    entity.chainId = getChainId();
    entity.address = address;
    entity.symbol = symbol;
    entity.name = name;
    entity.decimals = BInt.fromI32(decimals);

    entity.save();
  }

  return entity;
}

function getAssetName(address: Address): string {
  const contract = ContractERC20.bind(address);
  const name = contract.try_name();

  if (name.reverted) {
    const contractBytes = ContractERC20Bytes.bind(address);
    const nameBytes = contractBytes.try_name();

    if (nameBytes.reverted) {
      logInfo("Name reverted for token {}", [address.toHexString()]);
      return "Unknown";
    }
    return nameBytes.value.toString();
  }
  return name.value;
}

function getAssetSymbol(address: Address): string {
  const contract = ContractERC20.bind(address);
  const symbol = contract.try_symbol();

  if (symbol.reverted) {
    const contractBytes = ContractERC20Bytes.bind(address);
    const symbolBytes = contractBytes.try_symbol();

    if (symbolBytes.reverted) {
      logInfo("Symbol reverted for token {}", [address.toHexString()]);
      return "Unknown";
    }
    return symbolBytes.value.toString();
  }
  return symbol.value;
}

export function toScaled(from: BInt, assetAddress: string): BInt {
  // The protocol doesn't allow tokens with > 18 decimals, so we can assume a difference >= 0
  const asset = getOrCreateAsset(Address.fromString(assetAddress));
  const difference = DECIMALS_18.minus(asset.decimals);

  let padding = BInt.fromI32(1);
  for (let i = ZERO; i.lt(difference); i = i.plus(ONE)) {
    padding = padding.times(BInt.fromI32(10));
  }

  return from.times(padding);
}
