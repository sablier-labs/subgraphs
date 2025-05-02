"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chains = void 0;
var arbitrum = require("../addresses/arbitrum");
var avalanche = require("../addresses/avalanche");
var base = require("../addresses/base");
var baseSepolia = require("../addresses/base-sepolia");
var bsc = require("../addresses/bsc");
var chiliz = require("../addresses/chiliz");
var gnosis = require("../addresses/gnosis");
var linea = require("../addresses/linea");
var mainnet = require("../addresses/mainnet");
var mode = require("../addresses/mode");
var morph = require("../addresses/morph");
var optimism = require("../addresses/optimism");
var polygon = require("../addresses/polygon");
var scroll = require("../addresses/scroll");
var sepolia = require("../addresses/sepolia");
var superseed = require("../addresses/superseed");
var tangle = require("../addresses/tangle");
var zksync = require("../addresses/zksync");
var definitions_1 = require("./definitions");
var available = function (v) {
    return v.flow.length > 0;
};
var filter = function (list, version) {
    return (list
        .filter(function (entry) { return entry[2] === version; })
        .map(function (entry) {
        var _a;
        return ({
            address: ((_a = entry[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "",
            alias: entry[1],
            version: entry[2],
        });
    }) || []);
};
/**
 * Bind a viem chain definition to a sablier indexer configuration.
 * ↪ 🚨 Chains without valid viem definitions will not be taken into account.
 */
var chains = function () {
    var list = [
        [arbitrum, definitions_1.default.arbitrum],
        [avalanche, definitions_1.default.avalanche],
        [base, definitions_1.default.base],
        [baseSepolia, definitions_1.default.baseSepolia],
        [bsc, definitions_1.default.bsc],
        [chiliz, definitions_1.default.chiliz],
        [gnosis, definitions_1.default.gnosis],
        [linea, definitions_1.default.linea],
        [mainnet, definitions_1.default.mainnet],
        [mode, definitions_1.default.mode],
        [morph, definitions_1.default.morph],
        [optimism, definitions_1.default.optimism],
        [polygon, definitions_1.default.polygon],
        [sepolia, definitions_1.default.sepolia],
        [scroll, definitions_1.default.scroll],
        [superseed, definitions_1.default.superseed],
        [tangle, definitions_1.default.tangle],
        [zksync, definitions_1.default.zksync],
    ];
    /** Merging the arrays with a spread operator will break mustache's template engine */
    return list
        .map(function (_a) {
        var item = _a[0], definition = _a[1];
        var V10 = {
            flow: filter(item.flow, "V10"),
            available: false,
        };
        V10.available = available(V10);
        var V11 = {
            flow: filter(item.flow, "V11"),
            available: false,
        };
        V11.available = available(V11);
        return {
            definition: definition,
            id: item.chainId,
            name: item.chain,
            hypersync: "hypersync" in item ? item.hypersync : undefined,
            rpcsync: "rpcsync" in item ? item.rpcsync : undefined,
            start_block: item.startBlock_merkle,
            V10: V10,
            V11: V11,
        };
    })
        .filter(function (item) { return item.definition; });
};
exports.chains = chains;
