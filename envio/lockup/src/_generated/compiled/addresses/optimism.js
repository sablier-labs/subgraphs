"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.flow = exports.merged = exports.tranched = exports.dynamic = exports.linear = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 10;
exports.chain = "optimism";
exports.startBlock_lockup = 106405050;
exports.startBlock_merkle = 113621900;
exports.startBlock_flow = 128865000;
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [
    ["0xb923abdca17aed90eb5ec5e407bd37164f632bfd", "LL", "V20"],
    ["0x4b45090152a5731b5bc71b5baf71e60e05b33867", "LL2", "V21"],
    ["0x5c22471a86e9558ed9d22235dd5e0429207ccf4b", "LL3", "V22"],
];
exports.dynamic = [
    ["0x6f68516c21e248cddfaf4898e66b2b0adee0e0d6", "LD", "V20"],
    ["0xd6920c1094eabc4b71f3dc411a1566f64f4c206e", "LD2", "V21"],
    ["0x4994325f8d4b4a36bd643128beb3ec3e582192c0", "LD3", "V22"],
];
exports.tranched = [
    ["0x90952912a50079bef00d5f49c975058d6573acdc", "LT3", "V22"],
];
exports.merged = [
    ["0x822e9c4852e978104d82f0f785bfa663c2b700c1", "LK", "V23"],
];
exports.flow = [
    ["0x906356e4e6410ea0a97dbc5b071cf394ab0dcd69", "FL", "V10"],
    ["0xc5612fea2d370127ac67048115bd6b1df7b7f7c0", "FL2", "V11"],
];
exports.factory = [
    ["0x044ec80fbec40f0ee7e7b3856828170971796c19", "MSF2", "V21"],
    ["0xe041629d99730b3ee4d6518097c45b4e3591992b", "MSF3", "V22"],
    ["0x2455bff7a71e6e441b2d0b1b1e480fe36ebf6d1e", "MSF4", "V23"],
];
/** PRBProxy registry */
exports.registry = "0x584009e9ede26e212182c9745f5c000191296a78";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */
exports.initializer_lockup = exports.linear[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
