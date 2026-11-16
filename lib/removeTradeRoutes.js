"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTradeRoutes = void 0;
const TradeRouteRegistry_1 = require("@civ-clone/core-city/TradeRouteRegistry");
/** Clears `city` from every route: the ones it holds and the ones other cities hold to it. For a destroyed city. */
const removeTradeRoutes = (city, tradeRouteRegistry = TradeRouteRegistry_1.instance) => tradeRouteRegistry.unregister(...tradeRouteRegistry.getByCity(city), ...tradeRouteRegistry.getByPartner(city));
exports.removeTradeRoutes = removeTradeRoutes;
exports.default = exports.removeTradeRoutes;
//# sourceMappingURL=removeTradeRoutes.js.map