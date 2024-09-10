"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chains = void 0;
var experimental = require("../addresses/experimental");
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
var chains = function () {
    var list = [experimental];
    /** Merging the linear and dynamic arrays with a spread operator will break mustache's template engine */
    return list.map(function (item) {
        var V22 = {
            flow: filter(item.flow, "V22"),
            available: false,
        };
        V22.available = available(V22);
        return {
            id: item.chainId,
            name: item.chain,
            start_block: item.startBlock_merkle,
            V22: V22,
        };
    });
};
exports.chains = chains;
