'use client'

import { cn, getImgUrl } from '@/utils'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Pagination, message, InputNumber } from 'antd'
import useDeviceType from '@/hooks/useDeviceType'
import * as echarts from 'echarts'
import _ from 'lodash'
import { decMul, truncateString, bigDiv, bigMul, decSub, decAdd } from '@/utils/utils'
import { getView, getAccountResource, signAndSubmit, getTimestampByVersion, getBalance } from '@/utils/transaction'
// import PIPI_ABI from '@/utils/pipiABI.json'
// import PRICE_ORACLE_ABI from '@/utils/priceOracleABI.json'
import WEUSD_OPERATIONSABI from '@/utils/weusd_mint_redeem.json'
import WEUSD_ABI from '@/utils/weusd2ABI.json'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { getEventsFromChain } from '@/api/index'
import moment from 'moment'
import { useModal } from '@/components/ReactQueryClientProvider'
import errorParse from '@/utils/error'
import Config from "@/config/index";

export default function Section() {
  const { isModalOpen, setIsModalOpen } = useModal()
  const { account, connected, wallet, network, changeNetwork, connect, signAndSubmitTransaction } = useWallet()
  const [mintState, setMintState] = useState({ ratio: '0.1' })
  const [mintCost, setMintCost] = useState({ move: '0', usdt: '0' })
  const [redeemCost, setRedeemCost] = useState({ move: '0', usdt: '0' })
  const [poolAmount, setPoolAmount] = useState({ usdt: '0' })
  const [totalPoolUSD, setTotalPoolUSD] = useState('0')
  const [inputWEUSD, setInputWEUSD] = useState('0')
  const [movePrice, setMovePrice] = useState('')
  const [WEUSDPrice, setWEUSDPrice] = useState('1')
  const [WEUSDTotalSupply, setWEUSDTotalSupply] = useState('0')
  const [PIPIRatio, setPIPIRatio] = useState('0')
  const [loading, setLoading] = useState(false)
  const [queryParams, setQueryParams] = useState({ pageSize: 5, pageNumber: 1 })
  const [tableLoading, setTableLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [tableData, setTableData] = useState([])
  const [PIPIAddr, setPIPIAddr] = useState('');
  const [WEUSDAddr, setWEUSDAddr] = useState('');
  const [tokenBalance, setTokenBalance] = useState({ weusd: 0, pipi: 0, usdt: 0 })

  useEffect(() => {
    // getMintState()
    // getMovePrice()
    // getTotalReverves()
    getEventList()
    // getPIPIRatio()
    // getWEUSDTotal()
    // getPIPIAddress()
    getWEUSDADDress()
    getTotalReserves()
  }, [])

  useEffect(() => {
    if (WEUSDTotalSupply != '0' && poolAmount.move != '0' && WEUSDTotalSupply != '0') {
      computedWEUSDPrice()
    }
  }, [WEUSDTotalSupply, poolAmount, movePrice])

  /** v2 get pool usdt */
  const getTotalReserves = async () => {
    const payload = {
      function: `${WEUSD_OPERATIONSABI.address}::${WEUSD_OPERATIONSABI.name}::get_total_reserves`,
      functionArguments: [],
      typeArguments: [],
    }
    const res = await getView(payload)
    console.log('池子usdt,', res)
    setPoolAmount({
      usdt: bigDiv(res[0], 10 ** 6)
    })
  }

  /** get move price */
  const getMovePrice = async () => {
    const payload = {
      function: `${PRICE_ORACLE_ABI.address}::${PRICE_ORACLE_ABI.name}::get_latest_price`,
      functionArguments: [],
      typeArguments: [],
    }
    const res = await getView(payload)
    setMovePrice(bigDiv(res[0].value, 10 ** 8))
    console.log('price', res)
  }

  /** get pool move andusdt amount */
  const getTotalReverves = async () => {
    const payload = {
      function: `${WEUSD_OPERATIONSABI.address}::${WEUSD_OPERATIONSABI.name}::get_total_reserves`,
      functionArguments: [],
      typeArguments: [],
    }
    const res = await getView(payload)
    const _obj = {
      move: bigDiv(res[0], 10 ** 8),
      usdt: bigDiv(res[1], 10 ** 6),
    }
    setPoolAmount(_obj)
    console.log('TotalReverves', res)
  }

  /** get pipi and weusd ratio */
  const getPIPIRatio = async () => {
    // get_current_mint_ratio
    const payload = {
      function: `${PIPI_ABI.address}::${PIPI_ABI.name}::get_current_mint_ratio`,
      functionArguments: [],
      typeArguments: [],
    }
    const res = await getView(payload) // 10000/10000, if 10000 means one hundred percent，so is 1 weusd = 1 pipi if 5000 means 50%， so 1 weusd = 0.5 pipi
    console.log('get_current_mint_ratio', res)
    setPIPIRatio(bigDiv(res[0], 10000))
  }

  /** weusd total amount */
  const getWEUSDTotal = async () => {
    const payload = {
      function: `${WEUSD_ABI.address}::${WEUSD_ABI.name}::total_supply`,
      functionArguments: [],
      typeArguments: [],
    }
    const res = await getView(payload)
    setWEUSDTotalSupply(bigDiv(res[0], 10 ** 6))
    console.log('weusd_total_supply', res)
  }

  /** compute weusd price */
  const computedWEUSDPrice = async () => {
    // move amount * price + usdt amount > weusd amount ，weusd price is 1. or move amount* price + usdt amount / weusd amount
    /** move amount*price + usdt amount */
    const totalPool = decAdd(bigMul(poolAmount.move, movePrice), poolAmount.usdt)
    setTotalPoolUSD(totalPool)
    console.log('usdta and move pool:', totalPool)
    console.log('weusd total supply amount', WEUSDTotalSupply)
    if (Number(totalPool) > Number(WEUSDTotalSupply)) {
      setWEUSDPrice(1)
    } else {
      const _weusdprice = bigDiv(totalPool, WEUSDTotalSupply)
      setWEUSDPrice(_weusdprice)
    }
  }

  /** get mint state */
  const getMintState = async () => {
    const payload = {
      function: `${WEUSD_OPERATIONSABI.address}::${WEUSD_OPERATIONSABI.name}::get_mint_state_fields`,
      functionArguments: [],
      typeArguments: [],
    }
    const res = await getView(payload)
    const _obj = {
      /**
     * The ratio of MOVE to USDT is currently 1000/10000, which is 10%. Then multiply by 1,
     * meaning that to mint 1 WEUSD, it requires 0.1u worth of MOVE and 0.9u worth of USDT.
     * For the 0.1u worth of MOVE, the quantity of MOVE needs to be calculated using the MOVE price of 0.6, which is 0.1 divided by 0.6.
     */
      ratio: bigDiv(res[2], 10000),
    }
    setMintState(_obj)
    console.log('r', _obj)
  }

  const handleChangeAmount = async (v) => {
    // setInputWEUSD((pre) => {
    //   console.log(v)
    //   console.log('WEUSDPrice', WEUSDPrice)
    //   console.log('mintState', mintState)
    //   if (Number(WEUSDPrice) == 1) {
    //     const usdtAmount = decMul(decSub(1, mintState.ratio), v)
    //     console.log('usdtAmount', usdtAmount)
    //     const moveAmount = bigDiv(decMul(v, mintState.ratio), movePrice)
    //     console.log('moveAmount', moveAmount)
    //     setMintCost({
    //       move: moveAmount,
    //       usdt: usdtAmount,
    //     })
    //   } else {
    //     const usdtAmount = decMul(decSub(1, mintState.ratio), v)
    //     console.log('usdtAmount', usdtAmount)
    //     // const moveAmount = bigDiv(decMul(v, mintState.ratio), movePrice)
    //     const moveAmount = bigDiv((bigMul(v, decSub(WEUSDPrice, 0.9))), movePrice)
    //     console.log('moveAmount', moveAmount)
    //     setMintCost({
    //       move: moveAmount,
    //       usdt: usdtAmount,
    //     })
    //   }
    //   return v
    // })
    setInputWEUSD(v)
    /**
     * mint
    */
    // computedMintCost(v)
    /**
     * redeem
     */
    // computedRedeemCost(v)
  }

  const computedMintCost = (v) => {
    // 1.USDT数量： S = M * ( (10000 - α) / 10000 ) M：用户输入WEUSD数量，α：move比例(get_mint_state_fields)，之前已经得到mintState就是处理过的move比例，为0.1
    const S = bigMul(v, decSub(1, mintState.ratio))
    // 2.有效铸造美元成本： Vm = M (if totalPoolUSD >= totalSupply) ; Vm =  M * (TotalPolUSD/TotalSupply) (if totalPoolUSD < totalSupply)
    let Vm = ''
    if (totalPoolUSD >= WEUSDTotalSupply) {
      Vm = v
    } else {
      Vm = bigMul(v, (bigDiv(totalPoolUSD, WEUSDTotalSupply)))
    }
    // 3.MOVE部分美元成本：Vmore = Vm - S
    const Vmore = decSub(Vm, S)
    // 4.转化为MOVE数量：MOVE_required = Vmore / p, p:当前move价格
    const MOVE_required = bigDiv(Vmore, movePrice)
    setMintCost({
      move: MOVE_required,
      usdt: S,
    })
  }

  const computedRedeemCost = (v) => {
    // 1.计算赎回总美元价值 V = M (if totalPoolUSD >= totalSupply)；V = M * (totalPoolUSD/ totalSupply)  (if totalPool USD < totalSupply)
    let V = ''
    if (totalPoolUSD >= WEUSDTotalSupply) {
      V = v
    } else {
      V = bigMul(v, (bigDiv(totalPoolUSD, WEUSDTotalSupply)))
    }
    // 2.计算MOVE占比 actual_move_ratio = move_usd / totalPoolUSD
    const actual_move_ratio = bigDiv(bigMul(movePrice, poolAmount.move), totalPoolUSD)
    console.log('actual_move_ratio', actual_move_ratio)
    // 3.拆分美元价值 Vmove = V * actual_move_ratio, Vusdt = V - Vmove
    const Vmove = bigMul(V, actual_move_ratio)
    const Vusdt = decSub(V, Vmove)
    // 4.转换为资产数量 MOVE_required = Vmove / movePrice , USDT_required = Vusdt
    const MOVE_required = bigDiv(Vmove, movePrice)
    const USDT_required = Vusdt
    setRedeemCost({
      move: MOVE_required,
      usdt: USDT_required,
    })
  }

  // const debouncedHandleChangeAmount = useCallback(
  //   _.debounce(handleChangeAmount, 200),
  //   [inputWEUSD, setInputWEUSD, setMintCost, mintState, movePrice],
  // )

  /** submit mintWeusd */
  const handleMINT = async () => {
    if (!connected) {
      setIsModalOpen(true)
      return
    }
    if (Number(mintCost.usdt) > Number(tokenBalance.usdt)) {
      message.error('You do not have enough USDT')
      return
    }
    try {
      setLoading(true)
      console.log(inputWEUSD)
      const transaction = {
        data: {
          function: `${WEUSD_OPERATIONSABI.address}::${WEUSD_OPERATIONSABI.name}::mintWeUSD`,
          functionArguments: [
            bigMul(inputWEUSD, 10 ** 6),
          ],
        },
      }
      const transactionRes = await signAndSubmit(transaction, signAndSubmitTransaction)
      message.success('mint WEUSD success')
      getEventList()
      getTotalReverves()
    } catch (error) {
      message.error(errorParse(error))
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  /** submit redeem */
  const handleREDEEM = async () => {
    if (!connected) {
      setIsModalOpen(true)
      return
    }
    try {
      setLoading(true)
      const transaction = {
        data: {
          function: `${WEUSD_OPERATIONSABI.address}::${WEUSD_OPERATIONSABI.name}::redeemWeUSD`,
          functionArguments: [
            bigMul(inputWEUSD, 10 ** 6),
          ],
        },
      }
      const transactionRes = await signAndSubmit(transaction, signAndSubmitTransaction)
      message.success('redeem WEUSD success')
      getEventList()
      getTotalReverves()
    } catch (error) {
      message.error(errorParse(error))
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getEventList = async () => {
    setTableLoading(true)
    const accountResource = await getAccountResource({
      accountAddress: WEUSD_OPERATIONSABI.address,
      resourceType: `${WEUSD_OPERATIONSABI.address}::${WEUSD_OPERATIONSABI.name}::EventHandles`,
    })
    console.log('accountResource', accountResource)
    const totalCounter = Number(accountResource.minted_weusd_events.counter)
    setTotal(totalCounter)
    console.log(decSub(totalCounter, decMul(queryParams.pageNumber, queryParams.pageSize)))
    const res = await getEventsFromChain(WEUSD_OPERATIONSABI.address, `${WEUSD_OPERATIONSABI.address}::${WEUSD_OPERATIONSABI.name}::EventHandles`, { start: decSub(totalCounter, decMul(queryParams.pageNumber, queryParams.pageSize)) > 0 ? decSub(totalCounter, decMul(queryParams.pageNumber, queryParams.pageSize)) : 0 })
    console.log('res', res)
    const _res = res.slice(0, decSub(res.length, decMul((queryParams.pageSize), decSub(queryParams.pageNumber, 1))))
    console.log('_res', _res)
    renderDate(_res)
  }

  const renderDate = async (list) => {
    // getTimestampByVersion(version);
    // return '1'
    const _list = [...list]
    for (let i = 0; i < _list.length; i++) {
      const item = list[i]
      const blockData = await getTimestampByVersion(item.version)
      // console.log('blockData', blockData)
      const formattedTime = moment(parseInt(bigDiv(blockData.block_timestamp, 1000))).format('YYYY-MM-DD HH:mm:ss')
      item.block_timestamp = formattedTime
    }
    console.log(_list)
    setTableData([..._list].reverse())
    setTableLoading(false)
  }

  useEffect(() => {
    getEventList()
  }, [queryParams])

  const handleChangePage = (page) => {
    setQueryParams((pre) => {
      return {
        ...pre,
        pageNumber: page,
      }
    })
  }

  const getPIPIAddress = async () => {
    const payload = {
      function: `${PIPI_ABI.address}::${PIPI_ABI.name}::get_metadata`,
      functionArguments: [],
      typeArguments: [],
    }
    const res = await getView(payload)
    console.log('pipiAddr', res)
    setPIPIAddr(res[0].inner)
  }

  const getWEUSDADDress = async () => {
    const payload = {
      function: `${WEUSD_ABI.address}::${WEUSD_ABI.name}::get_metadata`,
      functionArguments: [],
      typeArguments: [],
    }
    const res = await getView(payload)
    console.log('weusdAddr', res)
    setWEUSDAddr(res[0].inner)
  }

  const getWalletTokenBalance = async () => {
    // const pipiRes = await getBalance({ accountAddress: account.address, faMetadataAddress: PIPIAddr })
    const weusdRes = await getBalance({ accountAddress: account.address, faMetadataAddress: WEUSDAddr })
    // const usdtRes = await getBalance({ accountAddress: account.address, faMetadataAddress: Config.USDTAddr })
    setTokenBalance({
      weusd: bigDiv(weusdRes, 10 ** 6),
      pipi: 0, // 不需要
      usdt: 0, // 不需要
    })
    console.log('pipiRes', pipiRes)
    console.log('weusdRes', weusdRes)
    console.log('usdtRes', usdtRes)
  }

  useEffect(() => {
    if (connected && WEUSDAddr) {
      getWalletTokenBalance();
    }
  }, [connected, WEUSDAddr])

  useEffect(() => {
    console.log('network', network)
    if (connected && network && network.url != 'https://mainnet.movementnetwork.xyz/v1') {
      message.error('Movement needs to cut over to the mainnet')
    }
  }, [connected])

  return <section id="mintWeusd" className="w-full">
    <div className="container xl:max-w-[1100px] mx-auto w-full flex-grow">
      {/* <h1 className='text-center !leading-1.2 text-stroke
        text-[40px]
        md:text-[60px]
        lg:text-[68px]
        xl:text-[74px]
        2xl:text-[80px]
      '>
        Mint Or Redeem WEUSD
      </h1> */}

      {/* <Info movePrice={movePrice} WEUSDPrice={WEUSDPrice} PIPIRatio={PIPIRatio} /> */}
      <div className='flex bg-[#22252E] rounded-[30px] mb-4
      max-w-[652px] mx-auto
      p-6
      xl:p-[28px] xl:mb-6
      2xl:p-[35px]'>
        <div className='flex-1 text-base lg:text-2xl 2xl:text-[26px]'>Total Value Locked</div>
        <div>
          <span className='text-[#fff] text-xs xl:text-2xl mr-1'>${new Intl.NumberFormat().format(poolAmount.usdt || 0)}</span>
          <span className='text-[#707279] text-[10px] xl:text-sm'>USDT</span>
        </div>
      </div>
      <Mint debouncedHandleChangeAmount={handleChangeAmount} inputWEUSD={inputWEUSD} mintCost={mintCost} handleMINT={handleMINT} handleREDEEM={handleREDEEM} redeemCost={redeemCost} WEUSDPrice={WEUSDPrice} movePrice={movePrice} PIPIRatio={PIPIRatio} />
      <Balance tokenBalance={tokenBalance} />
    </div>

    <div className='w-full mt-10 2xl:mt-[110px]'>
      <div className='md:container mx-auto'>
        <div className='w-full max-w-[652px] mx-auto bg-[#22252E] rounded-t-[30px] xl:rounded-[30px] px-6 py-6 xl:px-5 xl:py-5'>
          <Pool poolAmount={poolAmount} movePrice={movePrice} />

          {/* <MyTable handleChangePage={handleChangePage} tableData={tableData} total={total} /> */}
        </div>
      </div>

    </div>
  </section>
}

function Info({ movePrice, WEUSDPrice, PIPIRatio }) {
  return <div className='w-full flex text-black
    max-w-[630px] mx-auto
    mt-8 gap-2.5
    md:mt-10 md:gap-3
    lg:mt-14 lg:gap-4
    xl:mt-16 xl:gap-4.5
    2xl:mt-18 2xl:gap-5
  '>
    {/* <div className='flex-1 bg-white flex flex-col items-center justify-center
      rounded-[15px] py-2.5 gap-2.5
      md:rounded-[20px] md:gap-3
      lg:rounded-[30px] lg:py-3 lg:gap-3.5
      xl:rounded-[35px] xl:py-3.5 xl:gap-4
      2xl:rounded-[40px]
    '>
      <h1 className='
        text-base
        md:text-lg
        lg:text-xl
        xl:text-2xl
        2xl:text-3xl
      '>
        Current Prices
      </h1>
      <div className='flex-grow flex flex-col items-center justify-center font-itim
        text-xs
        md:text-sm
        lg:text-lg
        xl:text-xl
        2xl:text-2xl
      '>
        <p>MOVE: {(Math.floor(movePrice * 10000) / 10000).toFixed(4)}</p>
        <p>WEUSD: {(Math.ceil(WEUSDPrice * 100) / 100).toFixed(2)}</p>
      </div>

    </div> */}
    {/* <div className='flex-1 bg-white flex flex-col items-center justify-center
      rounded-[15px] py-2.5 gap-2.5
      md:rounded-[20px] md:gap-3
      lg:rounded-[30px] lg:py-3 lg:gap-3.5
      xl:rounded-[35px] xl:py-3.5 xl:gap-4
      2xl:rounded-[40px]
    '>
      <h1 className='
        text-base
        md:text-lg
        lg:text-xl
        xl:text-2xl
        2xl:text-3xl
      '>
        PIPI Mint Ratio
      </h1>
      <div className='flex-grow flex flex-col items-center justify-center font-itim
        text-xs
        md:text-sm
        lg:text-lg
        xl:text-xl
        2xl:text-2xl
      '>
        <p>MINT 1 WEUSD</p>
        <p>REWARD {bigMul(1, PIPIRatio)} PIPI</p>
      </div>
    </div> */}
  </div>
}

function Mint({ debouncedHandleChangeAmount, inputWEUSD, mintCost, handleMINT, handleREDEEM, redeemCost, WEUSDPrice, movePrice, PIPIRatio }) {
  const [type, setType] = useState('mint')
  const [amount, setAmount] = useState(0)

  return <div className='w-full bg-[#22252E] overflow-hidden text-white
    max-w-[652px] mx-auto
    rounded-[18px] px-[19px] py-[19px] 
    md:rounded-[18px] md:px-[19px] md:py-[19px]
    lg:rounded-[22px]  lg:px-[19px] lg:py-[19px]
    xl:rounded-[26px]  xl:px-[36px] xl:py-[36px]
    2xl:rounded-[30px]  2xl:px-[36px] 2xl:py-[36px]
  '>
    <div className='text-[16px] mb-[13px]
      lg:text-[18px] lg:mb-[16px]
      xl:text-[22px] xl:mb-[20px]
      2xl:text-[26px] 2xl:mb-[24px]
    '>Mint or redeem WEUSD</div>
    {/* <div className='w-full'>
      <div className='
      text-[12px]
      lg:text-[14px]
      xl:text-[18px]
      2xl:text-[20px]
      '>Current Prices</div>
      <div className='
        bg-[#1A1C22] rounded-[10px] px-[14px] py-[6px] mt-[10px] mb-[14px]
        md:px-[14px] md:py-[6px]  md:mt-[10px] md:mb-[14px]
        lg:px-[14px] lg:py-[10px] lg:mt-[10px] lg:mb-[14px]
        xl:px-[14px] xl:py-[12px] xl:mt-[6px] xl:mb-[27px]
        2xl:px-[26px] 2xl:py-[14px]  2xl:mt-[6px] 2xl:mb-[27px]
      '>
        <div className='flex items-center border-b border-[#26282C] pb-[9px] text-xs
          md:pb-[9px]  
          lg:pb-[10px]  lg:text-sm
          xl:pb-[12px]  xl:text-base
          2xl:pb-[14px] 2xl:text-lg
        '>
          <div className='text-[#707279] flex-1'>MOVE</div>
          <div>${(Math.floor(movePrice * 10000) / 10000).toFixed(4)}</div>
        </div>
        <div className='flex items-center pt-[9px] text-xs
          md:pt-[9px]
          lg:pt-[10px] lg:text-sm
          xl:pt-[12px] xl:text-base
          2xl:pt-[14px] 2xl:text-lg
        '>
          <div className='text-[#707279] flex-1'>WEUSD</div>
          <div>${(Math.ceil(WEUSDPrice * 100) / 100).toFixed(2)}</div>
        </div>
      </div>
    </div> */}

    {/* <div className='w-full'>
      <div className='text-[12px]
      md:text-[12px]
      lg:text-[14px]
      xl:text-[18px]
      2xl:text-[20px]
      '>PIPI Mint Ratio</div>
      <div className='
        bg-[#1A1C22] rounded-[10px] px-[14px] py-[6px] mt-[10px] mb-[25px] text-xs
        md:px-[14px] md:py-[6px]  md:mt-[10px] md:mb-[25px]
        lg:px-[14px] lg:py-[10px] lg:mt-[10px] lg:mb-[25px] lg:text-sm
        xl:px-[14px] xl:py-[12px] xl:mt-[6px] xl:mb-[46px] xl:text-base
        2xl:px-[26px] 2xl:py-[14px]  2xl:mt-[6px] 2xl:mb-[46px] 2xl:text-lg
      '>
        <div className='flex items-center'>
          <div className='text-[#707279] flex-1'>MINT 1 WEUSD</div>
          <div>REWARD {bigMul(1, PIPIRatio)} PIPI</div>
        </div>
      </div>
    </div> */}

    <div className='w-full flex items-center justify-center bg-[#1A1C22]
      rounded-[90px] text-[14px] h-[32px]
      md:text-[14px] md:h-[32px]
      lg:text-[16px] lg:h-[40px]
      xl:text-[20px] xl:h-[50px]
      2xl:text-[24px] 2xl:h-[60px]
    '>
      <button className={cn('flex-1 h-full rounded-full flex items-center justify-center uppercase transition-all duration-300',
        type === 'mint' ? 'bg-[#FFDA34] text-black' : 'text-[#707279] bg-transparent',
      )} onClick={() => setType('mint')}>
        mint
      </button>
      <button className={cn('flex-1 h-full  rounded-full flex items-center justify-center uppercase transition-all duration-300',
        type === 'redeem' ? 'bg-[#FFDA34] text-black' : 'text-[#707279] bg-transparent',
      )} onClick={() => setType('redeem')}>
        redeem
      </button>
    </div>

    <div className='w-full bg-[#1A1C22] flex rounded-[10px] py-[10px] px-[11px] mt-[13px]
    md:py-[10px] md:px-[11px] md:mt-[13px]
    lg:py-[10px] lg:px-[11px] lg:mt-[13px]
    xl:py-[22x] xl:px-[20px] xl:mt-[14px]
    2xl:py-[22x] 2xl:px-[20px] 2xl:mt-[15px]
    '>
      <div className='flex-1'>
        <div className=' text-[#707279] text-[12px] mb-[10px]
        md:text-[12px] md:mb-[10px]
        lg:text-[14px] lg:mb-[14px]
        xl:text-[16px] xl:mb-[16px]
        2xl:text-[20px] 2xl:mb-[18px]
        '>Amount to {type === 'mint' ? 'Mint' : 'Redeem'}</div>
        <div className=' border border-[#26282C] rounded-[5px] w-[140px] h-[27px] py-[2px] px-[7px] text-base
          md:w-[140px] md:h-[27px] md:py-[2px] md:px-[7px]
          lg:w-[180px] lg:h-[30px] lg:py-[4px] lg:px-[9px] lg:text-lg 
          xl:w-[240px] xl:h-[40px] xl:py-[5px] xl:px-[11px] xl:text-xl
          2xl:w-[260px] 2xl:h-[50px] 2xl:py-[7px] 2xl:px-[13px] 2xl:text-2xl
        '>
          <InputNumber className='w-full h-full text-left text-white'
            changeOnWheel={false}
            controls={false}
            min={0}
            onChange={(value) => {
              debouncedHandleChangeAmount(value)
            }}
          />
        </div>
        <div className='text-[#8A8A8A]
          text-[8px] mt-[5px]
          md:text-[8px] md:mt-[5px]
          lg:text-[8px] lg:mt-[6px]
          xl:text-[8px] xl:mt-[7px]
          2xl:mt-[9px] 2xl:text-xs
        '>
          {
            type == 'mint' ?
              (
                <span> USDT: {inputWEUSD}</span>
              ) :
              (
                <span>WEUSD: {inputWEUSD}</span>
              )
          }

        </div>
      </div>

      <div>
        <div className='text-[#707279] text-[12px] mb-[10px]
        md:text-[12px] md:mb-[10px]
        lg:text-[14px] lg:mb-[12px]
        xl:text-[16px] xl:mb-[13px]
        2xl:text-[20px] 2xl:mb-[14px]'>
          Estimated Return
        </div>
        {/* <div className='text-right text-[10px] mb-[7px]
          md:text-[10px] md:mb-[7px]
          lg:text-[12px]  lg:mb-[9px]
          xl:text-[14px]  xl:mb-[11px]
          2xl:text-[14px] 2xl:mb-[12px]
        '>
          <span>{type === 'mint' ? mintCost.move : redeemCost.move}</span>
          <span className='text-[#707279] ml-1'>MOVE</span>
        </div> */}
        <div className='text-right text-sm mb-[7px]
          md:text-sm md:mb-[7px]
          lg:text-base  lg:mb-[9px]
          xl:text-xl  xl:mb-[11px]
          2xl:text-2xl 2xl:mb-[12px]
        '>
          {
            type === 'mint' ?
              (
                <>
                  <span>{inputWEUSD}</span>
                  <span className='text-[#707279] ml-1 text-xs md:text-sm'>WEUSD</span>
                </>
              ) :
              (
                <>
                  <span>{bigMul(0.99, inputWEUSD)}</span>
                  <span className='text-[#707279] ml-1 text-xs md:text-sm'>USDT</span>
                </>
              )
          }

        </div>
      </div>
    </div>


    {/* <div className='w-full font-open-sans
      text-sm
      md:text-base
      lg:text-lg
      xl:text-xl
      2xl:text-2xl
    '>
      <h2 className='text-center font-bold capitalize
        mt-6
        md:mt-10
        lg:mt-12
        xl:mt-14
        2xl:mt-15
      '>
        {type === 'mint' ? 'Amount to Mint (WEUSD).' : 'Amount to Redeem (WEUSD).'}
      </h2>

      <div className='w-full rounded-full border border-black border-opacity-30 overflow-hidden
        mt-3 h-10
        md:h-11
        lg:mt-3.5 lg:h-12
        xl:h-14
        2xl:mt-4 2xl:h-15
      '>
        <InputNumber className='w-full h-full text-center'
          changeOnWheel={false}
          controls={false}
          min={0}
          onChange={(value) => {
            debouncedHandleChangeAmount(value)
          }}
        />
      </div>

      <h2 className='text-center font-bold
        mt-3.5
        md:mt-5
        lg:mt-6
        xl:mt-7
        2xl:mt-7.5
      '>
        {type === 'mint' ? 'Estimated Cost.' : 'Estimated Return.'}
      </h2>
      <div className='w-full flex justify-center items-center font-medium
        mt-4 gap-16
      '>
        <span>
          {type === 'mint' ? mintCost.move : redeemCost.move} MOVE
        </span>
        <span>
          {type === 'mint' ? mintCost.usdt : redeemCost.usdt} USDT
        </span>
      </div>
      <div className='w-full flex justify-center items-center font-itim
        mt-4 gap-16
      '>
        <span>WEUSD: ${Number(bigMul(WEUSDPrice, inputWEUSD)).toFixed(2)}</span>
      </div>
    </div> */}

    <button onClick={() => { type == 'mint' ? handleMINT() : handleREDEEM() }} className='w-full  flex items-center justify-center rounded-full relative
      bg-[#FFDA34] text-black hover:text-black hover:bg-[#FFDA34] transition-all duration-300
      text-lg mt-[20px] h-[40px] text-[14px]
      md:mt-[20px] md:h-[40px] md:text-[14px]
      lg:mt-[22px] lg:h-[54px] lg:text-[16px]
      xl:mt-[24px] xl:h-[64px] xl:text-[20px]
      2xl:mt-[26px] 2xl:h-[74px] 2xl:text-[24px]
    '>
      <span>
        {type === 'mint' ? 'Mint WEUSD' : 'Redeem USDC'}
      </span>

    </button>
  </div>
}

function Balance({ tokenBalance }) {
  return <div className='w-full flex text-white 
    max-w-[652px] mx-auto
    mt-2 gap-2
    md:mt-5 md:gap-2.5
  '>
    <div className='flex-1 bg-[#22252E] flex items-center
      rounded-[8px] py-2 px-2 gap-2
      md:rounded-[16px] md:py-4 md:px-5
      lg:rounded-[20px] lg:py-3
    '>
      <Image className='h-auto
        w-7
        md:w-16
      ' src={getImgUrl('logo_WEUSD.png')} alt="balance_icon" width={52} height={58} />
      <h1 className='font-medium font-open-sans
          text-[14px] flex-1 ml-3
          md:text-xl
        '>WEUSD</h1>
      <div className='flex items-center'>
        <div className='md:text-lg'>{tokenBalance.weusd}</div>
        <div className='md:text-sm text-[#707279]'>(${tokenBalance.weusd})</div>
      </div>
      {/* <div className='flex flex-col justify-center
        gap-1
        md:gap-2
      '>
        <h1 className='font-medium font-open-sans
          text-[10px]
          md:text-base
        '>
          WEUSD Balance
        </h1>
        <h2 className='!leading-1
          text-base
          md:text-[30px]
          text-[#707279]
        '>
          {tokenBalance.weusd}
        </h2>
      </div> */}
    </div>
    {/* <div className='flex-1 bg-[#22252E] flex items-center
      rounded-[8px] py-2 px-2 gap-2
      md:rounded-[16px] md:py-4 md:px-5
      lg:rounded-[20px] lg:py-3
    '>
      <Image className='h-auto
        w-7
        md:w-16
      ' src={getImgUrl('logo_PIPI.png')} alt="balance_icon" width={57} height={57} />
      <div className='flex flex-col justify-center
        gap-1
        md:gap-2
      '>
        <h1 className='font-medium font-open-sans
          text-[10px]
          md:text-base
        '>
          PIPI Balance
        </h1>
        <h2 className='!leading-1
          text-base
          md:text-[30px]
          text-[#707279]
        '>
          {tokenBalance.pipi}
        </h2>
      </div>
    </div> */}
  </div>
}

function Pool({ poolAmount, movePrice }) {
  const infoList = [
    { id: 1, title: 'Native Stablecoin', intro: '$WEUSD anchors your DeFi activities on the Movement chain, ensuring a stable peg and swift transactions.' },
    // { id: 2, title: 'Gateway to PIPI', intro: 'When you mint $WEUSD, you gain direct access to $PIPI—the AI Agent token poised to enhance your DeFi experience.' },
    { id: 2, title: 'Omnichain Ready', intro: 'Designed with cross-chain functionality in mind, $WEUSD lets you move assets smoothly between multiple networks.' },
  ]
  return (
    <div className='w-full'>
      <div className='text-base xl:text-2xl xl:pt-3 xl:pl-2 xl:pb-6'>What is $WEUSD?</div>
      <div className='
      xl:flex xl:justify-between xl:flex-wrap
      '>
        {infoList.map((item) => (
          <div className='group'>
            <div className='rounded-[10px] border-[#363A48] mb-[16px] px-2 py-2
            border
           xl:px-[8px] xl:py-[6px]
           2xl:w-[290px]
         '>
              <div className='flex items-start'>
                <div className='mt-1'>
                  <svg
                    width="8.5"
                    height="8.5"
                    viewBox="0 0 8.5 8.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="4.25" y1="0" x2="4.25" y2="8.5" stroke="#FFC90F" strokeWidth="1.5" strokeLinecap="round"  className="hidden"/>
                    <line x1="0" y1="4.25" x2="8.5" y2="4.25" stroke="#FFC90F" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className='ml-3'>
                  <div className='text-xs xl:text-base mb-1'>{item.title}</div>
                  <div className='text-[#707279] text-[10px] xl:text-xs  overflow-hidden transition-all duration-300'>{item.intro}</div>
                </div>
              </div>
            </div>
          </div>
        ))
        }

      </div>
    </div>
  )
  // <div className='w-full flex
  //   flex-col md:flex-row
  //   mt-15 gap-12.5
  //   md:mt-16 md:gap-16
  //   lg:mt-18 lg:gap-20
  //   xl:mt-20 xl:gap-25
  //   2xl:mt-[90px] 2xl:gap-[110px]
  // '>

  //   <div className='flex-1
  //     px-6 md:px-0
  //   '>
  //     <h1 className='
  //       text-3xl
  //       md:text-[34px]
  //       lg:text-[36px]
  //       xl:text-[38px]
  //       2xl:text-[40px]
  //     '>
  //       What is $WEUSD?
  //     </h1>

  //     <div className='flex flex-col justify-center
  //       mt-6 gap-6
  //       md:mt-10
  //       lg:mt-14 lg:gap-7
  //       xl:mt-15 xl:gap-8
  //     '>
  //       {infoList.map((item) => (
  //         <div key={item.id} className='w-full group'>
  //           <div className='flex items-center border-b border-[#7A7A7A] border-opacity-50
  //             gap-2.5
  //             md:gap-3
  //             lg:gap-3.5
  //             xl:gap-4
  //             2xl:gap-4.5
  //           '>
  //             <svg className='transition-transform duration-300
  //               group-hover:rotate-180
  //               w-3.5 h-1.5
  //               md:w-5 md:h-3
  //               lg:w-6 lg:h-3.5
  //               xl:w-7 xl:h-4
  //             ' width="28" height="15" viewBox="0 0 28 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  //               <path d="M1 1L14 14L27 1" stroke="#7A7A7A" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
  //             </svg>
  //             <h2 className='transition-colors duration-300
  //               group-hover:text-[#FFD100]
  //               text-base
  //               md:text-lg
  //               lg:text-xl
  //               xl:text-2xl
  //               2xl:text-3xl
  //             '>{item.title}</h2>
  //           </div>
  //           <p className='text-[#6D6D6D] capitalize font-itim overflow-hidden transition-all duration-300
  //             h-0 group-hover:h-[96px]
  //             mt-3 text-sm pl-5
  //             md:mt-3.5 md:text-base md:pl-7
  //             lg:mt-4 lg:text-lg lg:pl-8
  //             xl:mt-4.5 xl:text-xl xl:pl-9
  //             2xl:mt-5 2xl:text-2xl 2xl:pl-10
  //           '>{item.intro}</p>
  //         </div>
  //       ))}
  //     </div>
  //   </div>


  //   <div className='flex-1 flex flex-col'>
  //     <h1 className='flex-none
  //       text-3xl
  //       md:text-[34px]
  //       lg:text-[36px]
  //       xl:text-[38px]
  //       2xl:text-[40px]
  //     '>
  //       Pool Ratio
  //     </h1>
  //     <div className='flex-grow w-full flex items-center justify-center'>
  //       <PieChart poolAmount={poolAmount} movePrice={movePrice} />
  //     </div>
  //   </div>

  // </div>
}

function MyTable({ handleChangePage, tableData, total }) {
  const { deviceIsPc } = useDeviceType()

  const dataSource = [
    {
      key: '1',
      user: '0x3911...0aab',
      type: 'mint',
      weusd: 32,
      date: '2025-01-27 21:37:05',
    },
    {
      key: '2',
      user: '0x3911...0aab',
      type: 'mint',
      weusd: 42,
      date: '2025-01-27 21:37:05',
    },
    {
      key: '3',
      user: '0x3911...0aab',
      type: 'mint',
      weusd: 42,
      date: '2025-01-27 21:37:05',
    },
    {
      key: '4',
      user: '0x3911...0aab',
      type: 'mint',
      weusd: 42,
      date: '2025-01-27 21:37:05',
    },
    {
      key: '5',
      user: '0x3911...0aab',
      type: 'mint',
      weusd: 42,
      date: '2025-01-27 21:37:05',
    },
  ]

  return <div className='w-full overflow-hidden
    mt-7
  '>
    <div className='w-full overflow-hidden border border-[#353A44]
      rounded-[15px]
      md:rounded-[18px]
      lg:rounded-[24px]
      xl:rounded-[26px]
      2xl:rounded-[30px]
    '>
      <table className='w-full overflow-hidden'>
        <thead className='text-white relative'>
          <tr className='text-left
            h-9 text-[10px]
          
            md:h-11 md:text-[10px]
            lg:h-12 lg:text-[10px]
            xl:h-12.5 xl:text-[10px]
            
          '>
            <th className='lg:w-1/4
              px-2.5
              md:px-3
              lg:px-4
              xl:px-5
              2xl:px-6
            '>User</th>
            <th className='lg:w-1/4
              px-2.5
              md:px-3
              lg:px-4
              xl:px-5
              2xl:px-6
            '>Type</th>
            <th className='lg:w-1/4
              px-2.5
              md:px-3
              lg:px-4
              xl:px-5
              2xl:px-6
            '>WEUSD</th>
            <th className='lg:w-1/4
              px-2.5
              md:px-3
              lg:px-4
              xl:px-5
              2xl:px-6
            '>Date</th>
          </tr>
          {/* 自定义伪线条：用 after 模拟 border-bottom，左右缩进 14px */}
          <tr>
            <td colSpan={999} className="absolute left-[14px] right-[14px] bottom-0 h-px bg-[#353A44]" />
          </tr>
        </thead>
        <tbody className='font-open-sans
         text-[#707279]
          text-[10px]
          md:text-[10x]
          lg:text-[10x]
          xl:text-[10x]
        '>
          {tableData.map((item, index) => (
            <tr key={item.version} className={cn(`
              h-8
              md:h-9
              lg:h-10
              xl:h-11
              2xl:h-12
            `,
              index !== 0 && 'border-t border-black border-opacity-10',
            )}>
              <td className='
                px-2.5
                md:px-3
                lg:px-4
                xl:px-5
                2xl:px-6
              '>{truncateString(item.data?.user || '')}</td>
              <td className='
                px-2.5
                md:px-3
                lg:px-4
                xl:px-5
                2xl:px-6
              '>{'mint'}</td>
              <td className='
                px-2.5
                md:px-3
                lg:px-4
                xl:px-5
                2xl:px-6
              '>{bigDiv(item.data?.weUSDAmount, 10 ** 6)}</td>
              <td className='
                px-2.5
                md:px-3
                lg:px-4
                xl:px-5
                2xl:px-6
              '>{item.block_timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* <Pagination className='w-full flex justify-center
      mt-3
      md:mt-3.5
      lg:mt-4
      xl:mt-4.5
    '
    pageSize={5}
    size={deviceIsPc ? 'default' : 'small'}
    showSizeChanger={false}
    onChange={handleChangePage}
    total={total} /> */}
  </div>
}

const PieChart = ({ poolAmount, movePrice }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current)

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ccc',
          borderWidth: 1,
          textStyle: {
            color: '#333',
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'outside',
              formatter: (params) => {
                return `${params.name}\n${params.value}`
              },
              fontSize: 14,
              color: '#333',
              backgroundColor: '#fff',
              borderColor: '#333',
              borderWidth: 1,
              borderRadius: 4,
              padding: [4, 8],
              align: 'center',
              distanceToLabelLine: 5,
            },
            labelLayout: {
              hideOverlap: true,
              moveOverlap: 'shiftY',
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
              lineStyle: {
                color: '#696969',
                width: 1,
                type: 'solid',
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
              },
            },
            data: [
              {
                value: Number(bigMul(poolAmount.move, movePrice, 2)),
                name: 'MOVE',
                itemStyle: { color: '#eee' },
              },
              {
                value: Number(poolAmount.usdt).toFixed(2),
                name: 'USDT',
                itemStyle: { color: '#FFE450' },
              },
            ],
          },
        ],
      }

      myChart.setOption(option)

      const handleResize = () => {
        myChart.resize()
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        myChart.dispose()
      }
    }
  }, [poolAmount])

  return <div ref={chartRef} className="w-full h-[400px]" />
}
