// Use any RPC framework of your choice
import axios from 'axios';
import dotenv from 'dotenv';
import { BigNumberish } from 'ethers';
import { base64, getAddress, hexlify } from 'ethers/lib/utils';
import { WithdrawReq } from './ts-proto/sgn/cbridge/v1/tx_pb';
import { DecodeRefundResponse } from './../types';

dotenv.config();

export enum WithdrawMethodType {
  WD_METHOD_TYPE_UNDEFINED = 0,
  WD_METHOD_TYPE_ONE_RM = 1,
  WD_METHOD_TYPE_ALL_IN_ONE = 2,
  WD_METHOD_TYPE_STAKING_CLAIM = 3,
}
export enum WithdrawType {
  WITHDRAW_TYPE_REMOVE_LIQUIDITY = 0,
  WITHDRAW_TYPE_REFUND_TRANSFER = 1,
  WITHDRAW_TYPE_CLAIM_FEE_SHARE = 2,
  WITHDRAW_TYPE_VALIDATOR_CLAIM_FEE_SHARE = 3,
}
/**
 * Requests refund via the cBridge REST API.
 *
 * @param transferId https://cbridge-docs.celer.network/developer/api-reference/contract-send#transferid-generation
 * @param estimatedReceivedAmt estimated amount of refund
 */
export const requestRefund = async (
  transferId: string,
  estimatedReceivedAmt: BigNumberish
): Promise<any> => {
  console.log(transferId);
  const timestamp = Math.floor(Date.now() / 1000);
  const withdrawReqProto = new WithdrawReq();
  withdrawReqProto.setXferId(transferId);
  withdrawReqProto.setReqId(timestamp);
  withdrawReqProto.setWithdrawType(WithdrawType.WITHDRAW_TYPE_REFUND_TRANSFER);

  const req = {
    withdraw_req: base64.encode(withdrawReqProto.serializeBinary() || ''),
    estimated_received_amt: estimatedReceivedAmt,
    method_type: WithdrawMethodType.WD_METHOD_TYPE_ALL_IN_ONE,
  };
  console.log(req);
  return (
    axios
      // Replace CBRIDGE_GATEWAY_URL
      .post(`https://cbridge-prod2.celer.network/v2/withdrawLiquidity`, {
        ...req,
      })
      .then(res => {
        return res;
      })
      .catch(e => {
        console.log('Error:', e);
      })
  );
};
// Replace with your input and uncomment
// requestRefund('TRANSFER_ID', ESTIMATED_RECEIVED_AMT);

export const requestGetTransferStatus = async (
  transferId: string
): Promise<any> => {
  const req = {
    transfer_id: transferId,
  };

  return (
    axios
      // Replace CBRIDGE_GATEWAY_URL
      .post(`https://cbridge-prod2.celer.network/v2/getTransferStatus`, {
        ...req,
      })
      .then(res => {
        return res;
      })
      .catch(e => {
        console.log('Error:', e);
      })
  );
};

export const decodeResponse = (response: {
  wd_onchain: string;
  sorted_sigs: string[];
  signers: string[];
  powers: string[];
}) => {
  const res: DecodeRefundResponse = {
    wdmsg: hexlify(base64.decode(response.wd_onchain)),
    sigs: response.sorted_sigs.map(item => {
      return hexlify(base64.decode(item));
    }),
    signers: response.signers.map(item => {
      const decodeSigners = base64.decode(item);
      const hexlifyObj = hexlify(decodeSigners);
      return getAddress(hexlifyObj);
    }),
    powers: response.powers.map(item => {
      return hexlify(base64.decode(item));
    }),
  };
  return res;
};

