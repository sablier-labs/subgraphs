"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_protocol = exports.registry = exports.factory = exports.tranched = exports.flow = exports.dynamic = exports.linear = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_protocol = exports.chain = exports.chainId = void 0;
exports.chainId = 11155111;
exports.chain = "sepolia";
exports.startBlock_protocol = 4067889;
exports.startBlock_merkle = 4904890;
exports.startBlock_flow = 6618000;
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [
    ["0xd4300c5bc0b9e27c73ebabdc747ba990b1b570db", "LL", "V20"],
    ["0x7a43f8a888fa15e68c103e18b0439eb1e98e4301", "LL2", "V21"],
    ["0x3e435560fd0a03ddf70694b35b673c25c65abb6c", "LL3", "V22"],
];
exports.dynamic = [
    ["0x421e1e7a53ff360f70a2d02037ee394fa474e035", "LD", "V20"],
    ["0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a", "LD2", "V21"],
    ["0x73bb6dd3f5828d60f8b3dbc8798eb10fba2c5636", "LD3", "V22"],
];
exports.flow = [
    ["0xf978034bb3cab5fe88d23db5cb38d510485dab90", "FL", "V10"],
];
exports.tranched = [
    ["0x3a1bea13a8c24c0ea2b8fae91e4b2762a59d7af5", "LT3", "V22"],
];
exports.factory = [
    ["0xbacc1d151a78eed71d504f701c25e8739dc0262d", "MSF2", "V21"],
    ["0x56e9180a8d2c35c99f2f8a1a5ab8abe79e876e8c", "MSF3", "V22"],
];
/** PRBProxy registry */
exports.registry = "0x584009E9eDe26e212182c9745F5c000191296a78";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 * It should be a linear contract, the oldest/first one deployed on this chain.
 * ↪ 🚨 [Protocol] On any new chain, please create a Lockup Linear stream to kick-off the indexing flow
 */
exports.initializer_protocol = exports.linear[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
