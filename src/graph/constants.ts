import { Address, BigInt as BInt, Bytes } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
// PRBProxy has the same address on all chains
export const PRB_PROXY_REGISTRY = Address.fromHexString("0x584009e9ede26e212182c9745f5c000191296a78");

export const DECIMALS_18 = BInt.fromI32(18);
export const ONE = BInt.fromI32(1);
export const TWO = BInt.fromI32(2);
export const ZERO = BInt.fromI32(0);
