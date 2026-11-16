import {
  TradeRouteRegistry,
  instance as tradeRouteRegistryInstance,
} from '@civ-clone/core-city/TradeRouteRegistry';
import City from '@civ-clone/core-city/City';
import TradeRoute from '@civ-clone/core-city/TradeRoute';
import { defaultTradeRouteLimit } from './tradeRouteLimit';

/** What a route from `holder` to `partner` is worth, when choosing which route a full city keeps. */
export type TradeRouteWorth = (holder: City, partner: City) => number;

/**
 * Which of a full city's `routes` a new route to `partner` replaces, or `null` to keep them all and drop the new one.
 */
export type TradeRouteReplacement = (
  holder: City,
  routes: TradeRoute[],
  partner: City
) => TradeRoute | null;

/**
 * Replace the route worth least, the first of them on a tie, when the new route is worth more: Civilization's choice
 * (v474.05, civd `CAPTURE.C` `rpath()`). With `orEqual`, a route worth the same is replaced too.
 */
export const replaceWeakest =
  (worth: TradeRouteWorth, orEqual: boolean = false): TradeRouteReplacement =>
  (holder: City, routes: TradeRoute[], partner: City): TradeRoute | null => {
    if (routes.length === 0) {
      return null;
    }

    const newWorth = worth(holder, partner),
      [lowest, lowestWorth] = routes
        .map((route: TradeRoute): [TradeRoute, number] => [
          route,
          worth(holder, route.to()),
        ])
        .reduce((lowest, candidate) =>
          candidate[1] < lowest[1] ? candidate : lowest
        );

    return lowestWorth < newWorth || (orEqual && lowestWorth === newWorth)
      ? lowest
      : null;
  };

export type AddTradeRouteOptions = {
  /** How many routes `holder` can hold. Default: 3, Civilization's. `tradeRouteLimit` reads the rules. */
  limit?: (holder: City) => number;
  /**
   * Whether `holder` keeps at most one route to each partner, so a route to a partner it already trades with is
   * dropped. Default `true`. A partner's own route back is a separate route, held by the partner, so the two cities can
   * hold one each.
   */
  onePerPartner?: boolean;
  /** Which route a full city replaces. Default: none, so a full city drops the new route. */
  replace?: TradeRouteReplacement;
  tradeRouteRegistry?: TradeRouteRegistry;
};

/**
 * Gives `holder` a route to `partner`, if the rule set's options allow it: a route to a partner it already trades with
 * is dropped (with `onePerPartner`), an empty slot is filled, or, in a full city, the route `replace` picks is pointed at
 * `partner` instead, keeping its place among the city's routes. Returns the route made or changed, or `null`.
 */
export const addTradeRoute = (
  holder: City,
  partner: City,
  {
    limit = (): number => defaultTradeRouteLimit,
    onePerPartner = true,
    replace = (): TradeRoute | null => null,
    tradeRouteRegistry = tradeRouteRegistryInstance,
  }: AddTradeRouteOptions = {}
): TradeRoute | null => {
  const routes = tradeRouteRegistry.getByCity(holder);

  if (
    onePerPartner &&
    routes.some((route: TradeRoute): boolean => route.to() === partner)
  ) {
    return null;
  }

  if (routes.length < limit(holder)) {
    const route = new TradeRoute(holder, partner);

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

export default addTradeRoute;
