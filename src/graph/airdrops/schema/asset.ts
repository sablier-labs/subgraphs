import { Address, BigInt as BInt } from "@graphprotocol/graph-ts";
import { ContractERC20, ContractERC20Bytes } from "../../erc20/bindings";
import { getChainId } from "../../getters";
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

function getAssetSymbol(address: Address): string {
  const contract = ContractERC20.bind(address);
  const symbol = contract.try_symbol();

  if (symbol.reverted) {
    const contractBytes = ContractERC20Bytes.bind(address);
    const symbolBytes = contractBytes.try_symbol();

    if (symbolBytes.reverted) {
      return "Unknown";
    }
    return symbolBytes.value.toString();
  }
  return symbol.value;
}

function getAssetName(address: Address): string {
  const contract = ContractERC20.bind(address);
  const name = contract.try_name();

  if (name.reverted) {
    const contractBytes = ContractERC20Bytes.bind(address);
    const nameBytes = contractBytes.try_name();

    if (nameBytes.reverted) {
      return "Unknown";
    }
    return nameBytes.value.toString();
  }
  return name.value;
}
