'use client'
import Image from 'next/image'
import { getImgUrl, cn } from '@/utils'
import { useEffect, useState } from 'react'
import { swapAPI } from '@/api/index'
import { message, InputNumber } from 'antd'
import errorParse from '@/utils/error'
import { getView, getAccountResource, signAndSubmit, getTimestampByVersion, getBalance } from '@/utils/transaction'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { decMul, truncateString, bigDiv, bigMul, decSub, decAdd } from '@/utils/utils'
import { useModal } from '@/components/ReactQueryClientProvider'

const coinList = [
  { name: 'MOVE', icon: getImgUrl('coin_move.png'), faAddress: '0xa', coinType: '0x1::aptos_coin::AptosCoin', decimals: 8 },
  { name: 'WETH', icon: getImgUrl('coin_weth.png'), faAddress: '0x908828f4fb0213d4034c3ded1630bbd904e8a3a6bf3c63270887f0b06653a376', coinType: '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::WETH', decimals: 8 },
  { name: 'USDT', icon: getImgUrl('coin_usdt.png'), faAddress: '0x447721a30109c662dde9c73a0c2c9c9c459fb5e5a9c92f03c50fa69737f5d08d', coinType: '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDT', decimals: 6 },
  { name: 'USDC', icon: getImgUrl('coin_usdc.png'), faAddress: '0x83121c9f9b0527d1f056e21a950d6bf3b9e9e2e8353d0e95ccea726713cbea39', coinType: '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC', decimals: 6 },
  { name: 'WBTC', icon: getImgUrl('coin_wbtc.png'), faAddress: '0xb06f29f24dde9c6daeec1f930f14a441a8d6c0fbea590725e88b340af3e1939c', coinType: '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::WBTC', decimals: 8 },
  // { name: 'PIPI', icon: getImgUrl('coin_pipi.png'), faAddress: '0xf5670624772bf9f5804e8d21d6a77d30d210fe84f28f5c095b5eb64e479c0d03', decimals: 6 },
  { name: 'WEUSD', icon: getImgUrl('coin_weusd.png'), faAddress: '0x22d0b72b5b3bad3bef468f7f5d9abf36561176560ffeeda7d4cf58a77ef47d1', decimals: 6 },
]

