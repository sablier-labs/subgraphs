"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.flow = exports.merged = exports.tranched = exports.dynamic = exports.linear = exports.hypersync = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 50104;
exports.chain = "sophon";
exports.startBlock_lockup = 1;
exports.startBlock_merkle = 1;
exports.startBlock_flow = 1;
exports.hypersync = "https://sophon.hypersync.xyz";
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [];
exports.dynamic = [];
exports.tranched = [];
exports.merged = [
    ["0x6386dA73545ae4E2B2E0393688fA8B65Bb9a7169", "LK", "V23"],
];
exports.flow = [
    ["0x6386dA73545ae4E2B2E0393688fA8B65Bb9a7169", "FL2", "V11"],
];
exports.factory = [
    ["0x6386dA73545ae4E2B2E0393688fA8B65Bb9a7169", "MSF4", "V23"],
];
/** PRBProxy registry */
exports.registry = "";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */
exports.initializer_lockup = exports.merged[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
