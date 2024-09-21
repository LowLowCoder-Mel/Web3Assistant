# Web3 Assistant

## Installation

```bash
yarn install && yarn compile
```

## Demo

```bash
# config env
cp .env.example .env # change env for yourself

# run server
yarn start

# use client to test server
yarn test_quote
yarn test_swap
```

## Devlopment

add new quote handlers for more DEXes in `src/quoteHandler`

Support Protocol

```
export enum Protocol {
  UniswapV2,
  UniswapV3,
  Curve,
  CurveV2,
  Balancer,
  BalancerV2,
  Bancor,
  Kyber,
  KSwap,
  SushiSwap,
  DefiSwap,
  Convergence,
  LuaSwap,
  ShibaSwap,
  Dodo,
  DodoV2,
  Synapse,
  
  // BSC
  MDEX,
  BiSwap,
  ApeSwap,
  BabySwap,
  KnightSwap,
  DefiBox,
  BakerySwap,
  AutoShark,
  BenSwap,
  BurgeSwap,
  JetSwap,
  PancakeSwap,

  // OKC
  AISwap,
  CherrySwap,
  JSwap,

  // Ploygon
  QuickSwap,
  Dfyn,
  // ApeSwap

  // Others
  Mstable,
  BancorV3,
  Saddle,
  RadioShack,
  Smoothy,
  Shell,
  Fraxswap
}
```
