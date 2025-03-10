"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.flow = exports.merged = exports.tranched = exports.dynamic = exports.linear = exports.hypersync = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 88888;
exports.chain = "chiliz";
exports.startBlock_lockup = 19125000;
exports.startBlock_merkle = 19125000;
exports.startBlock_flow = 19125000;
exports.hypersync = "https://chiliz.hypersync.xyz";
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [
    ["0xdf578c2c70a86945999c65961417057363530a1c", "LL3", "V22"],
];
exports.dynamic = [
    ["0xcff4a803b0bf55dd1be38fb96088478f3d2eecf2", "LD3", "V22"],
];
exports.tranched = [
    ["0xcb099efc90e88690e287259410b9ae63e1658cc6", "LT3", "V22"],
];
exports.merged = [
    ["0x711900e5f55d427cd88e5e3fcae54ccf02de71f4", "LK", "V23"],
];
exports.flow = [
    ["0x9efc8663cab0e2d97ad17c9fbfc8392445517e94", "FL", "V10"],
    ["0x28eab88ee8a951f78e1028557d0c3fd97af61a33", "FL2", "V11"],
];
exports.factory = [
    ["0x92fc05e49c27884d554d98a5c01ff0894a9dc29a", "MSF3", "V22"],
    ["0xf978034bb3cab5fe88d23db5cb38d510485dab90", "MSF4", "V23"],
];
/** PRBProxy registry */
exports.registry = "";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */
exports.initializer_lockup = exports.linear[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
