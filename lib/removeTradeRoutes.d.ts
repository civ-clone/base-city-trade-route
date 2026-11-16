import { TradeRouteRegistry } from '@civ-clone/core-city/TradeRouteRegistry';
import City from '@civ-clone/core-city/City';
/** Clears `city` from every route: the ones it holds and the ones other cities hold to it. For a destroyed city. */
export declare const removeTradeRoutes: (
  city: City,
  tradeRouteRegistry?: TradeRouteRegistry
) => void;
export default removeTradeRoutes;