export default function Section() {
  const { isModalOpen, setIsModalOpen } = useModal()
  const { account, connected, wallet, network, changeNetwork, connect, signAndSubmitTransaction } = useWallet()
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

  const quote = () => {
    const params = {
      sender: account?.address || undefined,
      srcAsset: fromCoin.faAddress,
      dstAsset: toCoin.faAddress,
      amount: bigMul(amount, 10 ** fromCoin.decimals),
      slippage: bigMul(slippageValue, 100), // 100 = 1%
    }
    swapAPI(params).then(res => {
      console.log('res', res)
      setReceicAmount(bigDiv(res.data.dstAmount, 10 ** toCoin.decimals))
      setPayLoad(res.data.tx)
    })
  }

  useEffect(() => {
    if (amount && amount != '0') {
      quote()
    }
  }, [amount, connected, fromCoin, toCoin])

  useEffect(() => {
    getPayBalance()
    getReceicBalance()
  }, [connected, fromCoin, toCoin])

  const getPayBalance = async () => {
    if (!connected) return '0'
    const res = await getBalance({ accountAddress: account.address, faMetadataAddress: fromCoin.faAddress })
    setPayBalance(bigDiv(res, 10 ** fromCoin.decimals))
  }

  const getReceicBalance = async () => {
    if (!connected) return '0'
    const res = await getBalance({ accountAddress: account.address, faMetadataAddress: toCoin.faAddress })
    setReceicBalance(bigDiv(res, 10 ** toCoin.decimals))
  }

  const handleSWAP = async () => {
    if (!connected) {
      setIsModalOpen(true)
      return
    }
    try {
      if (payload.function) {
        setLoading(true)
        // const txnPayload = await routex.swapWithRouting(routeInfo, 5);
        // console.log('txnPayload', txnPayload)
        const transaction = {
          data: payload,
        }
        const res = await signAndSubmit(transaction, signAndSubmitTransaction)
        message.success('swap success')
        console.log('swap success')
        getPayBalance()
        getReceicBalance()
        setPayLoad({})
      }
    } catch (error) {
      message.error(errorParse(error))
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (type, item) => {
    if (type == 'from') {
      setFromCoin(item)
    }
    if (type == 'to') {
      setToCoin(item)
    }
    setPayLoad({})
  }

  return <section id="homeSwap" className="w-full min-h-screen flex overflow-hidden
    pt-15
    md:pt-0
  " style={{
      background: `url(${getImgUrl('swap_bg.png')}) no-repeat bottom center / cover`,
    }}>
    <div className="container mx-auto w-full flex-grow flex flex-col items-center justify-center">
      <div className='w-full max-w-[652px] mx-auto bg-[#22252E]
        mt-12 rounded-[15px] p-3 pb-5
        md:mt-15 md:rounded-[18px] md:p-3.5 md:pb-8
        lg:mt-18 lg:rounded-[22px] lg:p-4 lg:pb-9
        xl:mt-20 xl:rounded-[26px] xl:p-5 xl:pb-10
        2xl:mt-[90px] 2xl:rounded-[30px] 2xl:p-6 2xl:pb-11
      '>
        <div className='w-full flex justify-between items-center'>
          <span className='font-open-sans font-semibold
            text-base
            md:text-lg
            lg:text-xl
            xl:text-2xl
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
              md:text-sm
              lg:text-base
              xl:text-lg
            '>
              YOU PAY
            </h2>
            <div className='flex items-center justify-between
              my-2 gap-3.5
              md:my-2.5 md:gap-4
              lg:my-3 lg:gap-4.5
              xl:my-3.5 xl:gap-5
            '>
              <SelectCoin currentCoin={fromCoin} setCurrentCoin={(item) => { handleSelect('from', item) }} />

              <InputNumber className='flex-grow outline-none bg-transparent text-white text-right !leading-1
                text-[30px] h-7.5
                md:text-[36px] md:h-9
                lg:text-[40px] lg:h-10
                xl:text-[44px] xl:h-11
                2xl:text-[50px] 2xl:h-12.5
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
              text-[10px]
              md:text-base md:h-[20px]
              lg:h-[26px]
              xl:text-base xl:h-[37px]
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
                  text-[#858585] transform-colors duration-300'>
                  <InputNumber className='w-full h-full outline-none bg-transparent text-white text-right'
                    changeOnWheel={false}
                    controls={false}
                    value={slippageValue} min={0}
                    onChange={(value) => {
                      setSlippageValue(value)
                    }}
                  />
                  <span className='flex-none px-2'>%</span>
                </div>
              </div>
            </div>

            <div className="
              w-8 h-8 absolute left-1/2  -translate-x-1/2 z-10
              md:w-8 md:h-8 md:bottom-[-4]
              lg:w-8 lg:h-8 lg:bottom-[-4]
              xl:w-10 xl:h-10 xl:bottom-[-4]
              2xl:w-11 2xl:h-11 2xl:bottom-[-4]
            "
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
              md:text-sm
              lg:text-base
              xl:text-lg
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
                text-[30px] h-7.5
                md:text-[36px] md:h-9
                lg:text-[40px] lg:h-10
                xl:text-[44px] xl:h-11
                2xl:text-[50px] 2xl:h-12.5
              '>
                {receicAmount}
              </span>
            </div>

            <p className='font-open-sans text-[#8A8A8A]
              text-[10px]
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

        <button onClick={handleSWAP} className='w-full  flex items-center justify-center rounded-full relative
          bg-[#FFD100] text-black hover:bg-black hover:text-[#FFD100] transition-all duration-300
          mt-3 h-10 text-lg
          md:mt-6 md:h-14 md:text-xl
          lg:mt-7 lg:h-16 lg:text-2xl
          xl:mt-8 xl:h-18 xl:text-[26px]
          2xl:mt-9 2xl:h-20 2xl:text-[28px]
        '>
          <span>
            {connected ? 'Get Started' : 'Connect Wallet'}
          </span>
        </button>
      </div>
    </div>
  </section>
}

function SelectCoin({ currentCoin, setCurrentCoin }) {
  return <div className='flex-none relative group'>
    <div className='flex items-center justify-center border border-[#3A3A3A] bg-[#1C1C1C] font-open-sans
    w-30 h-10 gap-1.5 rounded-[6px]
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
      md:text-base
      lg:text-lg
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
        coinList.map(item => (
          <div key={item.name} className='w-full h-12.5 flex items-center cursor-pointer
          text-sm gap-2.5 px-3
          md:text-base md:gap-3 md:px-3.5
          lg:text-lg lg:gap-3.5 lg:px-4
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
