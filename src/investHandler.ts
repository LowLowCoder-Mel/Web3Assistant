import { ethers, BigNumber } from 'ethers';
import { InvestParam, InvestResponse, ChainId } from './types';
import { BINANCE7, entranceMap, dexRouterMap } from './constants';
import { IERC20__factory } from './typechain';
import ganache from 'ganache';
import { getUrl, getProviderByUrl } from './utils';
import {
  impersonateAndTransfer,
  isNativeToken,
  AccountsRecord,
  wealthyAccountsByChains,
  getInvestBalance,
} from './test_helper';

function getDefaultEOA() {
  return BINANCE7;
}

async function getTimeStamp(
  blockNumber: number,
  provider: ethers.providers.JsonRpcProvider
) {
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}

export async function investHandler(investParam: InvestParam): Promise<InvestResponse> {

  process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection',err)
    //process.exit(1)
  })
  
  process.on('uncaughtException', (err) => {
    console.log('uncaughtException',err)
    //process.exit(1)
  })

  const approveAddress =
    investParam.tokenApproveAddress ??
    dexRouterMap[investParam.chainId].tokenApproveAddr;
  let entranceAddress: string =
      investParam.entranceAddress ??
      entranceMap[investParam.chainId].entranceAddr;
  const wealthyAccounts = wealthyAccountsByChains[investParam.chainId];
  if (!approveAddress.length || !entranceAddress.length || !wealthyAccounts) {
    throw new Error(`chainId: ${investParam.chainId} is not supported`);
  }
  const walletAddress = investParam.walletAddress ?? getDefaultEOA();
  // get permission of a wealthy account
  const unlockedAccounts = Object.values(wealthyAccounts).map(
    item => item.holder
  );
  unlockedAccounts.push(walletAddress);

  //add otherRichAddresses
  const otherRichAddresses =
  investParam.otherRichAddresses ?? "undefined"
  if(otherRichAddresses != "undefined"){
    const otherRichAddress:any = otherRichAddresses.split(",")
    for (let i = 0; i < otherRichAddress.length; i++) {
      unlockedAccounts.push(otherRichAddress[i]);
    }
  }
  let rpcUrl: string = investParam.rpcUrl ?? getUrl(investParam.chainId);
  const options = {
    fork: {
      url: rpcUrl,
      blockNumber: investParam.blockNumber,
      disableCache: true,
    },
    wallet: { unlockedAccounts },
    chain: {},
    miner: {},
  };
  const currentProvider = getProviderByUrl(rpcUrl);
  if (investParam.blockNumber) {
    const time = await getTimeStamp(investParam.blockNumber, currentProvider);
    options['chain'] = { time };
  }
  const gasPrice = await currentProvider.getGasPrice();
  options['miner'] = { defaultGasPrice: gasPrice.toHexString() };

  const provider = new ethers.providers.Web3Provider(
    ganache.provider(options as any) as any
  );
  const signer = provider.getSigner(walletAddress);
  const ethValue = investParam.ethValue ?? '0';

  //prepare other tokens 
  const otherInputTokens =
    investParam.otherInputTokens ?? "undefined"
  const otherInputAmounts =
    investParam.otherInputAmounts ?? "undefined"
  if(otherInputTokens != "undefined" && otherInputAmounts != "undefined" && otherRichAddresses != "undefined"){
    const otherInputToken:any = otherInputTokens.split(",")
    const otherInputAmount:any = otherInputAmounts.split(",")
    const otherRichAddress:any = otherRichAddresses.split(",")
    for (let i = 0; i < otherInputToken.length; i++) {
      const token = otherInputToken[i];
      const amount:BigNumber = BigNumber.from(otherInputAmount[i]);
      const richAddress = otherRichAddress[i]
      if(amount.gt(BigNumber.from(0))){
        if(token!= "0x0000000000000000000000000000000000000000" && token.toLocaleLowerCase()!= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLocaleLowerCase()){
          const inputTokenContract = IERC20__factory.connect(
            token,
            provider
          );
          const otherSigner = provider.getSigner(richAddress);
          await inputTokenContract.connect(otherSigner).transfer(walletAddress, amount);
        }else{
          const otherSigner = provider.getSigner(richAddress);
          const gasLimit = BigNumber.from("50000")
          await otherSigner.sendTransaction({ ...{
            from: richAddress,
            to: walletAddress,
            data: "0x",
            value: amount,
          },  gasLimit});
        }
      }
  }

  }

  const gaugeAddress =
    investParam.gaugeAddress ?? "undefined"
  const adapterAddress =
    investParam.adapterAddress ?? "undefined"
  if(gaugeAddress != "undefined" && adapterAddress != "undefined"){
    const iGaugeface = new ethers.utils.Interface([
      'function set_approve_deposit(address, bool) external',
    ]);
    const gaugeContract = new ethers.Contract(gaugeAddress, iGaugeface, provider);
    gaugeContract.connect(signer).set_approve_deposit(adapterAddress, true);
  }

  //approve nftIds
  const nftIds =
  investParam.nftTokenIds ?? "undefined"
  const managerAddress = investParam.managerAddress ?? "undefined"
  
  if(nftIds != "undefined"){

    if(managerAddress == "undefined" || adapterAddress == "undefined"){
      throw new Error(`ManagerAddress or adapterAddress not set`);
    }
    const managerCon = new ethers.utils.Interface([
      'function approve(address, uint256) external;',
    ]);
    const managerContract = new ethers.Contract(managerAddress, managerCon, provider);

    const nftIdAll:any = nftIds.split(",")
    for (let i = 0; i < nftIdAll.length; i++) {
      const nftId = nftIdAll[i];
      const resulta = await managerContract.connect(signer).approve(adapterAddress, nftId);
    }
  }
  

  // to survery why it doesn't work here?
  const max = ethers.constants.MaxUint256;

  // const gasPrice = await provider.getGasPrice();
  // approve dexRouter for input token\
  const inputTokens:any = investParam.inputToken.split(",")
  const inputAmounts:any = investParam.inputAmount.split(",")
  const outputTokens:any = investParam.outputToken.split(",")
  const inputLength = inputTokens.length;
  const outLength = outputTokens.length;
  for (let i = 0; i < inputLength; i++) {
      const token = inputTokens[i];
      const amount:BigNumber = BigNumber.from(inputAmounts[i]);
      if(amount.gt(BigNumber.from(0)) && token!= "0x0000000000000000000000000000000000000000" && token.toLocaleLowerCase()!= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLocaleLowerCase()){
        const inputTokenContract = IERC20__factory.connect(
          token,
          provider
        );
        await inputTokenContract.connect(signer).approve(approveAddress, 0);
        await inputTokenContract.connect(signer).approve(approveAddress, max);
        if(entranceAddress.toLocaleLowerCase() == dexRouterMap[investParam.chainId].dexRouterAddr.toLocaleLowerCase()){
          await inputTokenContract.connect(signer).transfer(entranceAddress, amount);
        }
      }
  }
  // execute swap in dexRouter
  const tx = {
    from: walletAddress,
    to: entranceAddress,
    data: investParam.calldata,
    value: BigNumber.from(ethValue),
  };
  let inputBefores:any = [] ;
  for (let i = 0; i < inputLength; i++) {
      const token = inputTokens[i];
      const before = await getInvestBalance(
        token,
        walletAddress,
        investParam.chainId,
        provider
      )
      inputBefores.push(before);
  }
  let outputBefores:any = [];
  for (let i = 0; i < outLength; i++) {
    const token = outputTokens[i];
    const before = await getInvestBalance(
      token,
      walletAddress,
      investParam.chainId,
      provider
    )
    outputBefores.push(before);
}