// const response =
// {
//     "err": null,
//     "status": 8,
//     "wd_onchain": "CAEQ0+W+lgYaFKK8Ge7DNV4M/HNkVVW78ZvlXE+TIhTAKqo5siP+jQoOXE8n6tkIPHVswioHFkvOaFg9nTIgoNGCDq7utopdV6su3IfLVuesPWTWfwYx1mjpPYWVqcE=",
//     "sorted_sigs": [
//         "LAH7SSH+6AcBLrbhw4J6OixNwxivzUk8X7edRuCCizwHAcfwFsg7ojb5FWjcVk2OHB4ZReLrkf9E6DmQOxU2wBs=",
//         "Fi3sb+TpUz41YthlNITJ2PRoGzLO8ofPZEUUhhLTuxJ7TKdeSoof4J4lWxRz/1PFTDqDW357buWSUkIZRpEGjhw=",
//         "aY2pkr/5qCKAmYdLW9bQtJqdIxa5PQOQrg7jd9w6llhdUcxfSEu7hnx55x0gHjo5g1TpzBfNxBYP5rc9W2D1Yhw=",
//         "yN72077Lt8GRT6d5yqARbovNfsIyUmlRqKtubErJgzI8hNRG2q/ZrrmTmokdVwV3kLTxYCqojuVnEfei89ZWPxs=",
//         "BmTY6cSY0Gto11IwuXyXk+CX7oyzYBZibVtcSQNbDQFysFPs34/V0fPD4W3WIBdLV3CPu73xQIF1a4jCJEPwjxw=",
//         "FKdV/37uBtmmcAyMQOX+upa/CnRjgqztXG1r+iuqle1ALdQaLSdEczDPrNeSBy/vae7fLVcKtSOOlnvF/umXXxw=",
//         "GMfMImEXnW5XgDFi673I3S6OAXF5F5CKQL6NmCz17k0z/A/Hn3zuZm3DOOBTIbn4lP/1nGKXqc20RWfvytMvHhw="
//     ],
//     "signers": [
//         "JBoQAzPu+i78OJ7INqb/YZ/BxkQ=",
//         "JzA14Q8QZJnvrOOF26BxNefMjlQ=",
//         "VfShv8ZVz1XtMl8jOKHe6E91TfI=",
//         "hwz43V2cjrFAPf1uakdT9NYXpTg=",
//         "lQFuNq204BUXNc7TmSp/pU4WvQg=",
//         "lUrcdEgWNLTSeMRZhTtObMF66NI=",
//         "mOnSiHQ4OelqgAWmtRx3C793iMA=",
//         "mmZkQIQQihvCOpzNUNbWPlMJjbY=",
//         "moz6z1E/s9Xjn1lSyGCOmFs9xu8=",
//         "msUnkBPt/sdMXCl2/IMa0FJ0AuA=",
//         "nNUAbhv/eF2tWGnv2BosQlRcnZs=",
//         "pzsznD+uJ77ffLctnQALCPyJlgk=",
//         "v6L2i/mtYNw8+xzvBHMOt/olFCQ=",
//         "x0rKuMCjQPWF0AjLUh1k0lVBcag=",
//         "zxLdNNdZfQb/mPhdK5SD2dX32VI=",
//         "0QyDP0MF4QU6ZLxzjFUDgfSBBMo=",
//         "89kS5/sYCs3qMaUnl9Ve4piKuQc=",
//         "9BUe6/obnIfdksgkOhixuu+MGBM=",
//         "9a1/N4Lopnv/opdoTifPn8x4G+E=",
//         "9uk+sohljeXi6YL5nSs3iyKVnRU="
//     ],
//     "powers": [
//         "MOeIjv5P72RqAAA=",
//         "fBYla+iYN/zgAAA=",
//         "HgdVqIRe1sunAAA=",
//         "Oe4WxlKr3okSAAA=",
//         "G8V3N8yFG46rAAA=",
//         "NNdJajgh+vG4AAA=",
//         "relwlitKV6SQAAA=",
//         "ARC5xIOcKmYH6qAA",
//         "KB4fep3h7o1DQAA=",
//         "KIwxEboSNs5uAAA=",
//         "AR54t7/nTVVVJQAA",
//         "U+Sf9T4T0cfxAAA=",
//         "ywKKOETFLhluAAA=",
//         "PiVrPwniq/XwAAA=",
//         "PKjmFCmbYQxXAAA=",
//         "fFDsNWVC5rKnAAA=",
//         "CMb3hE53PklEAAA=",
//         "KeJSZbERyBn7AAA=",
//         "MfYsY+Im9ndJAAA=",
//         "Pt2gM4Qf2CScAAA="
//     ],
//     "refund_reason": 4,
//     "block_delay": 8,
//     "src_block_tx_link": "",
//     "dst_block_tx_link": ""
// }

// console.log(decodeResponse(response));
