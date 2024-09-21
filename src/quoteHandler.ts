import { ethers, BigNumberish } from 'ethers';
import {
  UniswapV2Router02__factory,
  DMMRouter02__factory,
  BancorNetwork__factory,
  QuoterV2__factory,
  UniswapV3Pool__factory,
  Vault__factory,
  BPool__factory,
  SwapFlashLoan__factory,
  DODO__factory,
  DODOV2__factory,
  DODOV2_2__factory,
  DODOSellHelper__factory,
  Mstable__factory,
  BancorV3__factory,
  Saddle__factory,
  Smoothy__factory,
  Shell__factory,
} from './typechain';
import { logger } from './logging';
import {
  uniswapv2LikeRouterMap,
  KYBER_ROUTER02,
  BANCOR_ADDRESS,
  UNISWAPV3_QUOTER,
} from './constants';
import { quoteV2CurveHandler } from './markets/quotev2_curve_handler';
import { QuoteParam, Protocol, QuoteResponse, ChainId } from './types';
import { tokensByChain } from '../src/tokens';

const nopoolAddrDEX = [
  Protocol.UniswapV2,
  Protocol.Bancor,
  // all protocols of uniswap like
  Protocol.KSwap,
  Protocol.SushiSwap,
  Protocol.DefiSwap,
  Protocol.Convergence,
  Protocol.LuaSwap,
  Protocol.ShibaSwap,
  Protocol.Dodo,
  Protocol.DodoV2,

  // BSC
  Protocol.MDEX,
  Protocol.BiSwap,
  Protocol.ApeSwap,
  Protocol.BabySwap,
  Protocol.KnightSwap,
  Protocol.DefiBox,
  Protocol.BakerySwap,
  Protocol.AutoShark,
  Protocol.BenSwap,
  Protocol.BurgeSwap,
  Protocol.JetSwap,
  Protocol.PancakeSwap,

  // OKC
  Protocol.AISwap,
  Protocol.CherrySwap,
  Protocol.JSwap,

  // Polygon
  Protocol.QuickSwap,
  Protocol.Dfyn,

  // Others
  Protocol.Mstable,
  Protocol.BancorV3,
  Protocol.Saddle,
  Protocol.RadioShack,
  Protocol.Smoothy,
  Protocol.Shell,
  Protocol.Fraxswap
];

