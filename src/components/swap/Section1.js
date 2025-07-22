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
  { name: 'PIPI', icon: getImgUrl('coin_pipi.png'), faAddress: '0xf5670624772bf9f5804e8d21d6a77d30d210fe84f28f5c095b5eb64e479c0d03', decimals: 6 },
  { name: 'WEUSD', icon: getImgUrl('coin_weusd.png'), faAddress: '0xad8a8c8c15e11ea5ccefae1808d4c37dd3888e3545febf5a928215b73bf3c4b0', decimals: 6 },
]

export default function Section () {
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
    pt-15 pb-25
    md:pt-0 md:pb-[160px]
    lg:pb-[200px]
    xl:pb-[220px]
    2xl:pb-60
  " style={{
    background: `url(${getImgUrl('swap_bg.png')}) no-repeat bottom center / cover`,
  }}>
    <div className="container mx-auto w-full flex-grow flex flex-col items-center justify-center">
      <h1 className='text-white text-center text-stroke font-ms
        text-[40px]
        md:text-[64px]
        lg:text-[72px]
        xl:text-[80px]
        2xl:text-[90px]
      '>
        PICWE SWAP
      </h1>

      <div className='w-full max-w-[630px] mx-auto bg-white
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
          '>Swap</span>
          <button className={cn('transform-colors duration-300',
            isOpenSetting ? 'text-[#FFE450]' : 'text-[#272727]',
          )} onClick={() => setIsOpenSetting(!isOpenSetting)}>
            <svg className='
              w-6 h-6
              md:w-7.5 md:h-7.5
              lg:w-8 lg:h-8
              xl:w-9 xl:h-9
            ' width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.0641 20.1611C35.0567 19.4892 36.0221 18.7756 37 18.0807V16.8329C36.5788 15.1428 36.1388 13.4547 35.7427 11.7583C35.3986 10.2831 35.2005 10.0974 33.668 9.97634C32.9444 9.92 32.2209 9.84906 31.5015 9.74681C30.2442 9.56736 29.4038 8.39469 29.5769 7.12812C29.6999 6.23714 29.7938 5.34407 29.9105 4.451C30.0148 3.66227 29.6979 3.1114 28.9931 2.76711C27.2228 1.90325 25.4755 0.985148 23.6676 0.213103C23.2506 0.035741 22.5104 0.204756 22.1142 0.486448C21.4199 0.980974 20.8819 1.69251 20.2689 2.30388C19.0741 3.49951 17.9147 3.49534 16.7054 2.28719C16.1174 1.69877 15.5356 1.10617 14.9622 0.503141C14.4388 -0.0477233 13.8696 -0.143707 13.1836 0.20267C11.455 1.07279 9.72016 1.92621 7.97907 2.77128C7.25553 3.12392 6.98654 3.6873 7.08037 4.46144C7.18046 5.28565 7.25552 6.11194 7.37855 6.93407C7.61834 8.52823 6.75926 9.63831 5.16413 9.77185C4.71583 9.80941 4.27169 9.87827 3.82547 9.93669C2.33808 10.1342 1.42896 10.9473 1.09812 12.3759C0.743642 13.9221 0.41419 15.4746 0.0597171 17.0228C-0.11752 17.7928 0.0930793 18.3708 0.781174 18.7902C1.49012 19.22 2.1803 19.6832 2.87465 20.1381C4.23625 21.0249 4.51982 22.2039 3.6962 23.5789C3.25206 24.3197 2.79333 25.0542 2.33252 25.7866C1.91132 26.4543 1.95302 27.0677 2.45137 27.6937C3.65658 29.2107 4.84094 30.7464 6.02529 32.2801C6.50905 32.9061 7.08871 33.098 7.84353 32.8017C8.61503 32.4992 9.39905 32.2321 10.1789 31.9546C11.6468 31.435 12.7707 31.9671 13.2753 33.4236C13.5339 34.1726 13.734 34.9489 14.0552 35.6708C14.2699 36.1528 14.6515 36.5597 14.958 37H22.0266C22.4499 36.2008 22.8899 35.4079 23.2944 34.5983C23.7677 33.6489 23.6968 32.3239 25.0209 31.9692C25.5213 31.8356 26.101 31.7647 26.591 31.8857C27.4876 32.109 28.3488 32.4867 29.2162 32.8205C29.8855 33.0772 30.4318 32.9269 30.8655 32.374C32.125 30.7715 33.4282 29.2003 34.5917 27.5289C34.8669 27.1324 34.8252 26.3291 34.6271 25.8346C34.2977 25.0145 33.718 24.2946 33.2572 23.5247C32.4711 22.2101 32.7713 21.0291 34.06 20.1569L34.0641 20.1611ZM18.4861 24.3197C15.0498 24.3197 12.2661 21.532 12.2661 18.0953C12.2661 14.6587 15.0519 11.871 18.4861 11.871C21.9203 11.871 24.706 14.6587 24.706 18.0953C24.706 21.532 21.9203 24.3197 18.4861 24.3197Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className={cn('w-full overflow-hidden transition-all duration-300',
          isOpenSetting
            ? `
          h-[124px]
          md:h-[166px]
          lg:h-[192px]
          xl:h-[216px]
          2xl:h-[240px]
        `
            : 'h-0',
        )}>
          <div className={cn(`w-full bg-black text-white
            mt-2.5 px-2 pt-1 pb-3 rounded-[15px]
            md:mt-3.5 md:px-8 md:pt-3 md:pb-7 md:rounded-[18px]
            lg:mt-4 lg:px-10 lg:pt-3.5 lg:pb-8 lg:rounded-[22px]
            xl:mt-5 xl:px-12 xl:pt-4 xl:pb-9 xl:rounded-[26px]
            2xl:mt-6 2xl:px-12.5 2xl:pt-4.5 2xl:pb-10 2xl:rounded-[30px]
          `,
          )}>
            <h1 className='text-center
              text-lg
              md:text-xl
              lg:text-2xl
              xl:text-3xl
            '>
              Swap settings
            </h1>
            <h2 className='font-semibold font-open-sans
              text-sm
              md:text-base
              lg:text-lg
              xl:text-xl
              2xl:text-2xl
            '>
              Max slippage
            </h2>
            <div className='w-full flex items-center border border-[#3A3A3A] bg-[#1C1C1C] font-open-sans overflow-hidden
              rounded-[10px]
              mt-2.5 h-10 py-1 px-2.5 gap-0.5 text-sm
              md:mt-3 md:h-12 md:p-2.5 md:gap-1 md:text-lg
              lg:mt-3.5 lg:h-14 lg:p-2.5 lg:gap-1.5 lg:text-xl
              xl:mt-4 xl:h-16 xl:p-2.5 xl:gap-2 xl:text-2xl
              2xl:mt-4.5 2xl:h-18 2xl:p-2.5 2xl:gap-2.5 2xl:text-[26px]
            '>
              {
                slippageList.map((item, index) => (
                  <button key={index} className={cn('flex-1 h-full flex items-center justify-center transform-colors duration-300',
                    `rounded-[5px]
                    md:rounded-[6px]
                    lg:rounded-[8px]
                    xl:rounded-[10px]
                    `,
                    slippageValue === item.value ? 'bg-[#FFE450] text-black' : 'bg-transparent text-white',
                  )} onClick={() => {
                    setSlippageValue(item.value)
                  }}>
                    {item.label}
                  </button>
                ))
              }
              <div className='h-full flex items-center justify-end border border-[#3A3A3A] bg-[#1C1C1C]
                rounded-sm
                md:rounded
                lg:rounded-[6px]
                xl:rounded-[8px]
                w-20 md:w-auto md:flex-1
                text-[#858585] transform-colors duration-300
              '>
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
        </div>

        <div className='w-full flex flex-col gap-1 text-white relative
          mt-2
          md:mt-3
          lg:mt-3.5
          xl:mt-4
          2xl:mt-5
        '>
          <div className='w-full bg-black
            px-5 py-2.5 rounded-[15px]
            md:px-10 md:py-3 md:rounded-[18px]
            lg:px-12 lg:py-3.5 lg:rounded-[22px]
            xl:px-14 xl:py-4 xl:rounded-[26px]
            2xl:px-15 2xl:py-4.5 2xl:rounded-[30px]
          '>
            <h2 className='
              text-lg
              md:text-xl
              lg:text-2xl
              xl:text-3xl
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

            <p className='font-open-sans
              text-sm
              md:text-base
              lg:text-lg
              xl:text-xl
            '>
              Balance: {payBalance}
            </p>
          </div>

          <div className='w-full bg-black
            px-5 py-2.5 rounded-[15px]
            md:px-10 md:py-3 md:rounded-[18px]
            lg:px-12 lg:py-3.5 lg:rounded-[22px]
            xl:px-14 xl:py-4 xl:rounded-[26px]
            2xl:px-15 2xl:py-4.5 2xl:rounded-[30px]
          '>
            <h2 className='
              text-lg
              md:text-xl
              lg:text-2xl
              xl:text-3xl
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

            <p className='font-open-sans
              text-sm
              md:text-base
              lg:text-lg
              xl:text-xl
            '>
              Balance: {receicBalance}
            </p>
          </div>

          <svg className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-8 h-8
            md:w-10 md:h-10
            lg:w-12 lg:h-12
            xl:w-14 xl:h-14
            2xl:w-15 2xl:h-15
          ' width="61" height="61" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="60" height="60" rx="9.5" fill="#1C1C1C" stroke="#444444"/>
            <path d="M31 18L31 42" stroke="#878787"/>
            <path d="M20 31L31 42L42 31" stroke="#878787"/>
          </svg>

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
            {connected ? 'Get Started' : 'CONNECT'}
          </span>
        </button>
      </div>
    </div>
  </section>
}

function SelectCoin ({ currentCoin, setCurrentCoin }) {
  return <div className='flex-none relative group'>
  <div className='flex items-center justify-center border border-[#3A3A3A] bg-[#1C1C1C] font-open-sans
    w-30 h-10 gap-1.5 rounded-[2px]
    md:w-[140px] md:h-11 md:gap-2 md:rounded-[6px]
    lg:w-[150px] lg:h-12 lg:gap-2.5 lg:rounded-[8px]
    xl:w-40 xl:h-12.5 xl:gap-3 xl:rounded-[10px]
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
      <path d="M14.5 0.447141L7.76667 6.93082L1 0.447265" stroke="#BBBBBB"/>
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
