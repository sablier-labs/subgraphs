"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.merged = exports.tranched = exports.flow = exports.dynamic = exports.linear = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 324;
exports.chain = "zksync-era";
exports.startBlock_lockup = 32472500;
exports.startBlock_merkle = 33148900;
exports.startBlock_flow = 50572000;
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [
    ["0x2fca69fa0a318efdf4c15ee8f13a873347a8a8d4", "LL2", "V21"],
    ["0x8cb69b514e97a904743922e1adf3d1627deeee8d", "LL3", "V22"],
];
exports.dynamic = [
    ["0xe6c7324bea8474209103e407779eec600c07cf3f", "LD2", "V21"],
    ["0xf03f4bf48b108360baf1597fb8053ebe0f5245da", "LD3", "V22"],
];
exports.flow = [
    ["0x015899a075b7c181e357cd0ed000683dbb4f1fce", "FL", "V10"],
    ["0xe3747379bf7282e0ab5389a63ea053a5256042df", "FL2", "V11"],
];
exports.tranched = [
    ["0x1fb145a47eb9b8bf565273e137356376197b3559", "LT3", "V22"],
];
exports.merged = [
    ["0x7bccb3595aa81dbe8a69dd8c46f5c2a3cf76594a", "LK", "V23"],
];
exports.factory = [
    ["0x46de683d20c3575a0381ffd66c10ab6836390140", "MSF2", "V21"],
    ["0x8a84fcf962163a7e98bf0dafd918973c846fa5c8", "MSF3", "V22"],
    ["0x8e7e78799f8cc87d4816112a758281dabc158452", "MSF4", "V23"],
];
/** PRBProxy registry */
exports.registry = "";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 * It should be a linear contract, the oldest/first one deployed on this chain.
 * ↪ 🚨 [Lockup] On any new chain, please create a Lockup Linear stream to kick-off indexing
 */
exports.initializer_lockup = exports.linear[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
