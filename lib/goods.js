"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodsFor = void 0;
/**
 * Which of `goods` a unit carries, picked by the counter at the end of its id (`Caravan-1f`, read in base 36). An id with
 * no counter carries the first.
 */
const goodsFor = (unit, goods) => {
    var _a;
    const counter = parseInt((_a = unit.id().split('-').pop()) !== null && _a !== void 0 ? _a : '', 36);
    return goods[Number.isNaN(counter) ? 0 : counter % goods.length];
};
exports.goodsFor = goodsFor;
exports.default = exports.goodsFor;
//# sourceMappingURL=goods.js.map