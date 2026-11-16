import City from '@civ-clone/core-city/City';
import Yield from '@civ-clone/core-yield/Yield';

export class Trade extends Yield {}
export class Corruption extends Trade {}
export class Food extends Yield {}

/** A stand-in city: an id and the yields it works out. */
export const city = (id: string, yields: () => Yield[] = () => []): City =>
  ({
    id: () => id,
    yields,
  } as unknown as City);
