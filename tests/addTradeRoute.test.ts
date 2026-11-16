import { addTradeRoute, replaceWeakest } from '../lib/addTradeRoute';
import City from '@civ-clone/core-city/City';
import TradeRoute from '@civ-clone/core-city/TradeRoute';
import TradeRouteRegistry from '@civ-clone/core-city/TradeRouteRegistry';
import { city } from './lib';
import { expect } from 'chai';

const partners = (registry: TradeRouteRegistry, holder: City): string[] =>
  registry.getByCity(holder).map((route: TradeRoute) => route.to().id());

describe('addTradeRoute', (): void => {
  it('fills up to three slots by default, then drops new routes', (): void => {
    const registry = new TradeRouteRegistry(),
      home = city('home');

    ['a', 'b', 'c', 'd'].forEach((id) =>
      addTradeRoute(home, city(id), { tradeRouteRegistry: registry })
    );

    expect(partners(registry, home)).to.deep.equal(['a', 'b', 'c']);
  });

  it('keeps one route per partner, before looking at the slots', (): void => {
    const registry = new TradeRouteRegistry(),
      home = city('home'),
      a = city('a');

    expect(
      addTradeRoute(home, a, { tradeRouteRegistry: registry })
    ).to.be.an.instanceof(TradeRoute);
    expect(
      addTradeRoute(home, a, {
        tradeRouteRegistry: registry,
        replace: () => {
          throw new Error('not asked');
        },
      })
    ).to.equal(null);
    expect(partners(registry, home)).to.deep.equal(['a']);
  });

  it('lets each city of a pair hold its own route to the other', (): void => {
    const registry = new TradeRouteRegistry(),
      home = city('home'),
      a = city('a');

    addTradeRoute(home, a, { tradeRouteRegistry: registry });
    addTradeRoute(a, home, { tradeRouteRegistry: registry });

    expect(partners(registry, home)).to.deep.equal(['a']);
    expect(partners(registry, a)).to.deep.equal(['home']);
  });

  it('allows a second route to one partner when the rule set says so', (): void => {
    const registry = new TradeRouteRegistry(),
      home = city('home'),
      a = city('a');

    addTradeRoute(home, a, { tradeRouteRegistry: registry });
    addTradeRoute(home, a, {
      tradeRouteRegistry: registry,
      onePerPartner: false,
    });

    expect(partners(registry, home)).to.deep.equal(['a', 'a']);
  });

  it('takes the limit from the rule set', (): void => {
    const registry = new TradeRouteRegistry(),
      home = city('home');

    ['a', 'b', 'c'].forEach((id) =>
      addTradeRoute(home, city(id), {
        tradeRouteRegistry: registry,
        limit: (holder: City) => (holder === home ? 2 : 0),
      })
    );

    expect(partners(registry, home)).to.deep.equal(['a', 'b']);
  });

  it('points the replaced route at the new partner, keeping its place and reindexing it', (): void => {
    const registry = new TradeRouteRegistry(),
      home = city('home'),
      worths: { [id: string]: number } = { a: 3, b: 1, c: 1, d: 2 },
      worth = (holder: City, partner: City): number => worths[partner.id()];

    ['a', 'b', 'c'].forEach((id) =>
      addTradeRoute(home, city(id), { tradeRouteRegistry: registry })
    );

    const d = city('d'),
      replaced = addTradeRoute(home, d, {
        tradeRouteRegistry: registry,
        replace: replaceWeakest(worth),
      });

    expect(partners(registry, home)).to.deep.equal(['a', 'd', 'c']);
    expect(replaced!.to()).to.equal(d);
    expect(registry.getByPartner(d)).to.deep.equal([replaced]);
  });
});

describe('replaceWeakest', (): void => {
  const home = city('home'),
    routes = ['a', 'b', 'c'].map((id) => new TradeRoute(home, city(id))),
    worths: { [id: string]: number } = { a: 3, b: 1, c: 1, same: 1, more: 2 },
    worth = (holder: City, partner: City): number => worths[partner.id()];

  it('picks the first of the routes worth least when the new one is worth more', (): void => {
    expect(replaceWeakest(worth)(home, routes, city('more'))).to.equal(
      routes[1]
    );
  });

  it('keeps them all on a tie, unless asked to replace on one', (): void => {
    expect(replaceWeakest(worth)(home, routes, city('same'))).to.equal(null);
    expect(replaceWeakest(worth, true)(home, routes, city('same'))).to.equal(
      routes[1]
    );
  });

  it('works out the new route first, then the routes in order', (): void => {
    const asked: string[] = [];

    replaceWeakest((holder: City, partner: City): number => {
      asked.push(partner.id());

      return worths[partner.id()];
    })(home, routes, city('more'));

    expect(asked).to.deep.equal(['more', 'a', 'b', 'c']);
  });

  it('has nothing to replace in a city with no routes', (): void => {
    expect(replaceWeakest(worth)(home, [], city('more'))).to.equal(null);
  });
});
