"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTrade = exports.computingBaseTrade = void 0;
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
let computing = false;
/**
 * Whether a `baseTrade` is being worked out. A city's trade route yield reads its partners' `baseTrade`, which works out
 * their yields, so a route rule checks this and leaves its own routes out. Two cities routed to each other would
 * otherwise recurse.
 *
 * The flag is this module's own, so every caller must reach it through the same copy of this package.
 */
const computingBaseTrade = () => computing;
exports.computingBaseTrade = computingBaseTrade;
/**
 * A city's trade of `TradeYield` after corruption (a negative yield of the same type), leaving out what its trade routes
 * add, and never below 0. It works the value out now, with `computingBaseTrade()` true while it does.
 */
const baseTrade = (city, TradeYield) => {
    const wasComputing = computing;
    computing = true;
    try {
        return Math.max((0, reduceYields_1.reduceYield)(city.yields(), TradeYield), 0);
    }
    finally {
        computing = wasComputing;
    }
};
exports.baseTrade = baseTrade;
exports.default = exports.baseTrade;
//# sourceMappingURL=baseTrade.js.map