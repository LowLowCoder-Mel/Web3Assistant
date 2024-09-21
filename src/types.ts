import { BigNumberish } from 'ethers';
1;

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

export enum ChainId {
  Ethereum = 1,
  BSC = 56,
  OKC = 66,
  Polygon = 137,
  Avax = 43114,
  Tron = 100,
  Arbitrum = 42161,
  Fantom = 250,
  Optimism = 10,
}

export type QuoteParam = {
  blockNumber?: number;
  inputAmount: BigNumberish;
  inputToken: string;
  outputToken: string;
  protocol: Protocol;
  poolAddress?: string;
  chainId: ChainId;
};

export type SwapParam = {
  calldata: string;
  inputToken: string;
  inputAmount: string;
  outputToken: string;
  blockNumber?: number;
  ethValue?: string;
  exchangeAddress?: string;
  bridge?: number; // swap and bridge to another chain
  tokenApproveAddress?: string;
  walletAddress?: string;
  chainId: ChainId;
};

export type InvestParam = {
  calldata: string;
  inputToken: any;
  inputAmount: any;
  outputToken: any;
  blockNumber?: number;
  ethValue?: string;
  entranceAddress?: string;
  bridge?: number; 
  tokenApproveAddress?: string;
  walletAddress?: string;
  chainId: ChainId;
  rpcUrl?: string;
  gaugeAddress?: string;
  adapterAddress?: string;
  otherInputTokens?: string;
  otherInputAmounts?: string;
  otherRichAddresses?: string;
  nftTokenIds?: string;
  managerAddress?: string;
};

export type QuoteResponse = {
  inputAmount: string;
  outputAmount: string;
  inputToken: string;
  outputToken: string;
  blockNumber: number;
  protocolName: string;
};

export type SwapResponse = {
  outputAmount: string;
  gasUsed: string;
  gasLimit: string;
  blockNumber: number;
};

export type DecodeRefundResponse = {
  wdmsg: string;
  sigs: string[];
  signers: string[];
  powers: string[];
};

export type InvestResponse = {
  tokenIn: string,
  tokenInAmoutsBefore: string;
  tokenInAmountsAfter: string;
  tokenInAmountOfUserSpend:string;
  tokenOut: string;
  tokenOutAmountsBefore: string;
  tokenOutAmountsAfter: string;
  outputAmountOfUserGet: string;
  gasUsed: string;
  gasLimit: string;
  blockNumber: number;
  feeUsed:string;
};

