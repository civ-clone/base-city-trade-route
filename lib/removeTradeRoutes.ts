import {
  TradeRouteRegistry,
  instance as tradeRouteRegistryInstance,
} from '@civ-clone/core-city/TradeRouteRegistry';
import City from '@civ-clone/core-city/City';

/** Clears `city` from every route: the ones it holds and the ones other cities hold to it. For a destroyed city. */
export const removeTradeRoutes = (
  city: City,
  tradeRouteRegistry: TradeRouteRegistry = tradeRouteRegistryInstance
): void =>
  tradeRouteRegistry.unregister(
    ...tradeRouteRegistry.getByCity(city),
    ...tradeRouteRegistry.getByPartner(city)
  );

export default removeTradeRoutes;
