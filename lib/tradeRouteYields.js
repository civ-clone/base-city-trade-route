"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeRouteYields = void 0;
const TradeRouteRegistry_1 = require("@civ-clone/core-city/TradeRouteRegistry");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
/**
 * The yields `city`'s routes add, one `TradeYield` per route in the order the city holds them, each worth what `value`
 * says. The running total starts at the `TradeYield` in `yields` and grows by each route's value, so each route can
 * build on the last.
 *
 * Each yield's provider is its partner's id: the renderer finds a route's trade by that id. A city holding two routes to
 * one partner would have their values summed.
 */
const tradeRouteYields = (city, yields, TradeYield, value, tradeRouteRegistry = TradeRouteRegistry_1.instance) => {
    let total = (0, reduceYields_1.reduceYield)(yields, TradeYield);
    return tradeRouteRegistry.getByCity(city).map((route) => {
        const partner = route.to(), routeValue = value(partner, total, route);
        total += routeValue;
        return new TradeYield(routeValue, partner.id());
    });
};
exports.tradeRouteYields = tradeRouteYields;
exports.default = exports.tradeRouteYields;
//# sourceMappingURL=tradeRouteYields.js.map