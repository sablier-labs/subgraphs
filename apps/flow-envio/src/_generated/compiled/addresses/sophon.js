"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.flow = exports.merged = exports.tranched = exports.dynamic = exports.linear = exports.hypersync = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 50104;
exports.chain = "sophon";
exports.startBlock_lockup = 11275700;
exports.startBlock_merkle = 11290000;
exports.startBlock_flow = 11341390;
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
    ["0x28fcae6bda2546c93183eec8638691b2eb184003", "LK", "V23"],
];
exports.flow = [
    ["0x20c9a3e27322fc2b21ced430d1b2e12d90804db6", "FL2", "V11"],
];
exports.factory = [
    ["0x9d4923e2ff0b9dadc447a89f528760928f84d0f7", "MSF4", "V23"],
];
/** PRBProxy registry */
exports.registry = "";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */
exports.initializer_lockup = exports.merged[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
