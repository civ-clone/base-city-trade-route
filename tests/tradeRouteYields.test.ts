import { Food, Trade, city } from './lib';
import City from '@civ-clone/core-city/City';
import TradeRoute from '@civ-clone/core-city/TradeRoute';
import TradeRouteRegistry from '@civ-clone/core-city/TradeRouteRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import { expect } from 'chai';
import tradeRouteYields from '../lib/tradeRouteYields';

describe('tradeRouteYields', (): void => {
  it('adds one yield per route, in order, tagged with the partner id, building on the running total', (): void => {
    const registry = new TradeRouteRegistry(),
      home = city('home'),
      a = city('a'),
      b = city('b'),
      calls: [string, number][] = [];

    registry.register(new TradeRoute(home, a), new TradeRoute(home, b));

    const yields = tradeRouteYields(
      home,
      [new Trade(6), new Trade(2), new Food(9)],
      Trade,
      (partner: City, total: number): number => {
        calls.push([partner.id(), total]);

        return Math.floor((total + 4) / 8);
      },
      registry
    );

    expect(calls).to.deep.equal([
      ['a', 8],
      ['b', 9],
    ]);
    expect(yields.map((y: Yield) => y instanceof Trade)).to.deep.equal([
      true,
      true,
    ]);
    expect(yields.map((y: Yield) => y.values())).to.deep.equal([
      [[1, 'a']],
      [[1, 'b']],
    ]);
  });

  it('adds nothing for a city with no routes', (): void => {
    expect(
      tradeRouteYields(
        city('home'),
        [new Trade(6)],
        Trade,
        () => 1,
        new TradeRouteRegistry()
      )
    ).to.deep.equal([]);
  });
});
