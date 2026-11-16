import tradeRouteLimit, {
  defaultTradeRouteLimit,
} from '../lib/tradeRouteLimit';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TradeRouteLimit from '../Rules/TradeRouteLimit';
import { city } from './lib';
import { expect } from 'chai';

describe('tradeRouteLimit', (): void => {
  it('is the fallback with no rules', (): void => {
    const ruleRegistry = new RuleRegistry();

    expect(defaultTradeRouteLimit).to.equal(3);
    expect(tradeRouteLimit(city('a'), ruleRegistry)).to.equal(3);
    expect(tradeRouteLimit(city('a'), ruleRegistry, 2)).to.equal(2);
  });

  it('is the highest answer of the rules', (): void => {
    const ruleRegistry = new RuleRegistry(),
      a = city('a');

    ruleRegistry.register(
      new TradeRouteLimit(new Effect((): number => 3)),
      new TradeRouteLimit(
        new Effect((target: City): number => (target === a ? 4 : 1))
      )
    );

    expect(tradeRouteLimit(a, ruleRegistry)).to.equal(4);
    expect(tradeRouteLimit(city('b'), ruleRegistry)).to.equal(3);
  });
});
