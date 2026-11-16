import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import TradeRouteLimit from '../Rules/TradeRouteLimit';

/** The number of routes a city holds in Civilization (v474.05 `City.TradeCityIDs[3]`). */
export const defaultTradeRouteLimit = 3;

/**
 * How many routes `city` can hold: the highest answer of the `TradeRouteLimit` rules, or `fallback` when none is
 * registered.
 */
export const tradeRouteLimit = (
  city: City,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  fallback: number = defaultTradeRouteLimit
): number => {
  const limits = ruleRegistry.process(TradeRouteLimit, city);

  return limits.length === 0 ? fallback : Math.max(...limits);
};

export default tradeRouteLimit;
