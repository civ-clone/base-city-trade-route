import City from '@civ-clone/core-city/City';
import Yield from '@civ-clone/core-yield/Yield';
/**
 * Whether a `baseTrade` is being worked out. A city's trade route yield reads its partners' `baseTrade`, which works out
 * their yields, so a route rule checks this and leaves its own routes out. Two cities routed to each other would
 * otherwise recurse.
 *
 * The flag is this module's own, so every caller must reach it through the same copy of this package.
 */
export declare const computingBaseTrade: () => boolean;
/**
 * A city's trade of `TradeYield` after corruption (a negative yield of the same type), leaving out what its trade routes
 * add, and never below 0. It works the value out now, with `computingBaseTrade()` true while it does.
 */
export declare const baseTrade: (
  city: City,
  TradeYield: typeof Yield
) => number;
export default baseTrade;