export const quoteHandler = async (
  quoteParam: QuoteParam,
  provider: ethers.providers.BaseProvider
): Promise<QuoteResponse> => {
  if (!quoteParam.poolAddress && !nopoolAddrDEX.includes(quoteParam.protocol)) {
    const errorStr = `poolAddress is needed for ${quoteParam.protocol}`;
    throw new Error(errorStr);
  }
  const poolAddress = quoteParam.poolAddress as string;
  // make sure all func called at the same blocknumber
  if (!quoteParam.blockNumber) {
    quoteParam.blockNumber = await provider.getBlockNumber();
  }
  const callOverrides = { blockTag: quoteParam.blockNumber };
  let outputAmount;

  switch (quoteParam.protocol) {
    case Protocol.KSwap:
    case Protocol.SushiSwap:
    case Protocol.DefiSwap:
    case Protocol.Convergence:
    case Protocol.LuaSwap:
    case Protocol.ShibaSwap:
    case Protocol.MDEX:
    case Protocol.BiSwap:
    case Protocol.ApeSwap:
    case Protocol.BabySwap:
    case Protocol.KnightSwap:
    case Protocol.DefiBox:
    case Protocol.BakerySwap:
    case Protocol.AutoShark:
    case Protocol.BenSwap:
    case Protocol.BurgeSwap:
    case Protocol.JetSwap:
    case Protocol.PancakeSwap:
    case Protocol.AISwap:
    case Protocol.CherrySwap:
    case Protocol.JSwap:
    case Protocol.QuickSwap:
    case Protocol.Dfyn:
    case Protocol.RadioShack:
    case Protocol.Fraxswap:
    case Protocol.UniswapV2: {
      const routesChain = uniswapv2LikeRouterMap[quoteParam.chainId!];
      const routerAddr = routesChain
        ? routesChain[quoteParam.protocol]
        : undefined;
      if (!routerAddr) {
        throw new Error(
          `cannot find protocol: ${quoteParam.protocol} in chain: ${quoteParam.chainId}`
        );
      }
      const uniswapv2_router = UniswapV2Router02__factory.connect(
        routerAddr,
        provider
      );
      const path = [quoteParam.inputToken, quoteParam.outputToken];
      const outputAmounts = await uniswapv2_router.callStatic.getAmountsOut(
        quoteParam.inputAmount,
        path,
        callOverrides
      );
      outputAmount = outputAmounts[outputAmounts.length - 1];
      break;
    }
    case Protocol.CurveV2:
    case Protocol.Curve: {
      // due to some metapool has no base pool api exposed,
      // we cannot get underlying coins from pool contract itself.
      // the only way to get the addition information is to query
      // for registry or factory
      outputAmount = await quoteV2CurveHandler(quoteParam, provider);
      // const outputAmount = await quoteCurveHandler(quoteParam, provider);
      break;
    }
    case Protocol.Synapse: {
      const swapper = SwapFlashLoan__factory.connect(poolAddress, provider);
      const tokenIndexFrom = await swapper.getTokenIndex(quoteParam.inputToken);
      const tokenIndexTo = await swapper.getTokenIndex(quoteParam.outputToken);
      outputAmount = await swapper.calculateSwap(
        tokenIndexFrom,
        tokenIndexTo,
        quoteParam.inputAmount,
        callOverrides
      );
      break;
    }
    case Protocol.Balancer: {
      const bpoolContract = BPool__factory.connect(poolAddress, provider);
      const poolState = await Promise.all([
        bpoolContract.getBalance(quoteParam.inputToken, callOverrides),
        bpoolContract.getDenormalizedWeight(
          quoteParam.inputToken,
          callOverrides
        ),
        bpoolContract.getBalance(quoteParam.outputToken, callOverrides),
        bpoolContract.getDenormalizedWeight(
          quoteParam.outputToken,
          callOverrides
        ),
        bpoolContract.getSwapFee(callOverrides),
      ]);
      const takerTokenBalance = poolState[0];
      const takerTokenWeight = poolState[1];
      const makerTokenBalance = poolState[2];
      const makerTokenWeight = poolState[3];
      const swapFee = poolState[4];
      outputAmount = await bpoolContract.calcOutGivenIn(
        takerTokenBalance,
        takerTokenWeight,
        makerTokenBalance,
        makerTokenWeight,
        quoteParam.inputAmount,
        swapFee,
        callOverrides
      );
      break;
    }

    case Protocol.BalancerV2: {
      const vault = '0xba12222222228d8ba445958a75a0704d566bf2c8';
      const iface = new ethers.utils.Interface([
        'function getPoolId()view returns (bytes32)',
      ]);
      const poolContract = new ethers.Contract(poolAddress, iface, provider);
      const poolId = await poolContract.getPoolId();
      const vaultContract = Vault__factory.connect(vault, provider);
      const kind = 0;
      const swaps = [
        {
          poolId,
          assetInIndex: 0,
          assetOutIndex: 1,
          amount: quoteParam.inputAmount,
          userData: '0x',
        },
      ];
      const assets = [quoteParam.inputToken, quoteParam.outputToken];
      const funds = {
        sender: ethers.constants.AddressZero,
        fromInternalBalance: false,
        recipient: ethers.constants.AddressZero,
        toInternalBalance: false,
      };
      const outputAmounts = await vaultContract.callStatic.queryBatchSwap(
        kind,
        swaps,
        assets,
        funds,
        callOverrides
      );
      outputAmount = outputAmounts[1].mul(-1);
      break;
    }

    case Protocol.UniswapV3: {
      const quoterv2 = QuoterV2__factory.connect(UNISWAPV3_QUOTER, provider);
      const poolContract = await UniswapV3Pool__factory.connect(
        poolAddress,
        provider
      );
      const fee = await poolContract.fee();
      const params = {
        tokenIn: quoteParam.inputToken,
        tokenOut: quoteParam.outputToken,
        fee,
        amountIn: quoteParam.inputAmount,
        sqrtPriceLimitX96: 0,
      };
      const { amountOut } = await quoterv2.callStatic.quoteExactInputSingle(
        params,
        callOverrides
      );
      outputAmount = amountOut;
      break;
    }
    case Protocol.Bancor: {
      const bancorNetworkContract = BancorNetwork__factory.connect(
        BANCOR_ADDRESS,
        provider
      );
      const path = await bancorNetworkContract.callStatic.conversionPath(
        quoteParam.inputToken,
        quoteParam.outputToken,
        callOverrides
      );
      outputAmount = await bancorNetworkContract.callStatic.rateByPath(
        path,
        quoteParam.inputAmount,
        callOverrides
      );
      break;
    }
    case Protocol.Kyber: {
      const kyber_router02 = DMMRouter02__factory.connect(
        KYBER_ROUTER02,
        provider
      );
      const allPools = [poolAddress];
      const outputAmounts = await kyber_router02.callStatic.getAmountsOut(
        quoteParam.inputAmount,
        allPools,
        [quoteParam.inputToken, quoteParam.outputToken],
        callOverrides
      );
      outputAmount = outputAmounts[outputAmounts.length - 1];
      break;
    }
    case Protocol.Dodo: {
      const dodo = DODO__factory.connect(poolAddress, provider);
      const baseToken = await dodo._BASE_TOKEN_();
      const quoteToken = await dodo._QUOTE_TOKEN_();
      const helperAddr = '0x533dA777aeDCE766CEAe696bf90f8541A4bA80Eb';
      const dodoSellHelper = DODOSellHelper__factory.connect(
        helperAddr,
        provider
      );
      if (baseToken.toLowerCase() === quoteParam.inputToken) {
        outputAmount = await dodoSellHelper.querySellBaseToken(
          poolAddress,
          quoteParam.inputAmount,
          callOverrides
        );
      } else {
        if (quoteToken.toLowerCase() != quoteParam.inputToken) {
          throw new Error(
            `inputToken(${quoteParam.inputToken}) is not in dodo pool(${poolAddress})`
          );
        }
        outputAmount = await dodoSellHelper.querySellQuoteToken(
          poolAddress,
          quoteParam.inputAmount,
          callOverrides
        );
      }
      break;
    }
    case Protocol.DodoV2: {
      const dodo = DODOV2__factory.connect(poolAddress, provider);
      const dodo2 = DODOV2_2__factory.connect(poolAddress, provider);
      const zero = ethers.constants.AddressZero;
      const [baseToken, quoteToken] = await Promise.all([
        dodo._BASE_TOKEN_(),
        dodo._QUOTE_TOKEN_(),
      ]);

      try {
        if (baseToken.toLowerCase() === quoteParam.inputToken) {
          outputAmount = (
            await dodo.querySellBase(zero, quoteParam.inputAmount)
          )[0];
        } else {
          outputAmount = (
            await dodo.querySellQuote(zero, quoteParam.inputAmount)
          )[0];
        }
      } catch {
        if (baseToken.toLowerCase() === quoteParam.inputToken) {
          outputAmount = (
            await dodo2.querySellBase(zero, quoteParam.inputAmount)
          )[0];
        } else {
          if (quoteToken.toLowerCase() != quoteParam.inputToken) {
            throw new Error(
              `inputToken(${quoteParam.inputToken}) is not in dodo pool(${poolAddress})`
            );
          }
          outputAmount = (
            await dodo2.querySellQuote(zero, quoteParam.inputAmount)
          )[0];
        }
      }

      break;
    }
    case Protocol.Mstable: {
        const mstable = Mstable__factory.connect(poolAddress, provider);
        outputAmount = await mstable.getSwapOutput(
          quoteParam.inputToken,
          quoteParam.outputToken,
          quoteParam.inputAmount
        );
        break;
    } 
    case Protocol.BancorV3: {
      // https://etherscan.io/address/0x8E303D296851B320e6a697bAcB979d13c9D6E760#readProxyContract
      const bancorV3 = BancorV3__factory.connect(poolAddress, provider);
      outputAmount = await bancorV3.tradeOutputBySourceAmount(
        quoteParam.inputToken,
        quoteParam.outputToken,
        quoteParam.inputAmount
      );
      break;
    }
    case Protocol.Saddle: {
      // https://etherscan.io/address/0x4f6a43ad7cba042606decaca730d4ce0a57ac62e#readContract
      // pool: 0x4f6A43Ad7cba042606dECaCA730d4CE0A57ac62e
      // wbtc: 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599
      // sbtc: 0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6
        const saddle = Saddle__factory.connect(poolAddress, provider);
        const [tokenIndexFrom, tokenIndexTo] = await Promise.all([
            saddle.getTokenIndex(quoteParam.inputToken),
            saddle.getTokenIndex(quoteParam.outputToken),
        ]); 
        outputAmount = await saddle.calculateSwap(
          tokenIndexFrom,
          tokenIndexTo,
          quoteParam.inputAmount
        );
        break
    }
    case Protocol.Smoothy: {
        // pooladdress: 0xe5859f4EFc09027A9B718781DCb2C6910CAc6E91
        const smoothy = Smoothy__factory.connect(poolAddress, provider);

        let bTokenIdxIn;
        let bTokenIdxOut;
        if (quoteParam.chainId == ChainId.BSC) {
            const BSCtoken2Id: {
              [key: string] : number
            } = {
              "0xe9e7cea3dedca5984780bafc599bd69add087d56": 0, //BUSD,
              "0x55d398326f99059ff775485246999027b3197955": 1, //USDT,
              "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d": 2, //USDC
              "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3": 3, //DAI
              "0xb7f8cd00c5a06c0537e2abff0b58033d02e5e094": 4, //PAX
              "0x23396cf899ca06c4472205fc903bdb4de249d6fc": 5, //UST
            };
            bTokenIdxIn = BSCtoken2Id[quoteParam.inputToken];
            bTokenIdxOut = BSCtoken2Id[quoteParam.outputToken];

        } else {
            const ETHtoken2Id: {
              [key: string] : number
          } = {
              "0xdac17f958d2ee523a2206206994597c13d831ec7": 0, //USDT
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": 1,  //USDC
              "0x6b175474e89094c44da98b954eedeac495271d0f": 2,  //DAI,
              "0x0000000000085d4780b73119b644ae5ecd22b376": 3,   //TUSD
              "0x57ab1ec28d129707052df4df418d58a2d46d5f51": 4,  //sUsd
              "0x4fabb145d64652a948d72533023f6e7a623c7c53": 5   //busd
          };
          bTokenIdxIn = ETHtoken2Id[quoteParam.inputToken];
          bTokenIdxOut = ETHtoken2Id[quoteParam.outputToken];
        } 
        
        outputAmount = await smoothy.getSwapAmount(
            bTokenIdxIn as BigNumberish,
            bTokenIdxOut as BigNumberish,
            quoteParam.inputAmount
        );
        break;
    } 
    case Protocol.Shell: {
        // https://etherscan.io/address/0x8f26D7bAB7a73309141A291525C965EcdEa7Bf42#code
        const shell = Shell__factory.connect(poolAddress, provider);
        outputAmount = await shell.viewOriginSwap(
            quoteParam.inputToken,
            quoteParam.outputToken,
            quoteParam.inputAmount
        );
        break;
    }
    default: {
      throw new Error(`unsupported protocol: ${quoteParam.protocol}`);
    }
  }
  return {
    outputAmount: outputAmount.toString(),
    blockNumber: quoteParam.blockNumber,
    inputAmount: quoteParam.inputAmount.toString(),
    inputToken: quoteParam.inputToken,
    outputToken: quoteParam.outputToken,
    protocolName: Protocol[quoteParam.protocol],
  };
};
