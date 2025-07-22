import { getChainId } from '@wagmi/core'
import wagmiConfig from "@/config/config";
import config from "@/config/index";
import erc20ABI from '../erc20';
import { waitForTransactionReceipt, writeContract, readContract, estimateGas, estimateMaxPriorityFeePerGas, estimateFeesPerGas } from '@wagmi/core'
import crossContractABI from '../abi_WeUSDCrossChain.json';
import { parseGwei } from 'viem'

// import { getPublicClient, waitForTransaction, writeContract } from '@wagmi/core';
// import contractABI from './abi/abi-market';
// import { hexToBytes, formatBigIntToString } from '@/utils/utils';
// import { getByNetworkId } from '@/api/market';
// import { parseAbiItem, parseEther } from 'viem';
// import { getNetwork } from "@wagmi/core";
// import { errorParse } from './error';
/**
 * 获取合约地址
 */
export async function getContractAddress() {
  const chainId = getChainId(wagmiConfig)
  // console.log('chainId', chainId)
  const contract = config.contract;
  const actionContract = contract.find(item => item.chainId == chainId);

  // const responseData = await getByNetworkId(selectedNetworkId);
  // if (responseData.code != 200 || !responseData.data) {
  //   throw new Error('chainId:' + selectedNetworkId + 'Kindly switch to the right network to proceed.');
  // }
  // const networkBean = responseData.data;
  // if (!networkBean.marketContract) {
  //   throw new Error('chainId:' + selectedNetworkId + 'Kindly switch to the right network to proceed.');
  // }
  return actionContract;
}

// /**
//  * erc20授权
//  */
export async function erc20Approve(tokenAddress, value) {
  const contract = await getContractAddress();
  const chainId = getChainId(wagmiConfig)
  const Hash = await writeContract(wagmiConfig, {
    address: tokenAddress,
    abi: erc20ABI,
    chainId: Number(chainId),
    functionName: 'approve',
    args: [contract.crossContractAddress, value]
  });
  const result = await waitForTransactionReceipt(wagmiConfig, { hash: Hash, chainId: Number(chainId) });
  return result;
}

// /**
//  * 获取当前已批准的erc20授权额度
//  */
export async function allowanceERC20(tokenAddress, ownerAddress) {
  const contract = await getContractAddress();
  const chainId = getChainId(wagmiConfig)
  const data = await readContract(wagmiConfig, {
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [ownerAddress, contract.crossContractAddress],
  });
  return data;
}

/**
 * burn WeUSD CrossChain
 */
export async function burnWeUSDCrossChain(params) {

  const { targetChainId, amount, outerUser } = params;
  console.log('targetChainId', targetChainId)
  console.log('amount', amount)
  console.log('outerUser', outerUser)

  const contract = await getContractAddress();
  const chainId = getChainId(wagmiConfig)
  const gasLimit = await estimateGas(wagmiConfig, {
    address: contract.crossContractAddress,
    abi: crossContractABI,
    functionName: 'burnWeUSDCrossChain',
    args: [targetChainId, amount, outerUser],
    chainId: Number(chainId),
  })
  console.log('gasLimit', gasLimit)
 
  const Hash = await writeContract(wagmiConfig, {
    address: contract.crossContractAddress,
    abi: crossContractABI,
    chainId: Number(chainId),
    functionName: 'burnWeUSDCrossChain',
    args: [targetChainId, amount, outerUser],
    // gas: gasLimit,
  });
  const result = await waitForTransactionReceipt(wagmiConfig, { hash: Hash, chainId: Number(chainId) });
  return result;

}