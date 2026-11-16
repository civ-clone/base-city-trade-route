/** Anything with an id, such as a unit. */
export type Identified = {
  id(): string;
};
/**
 * Which of `goods` a unit carries, picked by the counter at the end of its id (`Caravan-1f`, read in base 36). An id with
 * no counter carries the first.
 */
export declare const goodsFor: (unit: Identified, goods: string[]) => string;
export default goodsFor;
