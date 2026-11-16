# base-city-trade-route

Trade route mechanics for a rule set to use: a city's base trade, the yields its routes add, how many routes a city
holds and which one a new route replaces, goods names, and clearing a destroyed city's routes.

This is a library: it registers nothing. A rule set registers its own rules around these helpers. core-city's
`TradeRoute` is one-way (only the city holding it gains), so a route "both ways" is two routes, one held by each city.

## `lib/baseTrade`

- `baseTrade(city, TradeYield)`: the city's `TradeYield` after corruption, leaving out what its routes add, and never
  below 0.
- `computingBaseTrade()`: whether a `baseTrade` is being worked out. A route income rule leaves its routes out while it
  is, so two cities routed to each other don't recurse. The flag is this module's own: every caller must reach it
  through one copy of this package.

## `lib/tradeRouteYields`

`tradeRouteYields(city, yields, TradeYield, value, tradeRouteRegistry?)`: one `TradeYield` per route the city holds, in
order, each worth `value(partner, total, route)`, where `total` starts at the `TradeYield` in `yields` and grows by each
route's value. Each yield's provider is the partner's id, which is how the renderer finds a route's trade.

## `lib/addTradeRoute`

`addTradeRoute(holder, partner, options)` gives `holder` a route to `partner`, and returns the route made or changed, or
`null`. Options, each defaulting to Civilization's behaviour:

- `limit(holder)`: how many routes the city can hold (default 3). `lib/tradeRouteLimit`'s `tradeRouteLimit(city,
  ruleRegistry, fallback = 3)` answers it from the `TradeRouteLimit` rules: the highest answer, or `fallback` with none.
- `onePerPartner` (default `true`): a city keeps at most one route to each partner. The partner's own route back is
  separate, so each city of a pair can hold one.
- `replace(holder, routes, partner)`: which route a full city points at the new partner instead, or `null` to drop the
  new route (the default). `replaceWeakest(worth, orEqual = false)` picks the route worth least, the first on a tie,
  when the new one is worth more (or, with `orEqual`, as much).
- `tradeRouteRegistry`.

## `Rules/TradeRouteLimit`

`TradeRouteLimit(city) → number`: how many routes a city can hold.

## `lib/removeTradeRoutes`

`removeTradeRoutes(city, tradeRouteRegistry?)` clears a city from every route, the ones it holds and the ones held to
it. For a rule set's `Destroyed` rule.

## `lib/goods`

`goodsFor(unit, goods)`: which of `goods` a unit carries, picked by the base-36 counter at the end of its id.

## Who uses it

civ1-unit (base trade, the route slot rule, goods) and civ1-city (route income, cleanup on destruction) keep their rule
ids and register the same rules as before, built on these helpers.