const promiseRes = await Promise.all([
  provider.getBlockNumber(),
  provider.estimateGas(tx),
]);
const blockNumber = promiseRes[0];
const gasLimit = promiseRes[1];
//const gasLimit = 4000000;
  const txRes = await signer.sendTransaction({ ...tx, gasLimit });
  const receipt = await txRes.wait();
  const fee = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
  const gasUsed = receipt.gasUsed;
  let inputAfters:any = [] ;
  let userCost:any = [];
  for (let i = 0; i < inputLength; i++) {
    const token = inputTokens[i];
    const after = await getInvestBalance(
      token,
      walletAddress,
      investParam.chainId,
      provider
    )
    inputAfters.push(after);
    userCost.push(inputBefores[i].sub(inputAfters[i]))
}
let outAfters:any = [];
let userGets:any = [];
  for (let i = 0; i < outLength; i++) {
    const token = outputTokens[i];
    const after = await getInvestBalance(
      token,
      walletAddress,
      investParam.chainId,
      provider
    )
    outAfters.push(after);
    userGets.push(outAfters[i].sub(outputBefores[i]));
}

  return {
    tokenIn:inputTokens.toString(),
    tokenInAmoutsBefore:inputBefores.toString(),
    tokenInAmountsAfter:inputAfters.toString(),
    tokenInAmountOfUserSpend:userCost.toString(),
    tokenOut:outputTokens.toString(),
    tokenOutAmountsBefore:outputBefores.toString(),
    tokenOutAmountsAfter:outAfters.toString(),
    outputAmountOfUserGet:userGets.toString(),
    gasUsed: gasUsed.toString(),
    gasLimit: gasLimit.toString(),
    blockNumber,
    feeUsed:fee.toString(),
  };
}