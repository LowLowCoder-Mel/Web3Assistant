import Router from '@koa/router';
import { QuoteParam, SwapParam, ChainId, InvestParam } from './types';
import {
  requestGetTransferStatus,
  requestRefund,
} from './cbridge_refund/refund';
import { quoteHandler } from './quoteHandler';
import { swapHandler } from './swapHandler';
import { sendTxHandler } from './sendTxhandler';
import { getProvider } from './utils';
import { logger } from './logging';
import { investHandler } from './investHandler';
const router = new Router();

// cbridge_getTransferStatus
router.get('/Cbridge/GetTransferStatus', async ctx => {
  const transfer_id = ctx.querystring;
  try {
    console.log();
    const result = await requestGetTransferStatus(transfer_id);
    logger.info('result: ', result);
    ctx.body = result.data;
  } catch (error) {
    ctx.body = {
      error: `${error}`,
    };
    ctx.status = 400;
    logger.info('query: ', transfer_id);
    logger.error(`error: ${error}`);
  }
});
//cbridge_requestRefund
router.get('/Cbridge/Refund', async ctx => {
  const query = ctx.qurey;
  console.log(ctx.querystring);
  console.log(ctx.query.transferId);
  console.log(ctx.query.amount);

  try {
    console.log(query);
    const result = await requestRefund(
      ctx.query.transferId as string,
      ctx.query.amount as string
    );
    logger.info('result: ', result);
    ctx.body = result.data;
  } catch (error) {
    ctx.body = {
      error: `${error}`,
    };
    ctx.status = 400;
    logger.info('query: ', query);
    logger.error(`error: ${error}`);
  }
});

// homepage
router.get('/', async ctx => {
  ctx.body = 'hello world';
});

router.get('/swap', async ctx => {
  const query = ctx.query;
  const swapParam: SwapParam = {
    calldata: query.calldata as string,
    inputToken: (query.inputToken as string).toLowerCase(), // lowercase for address
    inputAmount: query.inputAmount as string,
    outputToken: (query.outputToken as string).toLowerCase(),
    walletAddress: (query.walletAddress as string).toLowerCase(),
    ethValue: query.ethValue as string | undefined,
    blockNumber: query.blockNumber
      ? parseInt(query.blockNumber as string)
      : undefined,
    bridge: query.bridge ? parseInt(query.bridge as string) : 0,
    chainId: query.chainId
      ? parseInt(query.chainId as string)
      : ChainId.Ethereum,
  };
  try {
    const swapResponse = await swapHandler(swapParam);
    ctx.body = swapResponse;
    ctx.status = 200;
    // logging
    logger.info('query: ', query);
    logger.info('outputAmount: ', swapResponse.outputAmount.toString());
  } catch (error) {
    ctx.body = {
      error: `${error}`,
    };
    ctx.status = 400;
    logger.info('query: ', query);
    logger.error(`error: ${error}`);
  }
});

router.get('/sendTx', async ctx => {
  const query = ctx.query;
  const value = query.value ? (query.value as string) : '0';
  const txParam = {
    to: query.to as string,
    value,
    data: query.data as string,
    gasLimit: query.gasLimit ? (query.gasLimit as string) : undefined,
    gasPrice: query.gasPrice ? (query.gasPrice as string) : undefined,
  };
  const chainId = query.chainId
    ? parseInt(query.chainId as string)
    : ChainId.Ethereum;
  const provider = getProvider(chainId);

  try {
    const sendTxResponse = await sendTxHandler(txParam, provider);
    ctx.body = sendTxResponse;
    ctx.status = 200;
    // logging
    logger.info('query: ', query);
  } catch (error) {
    ctx.body = {
      error: `${error}`,
    };
    ctx.status = 400;
    logger.info('query: ', query);
    logger.error(`error: ${error}`);
  }
});

