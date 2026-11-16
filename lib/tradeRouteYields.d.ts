import { TradeRouteRegistry } from '@civ-clone/core-city/TradeRouteRegistry';
import City from '@civ-clone/core-city/City';
import TradeRoute from '@civ-clone/core-city/TradeRoute';
import Yield from '@civ-clone/core-yield/Yield';
/**
 * What one route adds: `total` is the city's `TradeYield` so far, including what the routes before this one added.
 */
export type TradeRouteValue = (
  partner: City,
  total: number,
  route: TradeRoute
) => number;
/**
 * The yields `city`'s routes add, one `TradeYield` per route in the order the city holds them, each worth what `value`
 * says. The running total starts at the `TradeYield` in `yields` and grows by each route's value, so each route can
 * build on the last.
 *
 * Each yield's provider is its partner's id: the renderer finds a route's trade by that id. A city holding two routes to
 * one partner would have their values summed.
 */
export declare const tradeRouteYields: (
  city: City,
  yields: Yield[],
  TradeYield: typeof Yield,
  value: TradeRouteValue,
  tradeRouteRegistry?: TradeRouteRegistry
) => Yield[];
export default tradeRouteYields;
