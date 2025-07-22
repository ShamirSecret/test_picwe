import { AptosSignAndSubmitTransactionInput, AptosSignAndSubmitTransactionOutput, UserResponse } from '@aptos-labs/wallet-standard';
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from '@aptos-labs/ts-sdk';
import config from '@/config';
import errorParse from './error';
import { erc20Abi } from 'viem';
import { createPublicClient, http } from 'viem';
import { mainnet, bsc, base, arbitrum } from 'viem/chains';
import { hashkeyChain, plumeChain } from '@/config/config';


const aptosConfig = new AptosConfig({ network: Network.CUSTOM, fullnode: config.CUSTOMFULLNODE });
const aptos = new Aptos(aptosConfig);

const signAndSubmit = async (transaction: InputTransactionData, signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>) => {
  console.log('transaction', transaction)
  const response: any = await signAndSubmitTransaction(transaction);
  console.log('response', response)
  const res = await aptos.waitForTransaction({ transactionHash: response.hash });
  console.log('res', res)
  return res;


}

const getView = async (payload: InputViewFunctionData) => {

  const res = await aptos.view({
    payload: payload
  });
  return res
}

const getAccountResource = async (args: { accountAddress: string, resourceType: `${string}::${string}::${string}` }) => {
  const accountResource = await aptos.getAccountResource({
    accountAddress: args.accountAddress,
    resourceType: args.resourceType,
  });
  // const events = await aptos.getAccountEventsByEventType({
  //   accountAddress: '0xeaf93e58e22bd2deb1875eb635dfc961c1c9e51c53dceeb5b1cf2936d7566442',  // 目标账户地址
  //   eventType: "0xeaf93e58e22bd2deb1875eb635dfc961c1c9e51c53dceeb5b1cf2936d7566442::weusd_operations::MintedWeUSD",  // 事件类型
  // });
  // const events = await aptos.getEventsByEventHandle({
  //   accountAddress: "0xeaf93e58e22bd2deb1875eb635dfc961c1c9e51c53dceeb5b1cf2936d7566442", // replace with a real account address
  //   creationNumber: 14,
  //   // minimumLedgerVersion: 1, // optional, specify if needed
  // })
  return accountResource;
  // console.log('eventHandles', eventHandles)
}

const getTimestampByVersion = async (version: string) => {
  const block = await aptos.getBlockByVersion({ ledgerVersion: Number(version) });
  return block;
}

const getBalance = async ({ accountAddress, coinType, faMetadataAddress }: { accountAddress: string, coinType?: `${string}::${string}::${string}`, faMetadataAddress?: string }) => {
  const resource = await aptos.getAccountCoinAmount({
    accountAddress: accountAddress, // replace with a real account address
    coinType: coinType,
    faMetadataAddress: faMetadataAddress,
  });
  return resource;
}

// Function to get balance for EVM networks using viem
const getEVMBalance = async ({ 
  accountAddress, 
  tokenAddress, 
  chainId 
}: { 
  accountAddress: string, 
  tokenAddress: string, 
  chainId: number 
}) => {
  try {
    // Get the appropriate chain configuration
    let chain;
    switch (chainId) {
      case 1:
        chain = mainnet;
        break;
      case 56:
        chain = bsc;
        break;
      case 8453:
        chain = base;
        break;
      case 42161:
        chain = arbitrum;
        break;
      case 177:
        chain = hashkeyChain;
        break;
      case 98866:
        chain = plumeChain;
        break;
      default:
        // For other chains, create a basic chain config
        chain = {
          id: chainId,
          name: `Chain ${chainId}`,
          network: `chain-${chainId}`,
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          },
          rpcUrls: {
            default: { http: ['https://rpc.ankr.com/eth'] },
            public: { http: ['https://rpc.ankr.com/eth'] },
          },
        };
    }

    // Create public client for the specific chain
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    // Check if it's a native token (ETH, BNB, etc.)
    if (tokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' || 
        tokenAddress === '0x0000000000000000000000000000000000000000') {
      // Get native token balance
      const balance = await publicClient.getBalance({
        address: accountAddress as `0x${string}`,
      });
      return balance.toString();
    } else {
      // Get ERC20 token balance
      const balance = await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [accountAddress as `0x${string}`],
      });
      return balance.toString();
    }
  } catch (error) {
    console.error('Error getting EVM balance:', error);
    return '0';
  }
}

export {
  signAndSubmit,
  getView,
  getAccountResource,
  getTimestampByVersion,
  getBalance,
  getEVMBalance
}