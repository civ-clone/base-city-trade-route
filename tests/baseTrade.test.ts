import { Corruption, Food, Trade, city } from './lib';
import { baseTrade, computingBaseTrade } from '../lib/baseTrade';
import { expect } from 'chai';

describe('baseTrade', (): void => {
  it('is the trade after corruption, ignoring other yields', (): void => {
    expect(
      baseTrade(
        city('a', () => [new Trade(7), new Corruption(-2), new Food(5)]),
        Trade
      )
    ).to.equal(5);
  });

  it('is never below 0', (): void => {
    expect(
      baseTrade(
        city('a', () => [new Trade(1), new Corruption(-3)]),
        Trade
      )
    ).to.equal(0);
  });

  it('says it is computing while it works the yields out, and restores the flag', (): void => {
    const seen: boolean[] = [];

    expect(computingBaseTrade()).to.equal(false);

    baseTrade(
      city('a', () => {
        seen.push(computingBaseTrade());

        baseTrade(
          city('b', () => {
            seen.push(computingBaseTrade());

            return [];
          }),
          Trade
        );

        seen.push(computingBaseTrade());

        return [];
      }),
      Trade
    );

    expect(seen).to.deep.equal([true, true, true]);
    expect(computingBaseTrade()).to.equal(false);
  });

  it('restores the flag when the yields throw', (): void => {
    expect(() =>
      baseTrade(
        city('a', () => {
          throw new Error('no yields');
        }),
        Trade
      )
    ).to.throw('no yields');
    expect(computingBaseTrade()).to.equal(false);
  });
});
