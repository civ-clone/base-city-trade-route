import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
/** The number of routes a city holds in Civilization (v474.05 `City.TradeCityIDs[3]`). */
export declare const defaultTradeRouteLimit = 3;
/**
 * How many routes `city` can hold: the highest answer of the `TradeRouteLimit` rules, or `fallback` when none is
 * registered.
 */
export declare const tradeRouteLimit: (
  city: City,
  ruleRegistry?: RuleRegistry,
  fallback?: number
) => number;
export default tradeRouteLimit;
