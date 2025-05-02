"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.flow = exports.merged = exports.tranched = exports.dynamic = exports.linear = exports.hypersync = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 5845;
exports.chain = "tangle";
exports.startBlock_lockup = 2515000;
exports.startBlock_merkle = 2516000;
exports.startBlock_flow = 3296000;
exports.hypersync = "https://tangle.hypersync.xyz";
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [["0xac19f4181e58efb7094e0cb4e1bb18c79f6aadf4", "LL3", "V22"]];
exports.dynamic = [["0x946654ab30dd6ed10236c89f2c8b2719df653691", "LD3", "V22"]];
exports.tranched = [["0x63b92f7e2f69877184c955e63b9d8dff55e52e14", "LT3", "V22"]];
exports.merged = [["0x1cae76b71913598d7664d16641ccb6037d8ed61a", "LK", "V23"]];
exports.flow = [
    ["0xcff4a803b0bf55dd1be38fb96088478f3d2eecf2", "FL", "V10"],
    ["0xcb099efc90e88690e287259410b9ae63e1658cc6", "FL2", "V11"],
];
exports.factory = [
    ["0x5e73bb96493c10919204045fcdb639d35ad859f8", "MSF3", "V22"],
    ["0xd641a0e4509cced67cc24e7bdcde2a31b7f7cf77", "MSF4", "V23"],
];
/** PRBProxy registry */
exports.registry = "";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */
exports.initializer_lockup = exports.linear[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
