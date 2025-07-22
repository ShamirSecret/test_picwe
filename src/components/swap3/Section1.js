'use client'
import Image from 'next/image'
import { getImgUrl, cn } from '@/utils'
import { useEffect, useState } from 'react'
import { swapAPI, getOKXQuote, executeOKXSwap, getOKXApproveTransaction } from '@/api/index'
import { message, InputNumber } from 'antd'
import errorParse from '@/utils/error'
import { getView, getAccountResource, signAndSubmit, getTimestampByVersion, getBalance, getEVMBalance } from '@/utils/transaction'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { decMul, truncateString, bigDiv, bigMul, decSub, decAdd } from '@/utils/utils'
import { useModal } from '@/components/ReactQueryClientProvider'
import { useNetwork } from '../NetwrokProvider'
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi'
import Config from '@/config/index'
import { getNetworkTokens } from '@/utils/swap-token'

export const coinList = [
  { name: 'MOVE', icon: getImgUrl('coin_move.png'), faAddress: '0xa', coinType: '0x1::aptos_coin::AptosCoin', decimals: 8 },
  { name: 'WETH', icon: getImgUrl('coin_weth.png'), faAddress: '0x908828f4fb0213d4034c3ded1630bbd904e8a3a6bf3c63270887f0b06653a376', coinType: '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::WETH', decimals: 8 },
  { name: 'USDT', icon: getImgUrl('coin_usdt.png'), faAddress: '0x447721a30109c662dde9c73a0c2c9c9c459fb5e5a9c92f03c50fa69737f5d08d', coinType: '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDT', decimals: 6 },
  { name: 'USDC', icon: getImgUrl('coin_usdc.png'), faAddress: '0x83121c9f9b0527d1f056e21a950d6bf3b9e9e2e8353d0e95ccea726713cbea39', coinType: '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC', decimals: 6 },
  { name: 'WBTC', icon: getImgUrl('coin_wbtc.png'), faAddress: '0xb06f29f24dde9c6daeec1f930f14a441a8d6c0fbea590725e88b340af3e1939c', coinType: '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::WBTC', decimals: 8 },
  // { name: 'PIPI', icon: getImgUrl('coin_pipi.png'), faAddress: '0xf5670624772bf9f5804e8d21d6a77d30d210fe84f28f5c095b5eb64e479c0d03', decimals: 6 },
  { name: 'WEUSD', icon: getImgUrl('coin_weusd.png'), faAddress: '0x22d0b72b5b3bad3bef468f7f5d9abf36561176560ffeeda7d4cf58a77ef47d1', decimals: 6 },
]

