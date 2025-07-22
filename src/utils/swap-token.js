'use client'

import { coinList } from '@/components/swap3/Section1'
import { getImgUrl } from '@/utils'
import Config from '@/config/index'

const nativeToken = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

// Mapping chainId to native token info
const nativeTokenMap = {
  56: { name: 'BNB', icon: 'coin_bsc.png' },
  8453: { name: 'BASE', icon: 'coin_base.png' },
  42161: { name: 'ARB', icon: 'coin_arb.png' },
  177: { name: 'HSK', icon: 'coin_hashkey.png' },
  98866: { name: 'PLUME', icon: 'coin_plume.png' },
}

// Token keys to check from Config with their display names and icons
const tokenList = [
  { key: 'weth', name: 'WETH', icon: 'coin_weth.png' },
  { key: 'usdt', name: 'USDT', icon: 'coin_usdt.png' },
  { key: 'usdc', name: 'USDC', icon: 'coin_usdc.png' },
  { key: 'wbtc', name: 'WBTC', icon: 'coin_wbtc.png' },
  { key: 'weusd', name: 'WEUSD', icon: 'coin_weusd.png' },
]

export const getNetworkTokens = (network) => {
  if (network?.name === 'Movement') {
    return coinList
  }

  const networkTokens = []

  // Add native token if mapping exists
  const native = nativeTokenMap[network?.chainId]
  if (native) {
    networkTokens.push({
      name: native.name,
      icon: getImgUrl(native.icon),
      faAddress: nativeToken,
      decimals: 18,
    })
  }

  const networkConfig = Config.networkList.find(item => item.chainId === network?.chainId)
  if (networkConfig) {
    tokenList.forEach(({ key, name, icon }) => {
      // Skip WBTC for Base network (chainId: 8453)
      if (network?.chainId === 8453 && key === 'wbtc') {
        return
      }

      const address = networkConfig[`${key}Address`]
      const decimals = networkConfig[`${key}Decimals`]

      if (address && address !== nativeToken) {
        networkTokens.push({
          name,
          icon: getImgUrl(icon),
          faAddress: address,
          decimals,
        })
      }
    })
  }

  return networkTokens
}
