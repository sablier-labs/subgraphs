"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chains = void 0;
var arbitrum = require("../addresses/arbitrum");
var avalanche = require("../addresses/avalanche");
var base = require("../addresses/base");
var baseSepolia = require("../addresses/base-sepolia");
var blast = require("../addresses/blast");
var bsc = require("../addresses/bsc");
var gnosis = require("../addresses/gnosis");
var linea = require("../addresses/linea");
var mainnet = require("../addresses/mainnet");
var mode = require("../addresses/mode");
var morph = require("../addresses/morph");
var optimism = require("../addresses/optimism");
var polygon = require("../addresses/polygon");
var scroll = require("../addresses/scroll");
// import * as sepolia from "../addresses/sepolia";
var superseed = require("../addresses/superseed");
var tangle = require("../addresses/tangle");
var zksync = require("../addresses/zksync");
var definitions_1 = require("./definitions");
var available = function (v) {
    return (v.linear.length + v.dynamic.length + v.tranched.length + v.merged.length > 0);
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
        [blast, definitions_1.default.blast],
        [bsc, definitions_1.default.bsc],
        [gnosis, definitions_1.default.gnosis],
        [linea, definitions_1.default.linea],
        [mainnet, definitions_1.default.mainnet],
        [mode, definitions_1.default.mode],
        [morph, definitions_1.default.morph],
        [optimism, definitions_1.default.optimism],
        [polygon, definitions_1.default.polygon],
        [scroll, definitions_1.default.scroll],
        // [true ? experimental : sepolia, definitions.sepolia],
        [superseed, definitions_1.default.superseed],
        [tangle, definitions_1.default.tangle],
        [zksync, definitions_1.default.zksync],
    ];
    /** Merging the arrays with a spread operator will break mustache's template engine */
    return list
        .map(function (_a) {
        var _b;
        var item = _a[0], definition = _a[1];
        var V20 = {
            dynamic: filter(item.dynamic, "V20"),
            linear: filter(item.linear, "V20"),
            tranched: [],
            merged: [],
            available: false,
        };
        V20.available = available(V20);
        var V21 = {
            dynamic: filter(item.dynamic, "V21"),
            linear: filter(item.linear, "V21"),
            tranched: [],
            merged: [],
            available: false,
        };
        V21.available = available(V21);
        var V22 = {
            dynamic: filter(item.dynamic, "V22"),
            linear: filter(item.linear, "V22"),
            tranched: filter(item.tranched || [], "V22"),
            merged: [],
            available: false,
        };
        V22.available = available(V22);
        var V23 = {
            dynamic: [],
            linear: [],
            tranched: [],
            merged: filter(item.merged, "V23"),
            available: false,
        };
        V23.available = available(V23);
        return {
            definition: definition,
            id: item.chainId,
            name: item.chain,
            start_block: item.startBlock_lockup,
            hypersync: "hypersync" in item ? item.hypersync : undefined,
            rpcsync: "rpcsync" in item ? item.rpcsync : undefined,
            registry: ((_b = item.registry) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "",
            V20: V20,
            V21: V21,
            V22: V22,
            V23: V23,
        };
    })
        .filter(function (item) { return item.definition; });
};
exports.chains = chains;
