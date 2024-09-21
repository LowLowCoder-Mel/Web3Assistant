import { ethers, BigNumber } from 'ethers';
import { SwapParam, SwapResponse, ChainId } from './types';
import { BINANCE7, dexRouterMap, xbridgeMap } from './constants';
import { IERC20__factory } from './typechain';
import ganache from 'ganache';
import { getUrl, getProvider } from './utils';
import {
  impersonateAndTransfer,
  isNativeToken,
  AccountsRecord,
  wealthyAccountsByChains,
  getBalance,
} from './test_helper';

function getDefaultEOA() {
  return BINANCE7;
}

async function prepareTokens(
  walletAddress: string,
  tokenAddr: string,
  tokenAmount: string,
  wealthyAccounts: AccountsRecord,
  chainId: ChainId,
  provider: ethers.providers.JsonRpcProvider
) {
  // check balance first

  const balance = await getBalance(tokenAddr, walletAddress, chainId, provider);
  if (balance.gte(tokenAmount)) {
    // no need to transfer due to enough money in wallet already
    return;
  }

  const accounts = Object.values(wealthyAccounts).filter(
    item => item.contract.toLowerCase() === tokenAddr.toLowerCase()
  );
  if (!accounts.length) {
    throw new Error(`trading from tokenAddr(${tokenAddr}) is not supported`);
  }

  if (BigNumber.from(tokenAmount).gt(0)) {
    try {
      await impersonateAndTransfer(
        tokenAmount,
        accounts[0],
        walletAddress,
        chainId,
        provider
      );
    } catch (err) {
      throw new Error(
        `Token preparation failed: ${err}, please use a wealthy account to test`
      );
    }
  }
}

async function getTimeStamp(
  blockNumber: number,
  provider: ethers.providers.JsonRpcProvider
) {
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}

export async function swapHandler(swapParam: SwapParam): Promise<SwapResponse> {
  const approveAddress =
    swapParam.tokenApproveAddress ??
    dexRouterMap[swapParam.chainId].tokenApproveAddr;
  let exchangeAddress: string;
  if (swapParam.bridge) {
    exchangeAddress =
      swapParam.exchangeAddress ?? xbridgeMap[swapParam.chainId].xbridgeAddr;
  } else {
    exchangeAddress =
      swapParam.exchangeAddress ??
      dexRouterMap[swapParam.chainId].dexRouterAddr;
  }
  const wealthyAccounts = wealthyAccountsByChains[swapParam.chainId];
  if (!approveAddress.length || !exchangeAddress.length || !wealthyAccounts) {
    throw new Error(`chainId: ${swapParam.chainId} is not supported`);
  }
  const walletAddress = swapParam.walletAddress ?? getDefaultEOA();
  // get permission of a wealthy account
  const unlockedAccounts = Object.values(wealthyAccounts).map(
    item => item.holder
  );
  unlockedAccounts.push(walletAddress);
  const options = {
    fork: {
      url: getUrl(swapParam.chainId),
      blockNumber: swapParam.blockNumber,
      disableCache: true,
    },
    wallet: { unlockedAccounts },
    chain: {},
    miner: {},
  };
  const currentProvider = getProvider(swapParam.chainId);
  if (swapParam.blockNumber) {
    const time = await getTimeStamp(swapParam.blockNumber, currentProvider);
    options['chain'] = { time };
  }
  const gasPrice = await currentProvider.getGasPrice();
  options['miner'] = { defaultGasPrice: gasPrice.toHexString() };

  const provider = new ethers.providers.Web3Provider(
    ganache.provider(options as any) as any
  );
  const signer = provider.getSigner(walletAddress);
  const ethValue = swapParam.ethValue ?? '0';

  // prepare tokens
  await prepareTokens(
    walletAddress,
    swapParam.inputToken,
    swapParam.inputAmount,
    wealthyAccounts,
    swapParam.chainId,
    provider
  );

  // to survery why it doesn't work here?
  const max = ethers.constants.MaxUint256;

  // const gasPrice = await provider.getGasPrice();
  // approve dexRouter for input token
  if (!isNativeToken(swapParam.inputToken, swapParam.chainId)) {
    const inputTokenContract = IERC20__factory.connect(
      swapParam.inputToken,
      provider
    );
    const gasLimit = await inputTokenContract
      .connect(signer)
      .estimateGas.approve(approveAddress, max);
    // const gasFee = gasPrice.mul(gasLimit);
    // hardcode
    const gasFee = ethers.utils.parseEther('10').toString();

    // note that the gasPrice may not match with real environment
    await prepareTokens(
      walletAddress,
      wealthyAccounts.NativeToken.contract,
      gasFee.toString(), // estimate gas fee for approval
      wealthyAccounts,
      swapParam.chainId,
      provider
    );
    await inputTokenContract.connect(signer).approve(approveAddress, max);
  }

  // execute swap in dexRouter
  const tx = {
    from: walletAddress,
    to: exchangeAddress,
    data: swapParam.calldata,
    value: BigNumber.from(ethValue),
  };
  // check output token balance before and after
  // const before = await outputTokenContract.balanceOf(walletAddress);
  // const blockNumber = await provider.getBlockNumber();
  // const gasLimit = await provider.estimateGas(tx);
  const promiseRes = await Promise.all([
    provider.getBlockNumber(),
    provider.estimateGas(tx),
  ]);
  const blockNumber = promiseRes[0];
  const gasLimit = promiseRes[1];
  // prepare gas before swap
  const gasFee = gasPrice.mul(gasLimit);
  await prepareTokens(
    walletAddress,
    wealthyAccounts.NativeToken.contract,
    gasFee.toString(),
    wealthyAccounts,
    swapParam.chainId,
    provider
  );
  const before = await getBalance(
    swapParam.outputToken,
    walletAddress,
    swapParam.chainId,
    provider
  );

  const txRes = await signer.sendTransaction({ ...tx, gasLimit });
  const receipt = await txRes.wait();
  const gasUsed = receipt.gasUsed;

  // check balance again
  const after = await getBalance(
    swapParam.outputToken,
    walletAddress,
    swapParam.chainId,
    provider
  );
  const outputAmount = after.sub(before);

  return {
    outputAmount: outputAmount.toString(),
    gasUsed: gasUsed.toString(),
    gasLimit: gasLimit.toString(),
    blockNumber,
  };
}
