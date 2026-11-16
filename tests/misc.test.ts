import { city } from './lib';
import TradeRoute from '@civ-clone/core-city/TradeRoute';
import TradeRouteRegistry from '@civ-clone/core-city/TradeRouteRegistry';
import { expect } from 'chai';
import goodsFor from '../lib/goods';
import removeTradeRoutes from '../lib/removeTradeRoutes';

describe('goodsFor', (): void => {
  const goods = ['Silk', 'Silver', 'Wine'];

  it('picks by the base-36 counter at the end of the id', (): void => {
    expect(goodsFor({ id: () => 'Caravan-1f' }, goods)).to.equal('Silk'); // 51 % 3
    expect(goodsFor({ id: () => 'Caravan-a' }, goods)).to.equal('Silver'); // 10 % 3
  });

  it('picks the first for an id with no counter', (): void => {
    expect(goodsFor({ id: () => 'Caravan-' }, goods)).to.equal('Silk');
  });
});

describe('removeTradeRoutes', (): void => {
  it('clears the routes a city holds and the routes held to it', (): void => {
    const registry = new TradeRouteRegistry(),
      a = city('a'),
      b = city('b'),
      c = city('c'),
      kept = new TradeRoute(b, c);

    registry.register(new TradeRoute(a, b), new TradeRoute(c, a), kept);

    removeTradeRoutes(a, registry);

    expect(registry.entries()).to.deep.equal([kept]);
  });
});
