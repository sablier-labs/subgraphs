"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.merged = exports.tranched = exports.flow = exports.dynamic = exports.linear = exports.hypersync = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 5330;
exports.chain = "superseed";
exports.startBlock_lockup = 2896100;
exports.startBlock_merkle = 2896400;
exports.startBlock_flow = 3610000;
exports.hypersync = "https://extrabud.hypersync.xyz";
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [
    ["0x251fc799344151026d19b959b8f3667416d56b88", "LL3", "V22"],
];
exports.dynamic = [
    ["0x1fa500262b352d821b4e1c933a20f2242b45383d", "LD3", "V22"],
];
exports.flow = [
    ["0x4f5f9b3fb57bba43aaf90e3f71d8f8f384e88e20", "FL", "V10"],
    ["0x40e75bb2f2aa3507d3a332872829c71be19ef623", "FL2", "V11"],
];
exports.tranched = [
    ["0x91211e1760280d3f7df2182ce4d1fd6a1735c202", "LT3", "V22"],
];
exports.merged = [
    ["0xf46d1f8c85f215a515f6d738ab3e3ba081f6c083", "LK", "V23"],
];
exports.factory = [
    ["0xf60beadefbeb98c927e13c4165bca7d85ba32cb2", "MSF3", "V22"],
    ["0x3df48bb93509d9a041c81f6670c37b1eeb3e154b", "MSF4", "V23"],
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
