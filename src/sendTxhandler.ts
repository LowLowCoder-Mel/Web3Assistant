import { ethers, BigNumber } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { getDefaultWallet } from './utils';

export async function sendTxHandler(
  sendTx: TransactionRequest,
  provider: ethers.providers.JsonRpcProvider
) {
  const wallet = getDefaultWallet(provider);
  const nonce = await provider.getTransactionCount(wallet.address);
  const tx = {
    value: BigNumber.from(sendTx.value),
    to: sendTx.to,
    nonce: nonce,
    from: wallet.address,
    data: sendTx.data,
  };
  const fetchedGasPrice = await provider.getGasPrice();
  const fetchedGasLimit = await provider.estimateGas(tx);
  const gasLimit = sendTx.gasLimit
    ? BigNumber.from(sendTx.gasLimit)
    : fetchedGasLimit;
  const gasPrice = sendTx.gasPrice
    ? BigNumber.from(sendTx.gasPrice)
    : fetchedGasPrice;

  const txRes = await wallet.sendTransaction({ ...tx, gasLimit, gasPrice });
  return {
    gasLimit: txRes.gasLimit.toString(),
    txHash: txRes.hash,
  };
}
