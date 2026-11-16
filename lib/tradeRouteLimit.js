"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeRouteLimit = exports.defaultTradeRouteLimit = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TradeRouteLimit_1 = require("../Rules/TradeRouteLimit");
/** The number of routes a city holds in Civilization (v474.05 `City.TradeCityIDs[3]`). */
exports.defaultTradeRouteLimit = 3;
/**
 * How many routes `city` can hold: the highest answer of the `TradeRouteLimit` rules, or `fallback` when none is
 * registered.
 */
const tradeRouteLimit = (city, ruleRegistry = RuleRegistry_1.instance, fallback = exports.defaultTradeRouteLimit) => {
    const limits = ruleRegistry.process(TradeRouteLimit_1.default, city);
    return limits.length === 0 ? fallback : Math.max(...limits);
};
exports.tradeRouteLimit = tradeRouteLimit;
exports.default = exports.tradeRouteLimit;
//# sourceMappingURL=tradeRouteLimit.js.map