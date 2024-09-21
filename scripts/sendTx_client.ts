import axios from 'axios';
import { ChainId } from '../src/types';
import { formatUnits, parseUnits } from '../src/utils';
import { tokensByChain } from '../src/tokens';
import { logger } from '../src/logging';
import { ethers } from 'ethers';

import dotenv from 'dotenv';
dotenv.config();

const url = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/sendTx`;

async function request(query: any) {
  try {
    const res = await axios.get(url, { params: query });
    const quoteRes = res.data;
    logger.info(quoteRes);
  } catch (error: any) {
    logger.fatal(`${error.response.data.error}`);
  }
}

async function testEthereum() {
  const chainId = ChainId.Ethereum;
  const tokens = tokensByChain[chainId]!;
  const to = '0xFc99f58A8974A4bc36e60E2d490Bb8D72899ee9f'; // xbridge
  const data =
    '0x8e8920e300000000000000000000000000000000000000000000000000000000000000200000000000000000000000001a23c4272309cffdd29ce043990e96f0b37c70630000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000003888c2e42d0fb8b7e6b6dfcc0512c857e1ef0b1b3ecabc94a92c587cdceb2ab26d00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000';
  const sendTxParam = {
    data,
    chainId,
    to,
  };
  logger.info(sendTxParam);
  await request(sendTxParam);
}

async function main() {
  await testEthereum();
}

main();
