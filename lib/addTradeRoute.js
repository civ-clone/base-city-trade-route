"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTradeRoute = exports.replaceWeakest = void 0;
const TradeRouteRegistry_1 = require("@civ-clone/core-city/TradeRouteRegistry");
const TradeRoute_1 = require("@civ-clone/core-city/TradeRoute");
const tradeRouteLimit_1 = require("./tradeRouteLimit");
/**
 * Replace the route worth least, the first of them on a tie, when the new route is worth more: Civilization's choice
 * (v474.05, civd `CAPTURE.C` `rpath()`). With `orEqual`, a route worth the same is replaced too.
 */
const replaceWeakest = (worth, orEqual = false) => (holder, routes, partner) => {
    if (routes.length === 0) {
        return null;
    }
    const newWorth = worth(holder, partner), [lowest, lowestWorth] = routes
        .map((route) => [
        route,
        worth(holder, route.to()),
    ])
        .reduce((lowest, candidate) => candidate[1] < lowest[1] ? candidate : lowest);
    return lowestWorth < newWorth || (orEqual && lowestWorth === newWorth)
        ? lowest
        : null;
};
exports.replaceWeakest = replaceWeakest;
/**
 * Gives `holder` a route to `partner`, if the rule set's options allow it: a route to a partner it already trades with
 * is dropped (with `onePerPartner`), an empty slot is filled, or, in a full city, the route `replace` picks is pointed at
 * `partner` instead, keeping its place among the city's routes. Returns the route made or changed, or `null`.
 */
const addTradeRoute = (holder, partner, { limit = () => tradeRouteLimit_1.defaultTradeRouteLimit, onePerPartner = true, replace = () => null, tradeRouteRegistry = TradeRouteRegistry_1.instance, } = {}) => {
    const routes = tradeRouteRegistry.getByCity(holder);
    if (onePerPartner &&
        routes.some((route) => route.to() === partner)) {
        return null;
    }
    if (routes.length < limit(holder)) {
        const route = new TradeRoute_1.default(holder, partner);
        tradeRouteRegistry.register(route);
        return route;
    }
    const replaced = replace(holder, routes, partner);
    if (replaced === null) {
        return null;
    }
    replaced.setTo(partner);
    tradeRouteRegistry.reindex(replaced);
    return replaced;
};
exports.addTradeRoute = addTradeRoute;
exports.default = exports.addTradeRoute;
//# sourceMappingURL=addTradeRoute.js.map