import { erc20Abi, erc20Abi_bytes32 } from "viem";
import { Address } from "../../types";

export function getERC20Contract(address: Address) {
  return {
    address: address as `0x${string}`,
    abi: erc20Abi,
  };
}

export function getERC20BytesContract(address: Address) {
  return {
    address: address as `0x${string}`,
    abi: erc20Abi_bytes32,
  };
}
