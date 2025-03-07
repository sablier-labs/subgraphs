"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.flow = exports.merged = exports.tranched = exports.dynamic = exports.linear = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 81457;
exports.chain = "blast-mainnet";
exports.startBlock_lockup = 243800;
exports.startBlock_merkle = 244700;
exports.startBlock_flow = 12259000;
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [
    ["0xcb099efc90e88690e287259410b9ae63e1658cc6", "LL2", "V21"],
    ["0x9b1468d29b4a5869f00c92517c57f8656e928b93", "LL3", "V22"],
];
exports.dynamic = [
    ["0xdf578c2c70a86945999c65961417057363530a1c", "LD2", "V21"],
    ["0xa705de617673e2fe63a4ea0e58c26897601d32a5", "LD3", "V22"],
];
exports.tranched = [
    ["0x91fb72e5297e2728c10fde73bde74a4888a68570", "LT3", "V22"],
];
exports.merged = [
    ["0xdbb6e9653d7e41766712db22eb08ed3f21009fdd", "LK", "V23"],
];
exports.flow = [
    ["0xfdac2799644141856e20e021ac06f231cafc731f", "FL", "V10"],
    ["0x16b50eb5eaef0366f1a4da594e2a8c8943a297e0", "FL2", "V11"],
];
exports.factory = [
    ["0x92fc05e49c27884d554d98a5c01ff0894a9dc29a", "MSF2", "V21"],
    ["0x3abcdda756d069cf3c7a17410602343966eaff27", "MSF3", "V22"],
    ["0xdd40b4f5b216f524a55e2e8f75637e8b453e4bd2", "MSF4", "V23"],
];
/** PRBProxy registry */
exports.registry = "";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */
exports.initializer_lockup = exports.linear[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