router.get('/quote', async ctx => {
  const query = ctx.query;
  const quoteParam: QuoteParam = {
    blockNumber: query.blockNumber
      ? parseInt(query.blockNumber as string)
      : undefined,
    inputAmount: query.inputAmount as string,
    inputToken: (query.inputToken as string).toLowerCase(), // lowercase for address
    outputToken: (query.outputToken as string).toLowerCase(),
    protocol: parseInt(query.protocol as string),
    poolAddress: query.poolAddress as string,
    chainId: query.chainId
      ? parseInt(query.chainId as string)
      : ChainId.Ethereum,
  };
  const provider = getProvider(quoteParam.chainId);

  try {
    const quoteResponse = await quoteHandler(quoteParam, provider);
    ctx.body = quoteResponse;
    ctx.status = 200;
    // logging
    logger.info('query: ', query);
    logger.info('outputAmount: ', quoteResponse.outputAmount);
  } catch (error) {
    ctx.body = {
      error: `${error}`,
    };
    ctx.status = 400;
    logger.info('query: ', query);
    logger.error(`error: ${error}`);
  }
});

router.get('/invest/entrance', async ctx => {
  const query = ctx.query;
  const investParam: InvestParam = {
    calldata: query.calldata as string,
    inputToken: (query.inputToken as string).toLowerCase(), // lowercase for address
    inputAmount: query.inputAmount as string,
    outputToken: (query.outputToken as string).toLowerCase(),
    walletAddress: (query.walletAddress as string).toLowerCase(),
    ethValue: query.ethValue as string | undefined,
    entranceAddress: query.entranceAddress as string | undefined,
    tokenApproveAddress: query.tokenApproveAddress as string | undefined,
    blockNumber: query.blockNumber
      ? parseInt(query.blockNumber as string)
      : undefined,
    bridge: query.bridge ? parseInt(query.bridge as string) : 0,
    chainId: query.chainId
      ? parseInt(query.chainId as string)
      : ChainId.Ethereum,
    rpcUrl: query.rpcUrl as string | undefined,
    gaugeAddress: query.gaugeAddress as string | undefined,
    adapterAddress: query.adapterAddress as string | undefined,
    otherInputTokens: query.otherInputTokens as string | undefined,
    otherInputAmounts: query.otherInputAmounts as string | undefined,
    otherRichAddresses: query.otherRichAddresses as string | undefined,
    nftTokenIds: query.nftTokenIds as string | undefined,
    managerAddress: query.managerAddress as string | undefined,
  };
  try {
    const swapResponse = await investHandler(investParam);
    ctx.body = swapResponse;
    ctx.status = 200;
    // logging
    logger.info('query: ', query);
    logger.info('outputAmount: ', swapResponse.outputAmountOfUserGet.toString());
  } catch (error) {
    ctx.body = {
      error: `${error}`,
    };
    ctx.status = 400;
    logger.info('query: ', query);
    logger.error(`error: ${error}`);
  }
});

router.post('/invest/entrance', async ctx => {
  const query = ctx.request.body;
  const investParam: InvestParam = {
    calldata: query.calldata as string,
    inputToken: (query.inputToken as string).toLowerCase(), // lowercase for address
    inputAmount: query.inputAmount as string,
    outputToken: (query.outputToken as string).toLowerCase(),
    walletAddress: (query.walletAddress as string).toLowerCase(),
    ethValue: query.ethValue as string | undefined,
    entranceAddress: query.entranceAddress as string | undefined,
    tokenApproveAddress: query.tokenApproveAddress as string | undefined,
    blockNumber: query.blockNumber
      ? parseInt(query.blockNumber as string)
      : undefined,
    bridge: query.bridge ? parseInt(query.bridge as string) : 0,
    chainId: query.chainId
      ? parseInt(query.chainId as string)
      : ChainId.Ethereum,
    rpcUrl: query.rpcUrl as string | undefined,
    gaugeAddress: query.gaugeAddress as string | undefined,
    adapterAddress: query.adapterAddress as string | undefined,
    otherInputTokens: query.otherInputTokens as string | undefined,
    otherInputAmounts: query.otherInputAmounts as string | undefined,
    otherRichAddresses: query.otherRichAddresses as string | undefined,
    nftTokenIds: query.nftTokenIds as string | undefined,
    managerAddress: query.managerAddress as string | undefined,
  };
  try {
    const swapResponse = await investHandler(investParam);
    ctx.body = swapResponse;
    ctx.status = 200;
    // logging
    logger.info('query: ', query);
    logger.info('outputAmount: ', swapResponse.outputAmountOfUserGet.toString());
  } catch (error) {
    ctx.body = {
      error: `${error}`,
    };
    ctx.status = 400;
    logger.info('query: ', query);
    logger.error(`error: ${error}`);
  }
});

export { router };