export default function Section () {
  const { isModalOpen, setIsModalOpen } = useModal()
  const { account, connected, wallet, network, changeNetwork, connect, signAndSubmitTransaction } = useWallet()
  const { isConnected, address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [receicAmount, setReceicAmount] = useState('0')
  const [loading, setLoading] = useState(false)
  const [payBalance, setPayBalance] = useState(0)
  const [receicBalance, setReceicBalance] = useState(0)
  const [payload, setPayLoad] = useState({})

  const [isOpenSetting, setIsOpenSetting] = useState(false)

  const slippageList = [
    { label: '0.05%', value: 0.05 },
    { label: '0.1%', value: 0.1 },
    { label: '0.5%', value: 0.5 },
    { label: '1%', value: 1 },
  ]

  const [slippageValue, setSlippageValue] = useState(0.5)

  const [amount, setAmount] = useState(0)

  const [fromCoin, setFromCoin] = useState(coinList[0])
  const [toCoin, setToCoin] = useState(coinList[1])
  const [isManualSelection, setIsManualSelection] = useState(false)
  const { setGlobalNetwork, globalNetwork, setConnectModalOpen } = useNetwork()

  const { switchChain } = useSwitchChain()
  const wagmiAccount = useAccount()

  useEffect(() => {
    // Handle network switching and wallet connection
    if (globalNetwork?.chainId) {
      // For EVM networks, switch chain and update fromCoin
      if (connected || wagmiAccount.isConnected) {
        switchChain({ chainId: globalNetwork.chainId })
        changeNetwork(globalNetwork)
        setGlobalNetwork(globalNetwork)
      }
    } else if (globalNetwork?.name === 'Movement') {
      if (connected || wagmiAccount.isConnected) {
        changeNetwork(globalNetwork)
        setGlobalNetwork(globalNetwork)
      }
    }
  }, [globalNetwork, wagmiAccount, connect])

  // Separate effect to handle token updates when network changes
  useEffect(() => {
    if (globalNetwork?.chainId) {
      const tokens = getNetworkTokens(globalNetwork)
      setFromCoin(tokens[0])
      setToCoin(tokens[1] || tokens[0])
    } else if (globalNetwork?.name === 'Movement') {
      setFromCoin(coinList.find(c => c.name === 'MOVE'))
      setToCoin(coinList.find(c => c.name === 'WETH'))
    }
  }, [globalNetwork])

  useEffect(() => {
    if (globalNetwork?.chainId && (connected || wagmiAccount.isConnected)) {
      switchChain({ chainId: globalNetwork.chainId })
    }
  }, [connected, wagmiAccount.isConnected])

  useEffect(() => {
    setIsManualSelection(false)
  }, [globalNetwork?.chainId, globalNetwork?.name])

  useEffect(() => {
    setIsManualSelection(false)
  }, [globalNetwork])

  const quote = () => {
    const params = {
      sender: account?.address || undefined,
      srcAsset: fromCoin.faAddress,
      dstAsset: toCoin.faAddress,
      amount: bigMul(amount, 10 ** fromCoin.decimals),
      slippage: bigMul(slippageValue, 100), // 100 = 1%
    }
    if (fromCoin.faAddress === '0xa') {
      swapAPI(params).then(res => {
        console.log('res', res)
        setReceicAmount(bigDiv(res.data.dstAmount, 10 ** toCoin.decimals))
        setPayLoad(res.data.tx)
      })
    }
  }

  const getTokenConfig = (coinName, chainId) => {
    const networkConfig = Config.networkList.find(item => item.chainId === chainId)
    if (!networkConfig) return null
    const tokenMap = {
      USDT: { address: networkConfig.usdtAddress, decimals: networkConfig.usdtDecimals },
      USDC: { address: networkConfig.usdcAddress, decimals: networkConfig.usdcDecimals },
      WEUSD: { address: networkConfig.weusdAddress, decimals: networkConfig.weusdDecimals },
      WETH: { address: networkConfig.wethAddress, decimals: networkConfig.wethDecimals },
      WBTC: { address: networkConfig.wbtcAddress, decimals: networkConfig.wbtcDecimals },
      // add value for BNB, BASE, ARBITRUM
      BNB: { address: networkConfig.bnbAddress, decimals: networkConfig.bnbDecimals },
      BASE: { address: networkConfig.baseAddress, decimals: networkConfig.baseDecimals },
      ARB: { address: networkConfig.arbitrumAddress, decimals: networkConfig.arbitrumDecimals },
    }
    return tokenMap[coinName] || null
  }

  // Function to get quote from OKX DEX
  const getOKXQuoteData = async () => {
    try {
      if (fromCoin.name === 'MOVE' || toCoin.name === 'MOVE') {
        return
      }
      // Get current network from global network state
      const currentNetwork = globalNetwork
      if (!currentNetwork?.chainId) {
        return
      }
      // Get token addresses and decimals from current network config
      const networkConfig = Config.networkList.find(item => item.chainId === currentNetwork.chainId)
      if (!networkConfig) {
        console.log('Network not supported for OKX DEX')
        message.error('Network not supported for OKX DEX')
        return
      }
      const fromTokenConfig = getTokenConfig(fromCoin.name, currentNetwork.chainId)
      const toTokenConfig = getTokenConfig(toCoin.name, currentNetwork.chainId)

      // if (!fromTokenConfig?.address || !toTokenConfig?.address || fromTokenConfig.address === '0x0000000000000000000000000000000000000000') {
      //   console.log('Token not supported on this network for OKX DEX')
      //   message.error('Token not supported on this network for OKX DEX')
      //   return
      // }
      if (!fromTokenConfig?.address || !toTokenConfig?.address) {
        // console.log('Token not supported on this network for OKX DEX')
        // message.error('Token not supported on this network for OKX DEX')
        return
      }
      const okxParams = {
        chainId: currentNetwork.chainId,
        amount: bigMul(amount, 10 ** fromTokenConfig.decimals),
        fromTokenAddress: fromTokenConfig.address,
        toTokenAddress: toTokenConfig.address,
        slippage: bigMul(slippageValue, 100),
        // userAddress: account?.address || undefined,
      }

      const response = await getOKXQuote(okxParams)
      if (response.code === '0') {
        // Success
        const quoteData = response.data[0]
        // Set the received amount using network-specific decimals
        setReceicAmount(bigDiv(quoteData.toTokenAmount, 10 ** toTokenConfig.decimals))
      } else {
        console.error('OKX API Error:', response.msg)
        message.error(errorParse(response.msg))
        setReceicAmount('0')
      }
    } catch (error) {
      console.error('Error getting OKX quote:', error)
      message.error(errorParse(error.data.msg))
      setReceicAmount('0')
    }
  }
  useEffect(() => {
    if (amount && amount !== '0') {
      if (globalNetwork?.name !== 'Movement') {
        getOKXQuoteData()
      } else {
        quote()
      }
    }
  }, [amount, connected, fromCoin, toCoin, globalNetwork, slippageValue])

  useEffect(() => {
    getPayBalance()
    getReceicBalance()
  }, [connected, isConnected, fromCoin, toCoin])

  const isAptos = globalNetwork?.name === 'Movement'
  const isEVM = !isAptos
  const isLoggedIn = (isAptos && connected) || (isEVM && isConnected)
  const getPayBalance = async () => {
    if (!isLoggedIn) return '0'
    if (globalNetwork?.name === 'Movement') {
      const res = await getBalance({ accountAddress: account.address, faMetadataAddress: fromCoin.faAddress })
      setPayBalance(bigDiv(res, 10 ** fromCoin.decimals))
    } else {
      const fromTokenConfig = getTokenConfig(fromCoin.name, globalNetwork?.chainId)
      if (!fromTokenConfig) return

      const res = await getEVMBalance({
        accountAddress: address,
        tokenAddress: fromTokenConfig.address,
        chainId: globalNetwork.chainId,
      })
      setPayBalance(bigMul(res, 10 ** fromTokenConfig.decimals))
      // setPayBalance(res)
    }
  }
  const getReceicBalance = async () => {
    if (!connected || isConnected) return '0'
    if (globalNetwork?.name === 'Movement') {
      const res = await getBalance({ accountAddress: account.address, faMetadataAddress: toCoin.faAddress })
      setReceicBalance(bigDiv(res, 10 ** toCoin.decimals))
    } else {
      const toTokenConfig = getTokenConfig(toCoin.name, globalNetwork?.chainId)
      if (!toTokenConfig) return

      // Use getEVMBalance for EVM networks
      const res = await getEVMBalance({
        accountAddress: address,
        tokenAddress: toTokenConfig.address,
        chainId: globalNetwork.chainId,
      })
      setReceicBalance(bigDiv(res, 10 ** toTokenConfig.decimals))
    }
  }
  // const handleSWAP = async () => {
  //   if (!connected) {
  //     setIsModalOpen(true)  //     return
  //   }
  //   try {
  //     if (payload.function) {
  //       setLoading(true)
  //       // const txnPayload = await routex.swapWithRouting(routeInfo, 5);
  //       // console.log('txnPayload', txnPayload)
  //       const transaction = {
  //         data: payload,
  //       }
  //       const res = await signAndSubmit(transaction, signAndSubmitTransaction)
  //       message.success('swap success')
  //       console.log('swap success')
  //       getPayBalance()
  //       getReceicBalance()
  //       setPayLoad({})
  //     }
  //   } catch (error) {
  //     message.error(errorParse(error))
  //     console.log('error', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const swapButtonStatus = !amount || amount === '0'
  const handleSWAP = async () => {
    if ((isAptos && !connected) || (isEVM && !isConnected)) {
      if (isAptos) {
        setIsModalOpen(true)
      } else {
        setConnectModalOpen(true)
      }
      return
    }

    if (!amount || amount === '0') {
      message.error('Please enter an amount to swap')
      return
    }

    try {
      setLoading(true)

      if (isAptos) {
        // Movement network swap
        if (payload.function) {
          const transaction = {
            data: payload,
          }
          const res = await signAndSubmit(transaction, signAndSubmitTransaction)
          message.success('Swap successful')
          console.log('swap success')
          getPayBalance()
          getReceicBalance()
          setPayLoad({})
        } else {
          message.error('No swap payload available')
        }
      } else {
        if (!walletClient) return console.error('Wallet not connected')
        // EVM network swap using OKX DEX
        const fromTokenConfig = getTokenConfig(fromCoin.name, globalNetwork.chainId)
        const toTokenConfig = getTokenConfig(toCoin.name, globalNetwork.chainId)

        if (!fromTokenConfig?.address || !toTokenConfig?.address) {
          message.error('Token not supported on this network')
          return
        }
        // Check and handle approval for non-native tokens
        if (fromTokenConfig.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          try {
            const approvalAmount = bigMul(amount, 10 ** fromTokenConfig.decimals).toString()
            const approvalHandled = await getOKXApproveTransaction({
              chainIndex: globalNetwork.chainId.toString(),
              chainId: globalNetwork.chainId.toString(),
              tokenContractAddress: fromTokenConfig.address,
              approveAmount: approvalAmount,
            })

            if (approvalHandled) {
              console.log('Token approval completed')
            }
          } catch (approvalError) {
            console.error('Approval error:', approvalError)
            message.error('Token approval failed: ' + errorParse(approvalError))
            return
          }
        }
        // Swap parameters
        const swapParams = {
          chainId: globalNetwork.chainId.toString(),
          amount: bigMul(amount, 10 ** fromTokenConfig.decimals).toString(),
          swapMode: 'exactIn', // Default mode
          fromTokenAddress: fromTokenConfig.address,
          toTokenAddress: toTokenConfig.address,
          slippage: (slippageValue / 100).toString(),
          userWalletAddress: address,
          gasLevel: 'average', // Default gas level
          // Fee-related parameters
          fromTokenReferrerWalletAddress: process.env.NEXT_PUBLIC_TOKEN_REFERRER_WALLET_ADDRESS, // Optional: Referrer address for commissions based on fromToken
          feePercent: '1.5', // Optional: Commission percentage (0-3%, max 9 decimal points)
        }

        const swapResponse = await executeOKXSwap(swapParams)

        if (swapResponse.code === '0' && swapResponse.data[0]?.tx) {
          const txData = swapResponse.data[0].tx

          const txHash = await walletClient.sendTransaction({
            to: txData.to,
            data: txData.data,
            value: txData.value ? BigInt(txData.value) : 0n,
          })
          console.log('txHash', txHash)

          // Refresh balances
          getPayBalance()
          getReceicBalance()
        } else {
          message.error(swapResponse.msg || 'Swap failed')
        }
      }
    } catch (error) {
      console.error('Swap error:', error)
      message.error(errorParse(error))
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (type, item) => {
    if (type === 'from') {
      setFromCoin(item)
      setIsManualSelection(true) // Mark as manual selection
    }
    if (type === 'to') {
      setToCoin(item)
    }
    setPayLoad({})
  }

  const handleSwitchCoins = () => {
    setFromCoin(toCoin)
    setToCoin(fromCoin)
    setAmount(receicAmount)
    setReceicAmount(amount)
  }

  return <section id="homeSwap" className="w-full min-h-screen flex overflow-hidden
    pt-15
    md:pt-0
  " style={{
    background: `url(${getImgUrl('swap_bg.png')}) no-repeat bottom center / cover`,
  }}>
    <div className="container mx-auto w-full flex-grow flex flex-col items-center justify-center">
      {/* <h1 className='text-white text-center text-stroke font-ms
        text-[40px]
        md:text-[64px]
        lg:text-[72px]
        xl:text-[80px]
        2xl:text-[90px]
      '>
        PICWE SWAP
      </h1> */}

      {/* <div className='w-full max-w-[652px] mx-auto bg-[#22252E]
        mt-12 rounded-[15px] p-3 pb-5
        md:mt-15 md:rounded-[18px] md:p-3.5 md:pb-8
        lg:mt-18 lg:rounded-[22px] lg:p-4 lg:pb-9
        xl:mt-20 xl:rounded-[26px] xl:p-5 xl:pb-10
        2xl:mt-[90px] 2xl:rounded-[30px] 2xl:p-6 2xl:pb-11
      '> */}
        <div className='w-full max-w-[652px] mx-auto bg-[#22252E]
        rounded-[15px] p-3 pb-5
        md:rounded-[18px] md:p-3.5 md:pb-8
        lg:rounded-[22px] lg:p-4 lg:pb-9
        xl:rounded-[26px] xl:p-5 xl:pb-10
        2xl:rounded-[30px] 2xl:p-6 2xl:pb-11
        border border-[#3A3A3A]
      '>
        <div className='w-full flex justify-between items-center'>
          <span className='font-open-sans font-semibold
            text-base
          '>Picwe Swap</span>
        </div>

        <div className='w-full flex flex-col gap-1 text-white relative
          mt-2
          md:mt-3
          lg:mt-3.5
          xl:mt-4
          2xl:mt-5
        '>
          <div className='w-full bg-[#1A1C22] relative
            px-4 py-2.5 rounded-[15px]
            md:px-4 md:py-3 md:rounded-[18px] md:mb-[13px]
            lg:px-5 lg:py-3.5 lg:rounded-[22px] lg:mb-[13px]
            xl:px-5 xl:py-4 xl:rounded-[26px] xl:mb-[13px]
            2xl:px-6 2xl:py-4.5 2xl:rounded-[30px] 2xl:mb-[13px]
          '>
            <h2 className='
              text-xs
            '>
              YOU PAY
            </h2>
            <div className='flex items-center justify-between
              my-2 gap-3.5
              md:my-2.5 md:gap-4
              lg:my-3 lg:gap-4.5
              xl:my-3.5 xl:gap-5
              text-base
            '>
              <SelectCoin currentCoin={fromCoin} setCurrentCoin={(item) => { handleSelect('from', item) }} />

              <InputNumber className='flex-grow outline-none bg-transparent text-white text-right !leading-1
                text-base h-7.5
                md:h-9
                lg:h-10
                xl:h-11
                2xl:h-12.5
              '
                changeOnWheel={false}
                controls={false}
                value={amount} min={0}
                onChange={(value) => {
                  setAmount(value)
                }}
              />
            </div>

            <p className='font-open-sans text-[#8A8A8A]
              text-xs
              md:h-[20px]
              xl:h-[37px]
            '>
              Balance: {payBalance}
            </p>
            <div className={cn('w-full overflow-hidden transition-all duration-300 pb-[10px]')}>
              <div className='w-full flex items-center font-open-sans overflow-hidden'>
                {
                  slippageList.map((item, index) => (
                    <button key={index} className={cn('flex-1 h-full flex items-center justify-center transform-colors duration-300 bg-[#1F222A] text-[#8A8A8A]',
                      `rounded-[10px] mr-[7px]
                        md:rounded-[11px] md:h-[28px] md:mr-[7px]
                        lg:rounded-[13px] lg:h-[42px] lg:mr-[10px]
                        xl:rounded-[15px] xl:h-[52px] xl:mr-[13px]
                        text-xs
                        `,
                      slippageValue === item.value ? 'border border-[#FFD100]' : '',
                    )} onClick={() => {
                      setSlippageValue(item.value)
                    }}>
                      {item.label}
                    </button>
                  ))
                }
                <div className='h-full flex items-center justify-end border border-[#3A3A3A] bg-[#1C1C1C]
                    rounded-sm
                    md:rounded md:h-[28px]
                    lg:rounded-[6px] lg:h-[42px]
                    xl:rounded-[8px] xl:h-[52px]
                    w-20 md:w-auto md:flex-1
                  text-[#858585] transform-colors duration-300 text-xs'>
                  <InputNumber className='w-full h-full outline-none bg-transparent text-white text-right text-xs'
                    changeOnWheel={false}
                    controls={false}
                    value={slippageValue} min={0}
                    onChange={(value) => {
                      setSlippageValue(value)
                    }}
                  />
                  <span className='flex-none px-2 relative top-[1px]'>%</span>
                </div>
              </div>
            </div>

            <div className="
              w-8 h-8 absolute left-1/2  -translate-x-1/2 z-10
              md:w-8 md:h-8 md:bottom-[-4]
              lg:w-8 lg:h-8 lg:bottom-[-4]
              xl:w-10 xl:h-10 xl:bottom-[-4]
              2xl:w-11 2xl:h-11 2xl:bottom-[-4]
              cursor-pointer
            "
            onClick={handleSwitchCoins}
            >
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* 背景圆 */}
                <circle cx="32" cy="32" r="32" fill="#11131A" />
                {/* 中间垂直线 */}
                <line
                  x1="32"
                  y1="20"
                  x2="32"
                  y2="36"
                  stroke="#C7CAD1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* 左斜线 */}
                <line
                  x1="24"
                  y1="32"
                  x2="32"
                  y2="40"
                  stroke="#C7CAD1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* 右斜线 */}
                <line
                  x1="40"
                  y1="32"
                  x2="32"
                  y2="40"
                  stroke="#C7CAD1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className='w-full bg-[#1A1C22] relative
            px-4 py-2.5 rounded-[15px]
            md:px-4 md:py-3 md:rounded-[18px]
            lg:px-5 lg:py-3.5 lg:rounded-[22px]
            xl:px-5 xl:py-4 xl:rounded-[26px]
            2xl:px-6 2xl:py-4.5 2xl:rounded-[30px]
          '>
            <h2 className='
              text-xs
            '>
              To Receive
            </h2>

            <div className='flex items-center justify-between
              my-2 gap-3.5
              md:my-2.5 md:gap-4
              lg:my-3 lg:gap-4.5
              xl:my-3.5 xl:gap-5
            '>
              <SelectCoin currentCoin={toCoin} setCurrentCoin={(item) => { handleSelect('to', item) }} />
              <span className='!leading-1 text-right
                text-base h-7.5
                 md:h-9
                 lg:h-10
                 xl:h-11
                 2xl:h-12.5
              '>
                {receicAmount}
              </span>
            </div>

            <p className='font-open-sans text-[#8A8A8A]
              text-xs
              md:text-base
            '>
              Balance: {receicBalance}
            </p>
          </div>

          {/* <svg className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-8 h-8
            md:w-8 md:h-8
            lg:w-8 lg:h-8
            xl:w-10 xl:h-10
            2xl:w-11 2xl:h-11
          ' width="61" height="61" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="60" height="60" rx="9.5" fill="#1C1C1C" stroke="#444444" />
            <path d="M31 18L31 42" stroke="#878787" />
            <path d="M20 31L31 42L42 31" stroke="#878787" />
          </svg> */}

        </div>

        {/* <button onClick={handleSWAP} className='w-full  flex items-center justify-center rounded-full relative
          bg-[#FFD100] text-black hover:bg-black hover:text-[#FFD100] transition-all duration-300
          mt-3 h-10 text-base
          md:mt-6 md:h-14
          lg:mt-7 lg:h-16
          xl:mt-8 xl:h-18
          2xl:mt-9 2xl:h-20
        '>

        </button> */}

        <button
         className="w-full bg-[#FFD100] text-black text-base font-semibold rounded-full py-4 hover:bg-[#ffe066] transition mt-3 disabled:opacity-80 disabled:cursor-not-allowed"
         onClick={handleSWAP}
         disabled={loading || (isLoggedIn && swapButtonStatus)}
       >
       <span className="flex items-center justify-center gap-2">
         {loading && <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full"></div>}
         {loading ? 'Swapping...' : isLoggedIn ? 'Swap' : 'Connect Wallet'}
       </span>
     </button>
      </div>
    </div>
  </section>
}

function SelectCoin ({ currentCoin, setCurrentCoin }) {
  const { globalNetwork } = useNetwork()
  const filterList = getNetworkTokens(globalNetwork)
  return <div className='flex-none relative group'>
    <div className='flex items-center justify-center border border-[#3A3A3A] bg-[#1C1C1C] font-open-sans
    min-w-30 px-4 h-10 gap-1.5 rounded-[6px]
    md:w-[140px] md:h-11 md:gap-2 md:rounded-[6px]
    lg:w-[150px] lg:h-12 lg:gap-2.5 lg:rounded-[8px]
    xl:w-48 xl:h-12.5 xl:gap-3 xl:rounded-[10px]
  '>
      <Image className='
      w-7 h-7
      md:w-7.5 md:h-7.5
      lg:w-8 lg:h-8
    ' src={currentCoin.icon} alt={currentCoin.name} width={40} height={40} />
      <span className='
      text-sm
    '>
        {currentCoin.name}
      </span>
      <svg className='group-hover:rotate-180 transition-all duration-200
      w-3 h-1.5
      md:w-3.5 md:h-1.5
      lg:w-4 lg:h-2
    ' width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 0.447141L7.76667 6.93082L1 0.447265" stroke="#BBBBBB" />
      </svg>
    </div>
    <div className='absolute z-10 left-0 top-full w-full border-[#3A3A3A] bg-[#1C1C1C] font-open-sans overflow-hidden transition-all duration-200
    h-0 group-hover:h-[252px] group-hover:border
    rounded-[10px] overflow-y-scroll
  '>
      {
        filterList.map(item => (
          <div key={item.name} className='w-full h-12.5 flex items-center cursor-pointer
          text-sm gap-2.5 px-3
          md:gap-3 md:px-3.5
          lg:gap-3.5 lg:px-4
        ' onClick={() => setCurrentCoin(item)}>
            <Image className='
            w-7 h-7
            md:w-7.5 md:h-7.5
            lg:w-8 lg:h-8
          ' src={item.icon} alt={item.name} width={40} height={40} />
            <span className=''>
              {item.name}
            </span>
          </div>
        ))
      }
    </div>
  </div>
}
