import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

export const FLOW_V1_0 = "v1.0";
export const FLOW_V1_1 = "v1.1";

export const LOCKUP_V1_0 = "v1.0";
export const LOCKUP_V1_1 = "v1.1";
export const LOCKUP_V1_2 = "v1.2";
export const LOCKUP_V2_0 = "v2.0";

export const ADDRESS_ZERO = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
// PRBProxy has the same address on all chains
export const PRB_PROXY_REGISTRY = Address.fromBytes(Bytes.fromHexString("0x584009e9ede26e212182c9745f5c000191296a78"));

export const DECIMALS_18 = BigInt.fromI32(18);
export const LOG_PREFIX = "[SABLIER] ";
export const ONE = BigInt.fromI32(1);
export const TWO = BigInt.fromI32(2);
export const ZERO = BigInt.fromI32(0);
