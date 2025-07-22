import { getChainId, waitForTransactionReceipt, writeContract, readContract, estimateGas, estimateMaxPriorityFeePerGas, estimateFeesPerGas, getConnectorClient } from '@wagmi/core'
import wagmiConfig from '@/config/config'
import config from '@/config/index'
import erc20ABI from '../erc20'

import mintContractABI from '../abi_WeUSDMintRedeem.json'
import { parseGwei } from 'viem'

/**
 * 获取合约地址
 */
export async function getContractAddress () {
  const chainId = getChainId(wagmiConfig)
  console.log('chainId', chainId)
  const contract = config.contract
  const actionContract = contract.find(item => item.chainId == chainId)

  const client = await getConnectorClient(wagmiConfig)
  console.log('client', client)
  return actionContract
}

// /**
//  * erc20授权
//  */
export async function erc20Approve (tokenAddress, value) {
  const contract = await getContractAddress()
  const chainId = getChainId(wagmiConfig)
  console.log('授权的value', value)
  const Hash = await writeContract(wagmiConfig, {
    address: tokenAddress,
    abi: erc20ABI,
    chainId: Number(chainId),
    functionName: 'approve',
    args: [contract.mintContractAddress, value],
  })
  const result = await waitForTransactionReceipt(wagmiConfig, { hash: Hash, chainId: Number(chainId) })
  return result
}

// /**
//  * 获取当前已批准的erc20授权额度
//  */
export async function allowanceERC20 (tokenAddress, ownerAddress) {
  const contract = await getContractAddress()
  const chainId = getChainId(wagmiConfig)
  const data = await readContract(wagmiConfig, {
    address: tokenAddress,
    abi: erc20ABI,
    chainId: Number(chainId),
    functionName: 'allowance',
    args: [ownerAddress, contract.mintContractAddress],
  })
  console.log('ownerAddress', ownerAddress)
  console.log('contractAddress', contract.mintContractAddress)
  console.log('tokenAddress', tokenAddress)
  return data
}

/**
 * mint weusd
 */
export async function mintWeUSD (params) {
  const { amount } = params
  console.log('amount', amount)

  const contract = await getContractAddress()
  const chainId = getChainId(wagmiConfig)
  // const gasLimit = await estimateGas(wagmiConfig, {
  //   address: contract.mintContractAddress,
  //   abi: mintContractABI,
  //   functionName: 'mintWeUSD',
  //   args: [amount],
  //   chainId: Number(chainId),
  // })
  // console.log('gasLimit', gasLimit)
  // 2. estimate fees
  // const maxPriorityFeePerGas = await estimateMaxPriorityFeePerGas(wagmiConfig)
  // const fees = await estimateFeesPerGas(wagmiConfig)
  const Hash = await writeContract(wagmiConfig, {
    address: contract.mintContractAddress,
    abi: mintContractABI,
    chainId: Number(chainId),
    functionName: 'mintWeUSD',
    args: [amount],
    // gas: gasLimit,
    // maxFeePerGas: fees.maxFeePerGas,
    // maxPriorityFeePerGas,
  })
  const result = await waitForTransactionReceipt(wagmiConfig, { hash: Hash, chainId: Number(chainId) })
  return result
}

/**
 * redeem weusd
 */
export async function redeemWeUSD (params) {
  const { amount } = params
  // console.log('amount', amount)

  const contract = await getContractAddress()
  const chainId = getChainId(wagmiConfig)
  const gasLimit = await estimateGas(wagmiConfig, {
    address: contract.mintContractAddress,
    abi: mintContractABI,
    functionName: 'mintWeUSD',
    args: [amount],
    chainId: Number(chainId),
  })
  console.log('gasLimit', gasLimit)
  // 2. estimate fees
  // const maxPriorityFeePerGas = await estimateMaxPriorityFeePerGas(wagmiConfig)
  // const fees = await estimateFeesPerGas(wagmiConfig)
  const Hash = await writeContract(wagmiConfig, {
    address: contract.mintContractAddress,
    abi: mintContractABI,
    chainId: Number(chainId),
    functionName: 'redeemWeUSD',
    args: [amount],
    // gas: gasLimit,
    // maxFeePerGas: fees.maxFeePerGas,
    // maxPriorityFeePerGas,
  })
  const result = await waitForTransactionReceipt(wagmiConfig, { hash: Hash, chainId: Number(chainId) })
  return result
}
