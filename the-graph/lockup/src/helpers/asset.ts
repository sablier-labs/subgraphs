import { type Address, BigInt as GraphBigInt } from "@graphprotocol/graph-ts";
import { getChainId } from "../constants";
import { Asset } from "../generated/types/schema";
import { ERC20 as ERC20Contract } from "../generated/types/templates/ContractLockupLinear/ERC20";
import { ERC20Bytes as ERC20BytesContract } from "../generated/types/templates/ContractLockupLinear/ERC20Bytes";

export function getOrCreateAsset(address: Address): Asset {
  const id = generateAssetId(address);
  let entity = Asset.load(id);

  if (entity == null) {
    entity = new Asset(id);

    const contract = ERC20Contract.bind(address);
    const decimals = contract.decimals();
    const name = getAssetName(address);
    const symbol = getAssetSymbol(address);

    entity.chainId = getChainId();
    entity.address = address;
    entity.symbol = symbol;
    entity.name = name;
    entity.decimals = GraphBigInt.fromI32(decimals);

    entity.save();
  }

  return entity;
}

function getAssetSymbol(address: Address): string {
  const contract = ERC20Contract.bind(address);
  const symbol = contract.try_symbol();

  if (symbol.reverted) {
    const contractBytes = ERC20BytesContract.bind(address);
    const symbolBytes = contractBytes.try_symbol();

    if (symbolBytes.reverted) {
      return "Unknown";
    }
    return symbolBytes.value.toString();
  }
  return symbol.value;
}

function getAssetName(address: Address): string {
  const contract = ERC20Contract.bind(address);
  const name = contract.try_name();

  if (name.reverted) {
    const contractBytes = ERC20BytesContract.bind(address);
    const nameBytes = contractBytes.try_name();

    if (nameBytes.reverted) {
      return "Unknown";
    }
    return nameBytes.value.toString();
  }
  return name.value;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateAssetId(address: Address): string {
  return "".concat(address.toHexString());
}
