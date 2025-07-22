import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, bsc, arbitrum, base } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit'
import { defineChain } from 'viem'

// Get projectId from https://cloud.reown.com
export const projectId = 'cc0f18249faf2362bc278cad20cf4139' // 测试环境

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// 定义 HashKey Chain - 完整配置
export const hashkeyChain = defineChain({
  id: 177,
  name: 'HashKey Chain',
  nativeCurrency: { 
    name: 'HSK', 
    symbol: 'HSK', 
    decimals: 18 
  },
  rpcUrls: {
    default: { 
      http: ['https://mainnet.hsk.xyz'] 
    },
  },
  blockExplorers: {
    default: { 
      name: 'HashKey Chain Explorer', 
      url: 'https://explorer.hsk.xyz' 
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
  testnet: false,
  custom: {
    chain: 'HSK',
    icon: 'hashkey',
    features: ['EIP155', 'EIP1559'],
    infoURL: 'https://docs.hsk.xyz',
    shortName: 'hsk',
    networkId: 177,
    slip44: 60,
  }
})

// 定义 Plume Chain - 完整配置
export const plumeChain = defineChain({
  id: 98866,
  name: 'Plume',
  nativeCurrency: { 
    name: 'PLUME', 
    symbol: 'PLUME', 
    decimals: 18 
  },
  rpcUrls: {
    default: { 
      http: ['https://rpc.plume.org'],
      webSocket: ['wss://rpc.plume.org']
    },
  },
  blockExplorers: {
    default: { 
      name: 'Plume Explorer', 
      url: 'https://explorer.plume.org' 
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
  sourceId: 1, // L2 链，父链是以太坊主网
  testnet: false,
  custom: {
    chain: 'PLUME',
    icon: 'plume',
    features: ['EIP155', 'EIP1559'],
    infoURL: 'https://docs.plume.org',
    shortName: 'plume',
    networkId: 98866,
    slip44: 60,
    parent: {
      type: 'L2',
      chain: 'eip155-1',
      bridges: []
    }
  }
})

export const networks = [bsc, arbitrum, base, hashkeyChain, plumeChain]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export default wagmiAdapter.wagmiConfig