"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer_flow = exports.initializer_merkle = exports.initializer_lockup = exports.registry = exports.factory = exports.merged = exports.tranched = exports.flow = exports.dynamic = exports.linear = exports.startBlock_flow = exports.startBlock_merkle = exports.startBlock_lockup = exports.chain = exports.chainId = void 0;
exports.chainId = 43114;
exports.chain = "avalanche";
exports.startBlock_lockup = 32164210;
exports.startBlock_merkle = 41023950;
exports.startBlock_flow = 53922000;
/** Rule: keep addresses lowercased */
/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */
exports.linear = [
    ["0x610346e9088afa70d6b03e96a800b3267e75ca19", "LL", "V20"],
    ["0xb24b65e015620455bb41deaad4e1902f1be9805f", "LL2", "V21"],
    ["0xc0bf14afb95ca4c049bdc19e06a3531d8065f6fd", "LL3", "V22"],
];
exports.dynamic = [
    ["0x665d1c8337f1035cfbe13dd94bb669110b975f5f", "LD", "V21"],
    ["0x0310da0d8ff141166ed47548f00c96464880781f", "LD2", "V21"],
    ["0xe3826241e5eebb3f5fede33f9f677047674d3fbf", "LD3", "V22"],
];
exports.flow = [
    ["0x8c172e42c06302e3cfe555dc4d6b71a756ee186b", "FL", "V10"],
    ["0xac7cb985d4022a5ebd4a385374ac3d3b487b3c63", "FL2", "V11"],
];
exports.tranched = [
    ["0xfa536049652bfb5f57ba8dcfbec1b2b2dd9803d3", "LT3", "V22"],
];
exports.merged = [
    ["0x3c81bbbe72ef8ef3fb1d19b0bd6310ad0dd27e82", "LK", "V23"],
];
exports.factory = [
    ["0x4849e797d7aab20fcc8f807efafdfff98a83412e", "MSF2", "V21"],
    ["0x0430ed39ea2789acdf27b89268117ebabc8176d1", "MSF3", "V22"],
    ["0x6bcd2260825cfed440bb765f7a92f6cdbdc90f43", "MSF4", "V23"],
];
/** PRBProxy registry */
exports.registry = "0x584009e9ede26e212182c9745f5c000191296a78";
/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 * It should be a linear contract, the oldest/first one deployed on this chain.
 * ↪ 🚨 [Lockup] On any new chain, please create a Lockup Linear stream to kick-off indexing
 */
exports.initializer_lockup = exports.linear[0][0];
exports.initializer_merkle = exports.factory[0][0];
exports.initializer_flow = exports.flow[0][0];
