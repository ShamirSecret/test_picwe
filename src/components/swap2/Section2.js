/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
'use client'

import { cn, getImgUrl } from '@/utils'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Pagination, message, InputNumber, Button } from 'antd'
import useDeviceType from '@/hooks/useDeviceType'
import * as echarts from 'echarts'
import _ from 'lodash'
import { decMul, truncateString, bigDiv, bigMul, decSub, decAdd } from '@/utils/utils'
import { getView, getAccountResource, signAndSubmit, getTimestampByVersion, getBalance } from '@/utils/transaction'
// import PIPI_ABI from '@/utils/pipiABI.json'
// import PRICE_ORACLE_ABI from '@/utils/priceOracleABI.json'
import WEUSD_OPERATIONSABI from '@/utils/weusd_mint_redeem2.json'
import WEUSD_ABI from '@/utils/weusd3ABI.json'
import WEUSD_CROSS_CHAIN_GAS_ABI from '@/utils/weusd_cross_chain_gas.json'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { getEventsFromChain } from '@/api/index'
import moment from 'moment'
import { useModal } from '@/components/ReactQueryClientProvider'
import errorParse from '@/utils/error'
import Config from '@/config/index'
import { useAccount, useSwitchChain } from 'wagmi'
import wagmiConfig from '@/config/config'
import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import { mintWeUSD, erc20Approve, allowanceERC20, redeemWeUSD } from '@/utils/evmContract/contractFun'
import { burnWeUSDCrossChain, erc20Approve as erc20ApproveBridge, allowanceERC20 as allowanceERC20Bridge } from '@/utils/evmContract/bridgeContractFun'
import { getBalance as getEvmBalance, watchChainId, connect as wagmiConnect } from '@wagmi/core'
import { useNetwork } from '@/components/NetwrokProvider'
import { injected } from '@wagmi/connectors'

// 限制小数点后最多6位的辅助函数
const limitDecimalPlaces = (value, decimals = 6) => {
  if (typeof value === 'string' && value.includes('.')) {
    const parts = value.split('.')
    if (parts[1] && parts[1].length > decimals) {
      return parts[0] + '.' + parts[1].substring(0, decimals)
    }
  } else if (typeof value === 'number') {
    const valueStr = value.toString()
    if (valueStr.includes('.')) {
      const parts = valueStr.split('.')
      if (parts[1] && parts[1].length > decimals) {
        return parseFloat(parts[0] + '.' + parts[1].substring(0, decimals))
      }
    }
  }
  return value
}

export default function Section () {
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
  const [queryParams, setQueryParams] = useState({ pageSize: 5, pageNumber: 1 })
  const [tableLoading, setTableLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [tableData, setTableData] = useState([])
  const [PIPIAddr, setPIPIAddr] = useState('')
  const [WEUSDAddr, setWEUSDAddr] = useState('')
  const [tokenBalance, setTokenBalance] = useState({ weusd: 0, pipi: 0, usdt: 0 })
  const [btnLoading, setBtnLoading] = useState(false)
  const wagmiAccount = useAccount()
  const { isConnected, address } = useAccount()
  const { open, close } = useAppKit()
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } = useAppKitNetwork()
  const { chains, switchChain } = useSwitchChain()
  const [inputFromBridge, setInputFromBrdige] = useState('0')
  const [inputToBridge, setInputToBrdige] = useState('')
  const [bridgeToNetwork, setBridgeToNetwork] = useState(Config.networkList[2])
  const [bridgeFromBalance, setBridgeFromBalance] = useState(0)
  const [evmUSDTBalance, setEvmUSDTBalance] = useState(0)
  const [active, setActive] = useState('bridge')
  const { setGlobalNetwork, globalNetwork, connectModalOpen, setConnectModalOpen } = useNetwork()

  useEffect(() => {
    console.log('globalNetwork', globalNetwork)
    console.log('wagmiAccount', wagmiAccount)
    // if (!globalNetwork.chainId) {
    //   if (!connected) {
    //     setIsModalOpen(true)
    //     return
    //   }
    //   return
    // }
    if (globalNetwork.chainId && !wagmiAccount.isConnected) {
      open({ view: 'Connect', namespace: 'eip155' })
      return
    }
    if (globalNetwork.chainId) {
      switchChain({ chainId: globalNetwork.chainId })
    }
    if (globalNetwork && wagmiAccount.isConnected && globalNetwork.chainId) {
      getWeusdBalanceEVM()
    }
  }, [globalNetwork, wagmiAccount, connect])

  const getWeusdBalanceEVM = async () => {
    const network = Config.contract.find(ele => ele.chainId == globalNetwork.chainId)
    const balance = await getTokenBalance(wagmiAccount.address, network.weusdAddress, network.chainId)
    console.log('b', balance)
    setBridgeFromBalance(balance.formatted)
    const usdtBalance = await getTokenBalance(wagmiAccount.address, network.usdcAddress, network.chainId)
    console.log('usdtBalance', usdtBalance)
    console.log('network', network)
    let formattedUSDT = usdtBalance.formatted
    if (typeof formattedUSDT === 'string' && formattedUSDT.includes('.')) {
      // 截取小数点后6位，不四舍五入
      formattedUSDT = formattedUSDT.replace(/^(\d+\.\d{0,6})\d*$/, '$1')
    }
    setEvmUSDTBalance(formattedUSDT)
  }

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
      usdt: bigDiv(res[0], 10 ** 6),
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
    setInputWEUSD(v)
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

  const handleSelect = (type, item) => {
    setNetwork(item)
  }

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
      getWalletTokenBalance()
      getEventList()
      getTotalReverves()
    } catch (error) {
      message.error(errorParse(error))
      console.log(error)
    } finally {
      setBtnLoading(false)
    }
  }

  /** submit redeem */
  const handleREDEEM = async () => {
    if (!connected) {
      setIsModalOpen(true)
      return
    }
    try {
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
      getWalletTokenBalance()
      getEventList()
      getTotalReverves()
    } catch (error) {
      message.error(errorParse(error))
      console.log(error)
    } finally {
      setBtnLoading(false)
    }
  }

  const checkSelectNetwork = async (type) => {
    if (!inputWEUSD || inputWEUSD == '0') {
      message.error('please input amount')
      return
    }
    setBtnLoading(true)
    /** evm wallet */
    if (globalNetwork.chainId) {
      const { isConnected } = wagmiAccount
      // console.log('isConnecting', isConnected)
      if (!isConnected) {
        // to connect and show only ethereum wallets
        open({ view: 'Connect', namespace: 'eip155' })
        setBtnLoading(false)
      }
      if (isConnected) {
        if (chainId != globalNetwork.chainId) {
          try {
            switchChain({ chainId: globalNetwork.chainId })
            message.warning('changing wallet network,please try again after change success')
            setBtnLoading(false)
          } catch (error) {
            message.error(errorParse(error))
            setBtnLoading(false)
          }
          return
        }
        if (type === 'mint') {
          handleMintEVM()
        } else {
          handleRedeemEVM()
        }
      }
    }
    /** movement */
    if (!globalNetwork.chainId) {
      if (type === 'mint') {
        handleMINT()
      } else {
        handleREDEEM()
      }
    }
  }

  const handleMintEVM = async () => {
    try {
      const _configObj = Config.contract.find(item => item.chainId == globalNetwork.chainId)
      const allowanceRes = await allowanceERC20(_configObj.usdcAddress, wagmiAccount.address)
      console.log('approveRes', allowanceRes)
      if (Number(bigDiv(allowanceRes, 10 ** globalNetwork.usdtDecimals)) < Number(inputWEUSD)) {
        console.log('tttt', bigMul(99999, 10 ** globalNetwork.usdtDecimals))
        const approveRes = await erc20Approve(_configObj.usdcAddress, bigMul(99999, 10 ** globalNetwork.usdtDecimals))
        console.log('approveRes', approveRes)
      }
      const res = await mintWeUSD({ amount: bigMul(inputWEUSD, 10 ** 6) })
      console.log('evmRes', res)
      message.success(`mint weusd success,transactionHash is ${res.transactionHash}`)
      setBtnLoading(false)
      getWeusdBalanceEVM()
    } catch (error) {
      console.log('error', error)
      message.error(errorParse(error))
      setBtnLoading(false)
    }
  }

  const handleRedeemEVM = async () => {
    try {
      const _configObj = Config.contract.find(item => item.chainId == globalNetwork.chainId)
      const allowanceRes = await allowanceERC20(_configObj.weusdAddress, wagmiAccount.address)
      console.log('approveRes', allowanceRes)
      if (Number(bigDiv(allowanceRes, 10 ** 6)) < Number(inputWEUSD)) {
        const approveRes = await erc20Approve(_configObj.weusdAddress, bigMul(99999, 10 ** 6))
        console.log('approveRes', approveRes)
      }
      const res = await redeemWeUSD({ amount: bigMul(inputWEUSD, 10 ** 6) })
      console.log('evmRes', res)
      message.success(`redeem weusd success,transactionHash is ${res.transactionHash}`)
      setBtnLoading(false)
      getWeusdBalanceEVM()
    } catch (error) {
      console.log('error', error)
      message.error(errorParse(error))
      setBtnLoading(false)
    }
  }

  const handleBridgeBefore = async () => {
    /** from是evm */
    if ((!globalNetwork.chainId || !bridgeToNetwork.chainId) && !connected) {
      setIsModalOpen(true)
      return
    }
    setBtnLoading(true)
    if (globalNetwork.chainId) {
      const { isConnected } = wagmiAccount
      if (!isConnected) {
        // to connect and show only ethereum wallets
        open({ view: 'Connect', namespace: 'eip155' })
        setBtnLoading(false)
        return
      }
      if (chainId != globalNetwork.chainId) {
        try {
          switchChain({ chainId: globalNetwork.chainId })
          message.warning('changing wallet network,please try again after change success')
          setBtnLoading(false)
        } catch (error) {
          message.error(errorParse(error))
          setBtnLoading(false)
        }
        return
      }
      handleBridgeEvm()
    }
    /** from是move */
    if (!globalNetwork.chainId) {
      handleBridgeMove()
    }
  }

  const handleBridgeEvm = async () => {
    try {
      const _configObj = Config.contract.find(item => item.chainId == globalNetwork.chainId)
      const allowanceRes = await allowanceERC20Bridge(_configObj.weusdAddress, wagmiAccount.address)
      console.log('approveRes', allowanceRes)
      if (Number(bigDiv(allowanceRes, 10 ** 6)) < Number(inputFromBridge)) {
        const approveRes = await erc20ApproveBridge(_configObj.weusdAddress, bigMul(99999, 10 ** 6))
        console.log('approveRes', approveRes)
      }
      const res = await burnWeUSDCrossChain({ targetChainId: bridgeToNetwork.chainId || bridgeToNetwork.networkId, amount: bigMul(inputFromBridge, 10 ** 6), outerUser: bridgeToNetwork.chainId ? wagmiAccount.address : account.address })
      console.log('evmRes', res)
      message.success(`bridge weusd success,transactionHash is ${res.transactionHash}`)
      getWeusdBalanceEVM()
    } catch (error) {
      console.log('error', error)
      message.error(errorParse(error))
    } finally {
      setBtnLoading(false)
    }
  }

  const handleBridgeMove = async () => {
    try {
      const transaction = {
        data: {
          function: `${WEUSD_CROSS_CHAIN_GAS_ABI.address}::${WEUSD_CROSS_CHAIN_GAS_ABI.name}::burnWeUSDCrossChain`,
          functionArguments: [
            bridgeToNetwork.chainId || bridgeToNetwork.networkId,
            bigMul(inputFromBridge, 10 ** 6),
            wagmiAccount.address,
          ],
        },
        options: {
          expireTimestamp: 1,
        },
      }
      const transactionRes = await signAndSubmit(transaction, signAndSubmitTransaction)
      message.success('Bridge WEUSD success')
      getWalletTokenBalance()
    } catch (error) {
      message.error(errorParse(error))
    } finally {
      setBtnLoading(false)
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
    const usdtRes = await getBalance({ accountAddress: account.address, faMetadataAddress: Config.usdcAddr })
    setTokenBalance({
      weusd: bigDiv(weusdRes, 10 ** 6),
      pipi: 0, // 不需要
      usdt: bigDiv(usdtRes, 10 ** 6), // move上usdt精度是6
    })
    console.log('pipiRes', pipiRes)
    console.log('weusdRes', weusdRes)
    console.log('usdtRes', usdtRes)
  }

  useEffect(() => {
    if (connected && WEUSDAddr) {
      getWalletTokenBalance()
    }
  }, [connected, WEUSDAddr])

  useEffect(() => {
    console.log('network', network)
    if (connected && network && network.url != 'https://mainnet.movementnetwork.xyz/v1') {
      message.error('Movement needs to cut over to the mainnet')
    }
  }, [connected])

  // const selectOriginNetworkCallback = async (item) => {
  //   setBridgeFromNetwork(item)
  //   setInputFromBrdige(null)
  //   setInputToBrdige(null)
  //   if (item.chainId) {
  //     const { isConnected } = wagmiAccount
  //     if (isConnected) {
  //       const network = Config.contract.find(ele => ele.chainId == item.chainId)
  //       const balance = await getTokenBalance(wagmiAccount.address, network.weusdAddress, network.chainId)
  //       console.log('b', balance)
  //       setBridgeFromBalance(balance.formatted)
  //     }
  //   }
  // }

  const getTokenBalance = async (address, token, chainId) => {
    try {
      const balance = await getEvmBalance(wagmiConfig, {
        address,
        token,
        chainId,
      })
      return balance
    } catch (error) {
      message.error(errorParse(error))
      return 0
    }
  }

  const handleBridgeMax = () => {
    if (globalNetwork.chainId) {
      setInputFromBrdige(bridgeFromBalance)
      // const _val = decSub(bridgeFromBalance, bridgeToNetwork.fee)
      // setInputToBrdige(_val)
    } else {
      setInputFromBrdige(tokenBalance.weusd)
      // const _val = decSub(tokenBalance.weusd, bridgeToNetwork.fee)
      // setInputToBrdige(_val)
    }
  }

  const handleMintMax = () => {
    if (globalNetwork.chainId) {
      setInputWEUSD(evmUSDTBalance)
    } else {
      setInputWEUSD(tokenBalance.usdt)
    }
  }

  const handleRedeemMax = () => {
    if (globalNetwork.chainId) {
      setInputWEUSD(bridgeFromBalance)
    } else {
      setInputWEUSD(tokenBalance.weusd)
    }
  }

  const handleTurn = () => {
    const _bridgeToNetwork = bridgeToNetwork
    const _globalNetwork = globalNetwork
    setBridgeToNetwork(_globalNetwork)
    setGlobalNetwork(_bridgeToNetwork)
  }

  return <section id="mintWeusd" className="w-full">
    <div className="container xl:max-w-[1100px] mx-auto w-full flex-grow">

      <div className="flex w-[318px] h-[56px] bg-[#23252C] rounded-[16px] p-1 mt-20 mx-auto">
        <button
          className={`flex-1 rounded-[12px] text-base font-semibold transition-all
          ${active === 'bridge'
              ? 'bg-[#454752] text-white shadow'
              : 'bg-transparent text-[#B0B2B8]'}
        `}
          onClick={() => setActive('bridge')}
        >
          Bridge
        </button>
        <button
          className={`flex-1 rounded-[12px] text-base font-semibold transition-all
          ${active === 'mint'
              ? 'bg-[#454752] text-white shadow'
              : 'bg-transparent text-[#B0B2B8]'}
        `}
          onClick={() => setActive('mint')}
        >
          Mint / Redeem
        </button>
      </div>

      {
        active == 'bridge' && (
          <div className="max-w-[510px] w-full bg-[#23252C] rounded-[36px] px-[28px] pt-[39px] pb-[59px] flex flex-col gap-3 shadow-lg mx-auto mt-7 2xl:mt-[30px]">
            {/* Token/From 区块 */}
            <div className='flex items-center cursor-pointer' onClick={() => setConnectModalOpen(true)}>
              <Image className='
                      w-6 h-6
                      rounded-full
                      mr-3
                    ' src={globalNetwork.icon} alt={'WEUSD'} width={24} height={24} />
              {
                globalNetwork.chainId
                  ? (
                    <span className="text-xs">{truncateString(address || 'Connect Wallet')}</span>
                  )
                  : (
                    <span className="text-xs">{truncateString(account?.address || 'Connect Wallet')}</span>
                  )
              }
            </div>
            <div className="flex bg-[#1A1C22] rounded-[20px]">
              <div className="flex-1 flex flex-col items-start border-r border-[#21252E] px-6 py-5">
                <span className="text-[#707279] text-xs mb-2">Token</span>
                <div className="flex items-center">
                  <Image className='
                      w-5 h-5
                      rounded-full
                      mr-2
                    ' src={getImgUrl('coin_weusd.png')} alt={'WEUSD'} width={22} height={22} />
                  <span className="text-white text-sm font-semibold">WEUSD</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-start px-6 py-5">
                <span className="text-[#707279] text-xs mb-2">From</span>
                <div className="flex items-center">
                  <Image className='
                      w-5 h-5
                      mr-2
                      rounded-full
                    ' src={globalNetwork?.icon || ''} alt={globalNetwork?.name || ''} width={22} height={22} />
                  <span className="text-white text-sm font-semibold">{globalNetwork?.name || ''}</span>
                </div>
              </div>
            </div>

            {/* 中间切换按钮 */}
            <div className="flex justify-center cursor-pointer" onClick={() => { handleTurn() }}>
              <Image className='
                      w-6 h-6
                    ' src={'/images/turn.png'} alt={'turn'} width={24} height={24} />
            </div>

            {/* Token/To 区块 */}
            <div className='flex items-center cursor-pointer' onClick={() => setConnectModalOpen(true)}>
              <Image className='
                      w-6 h-6
                      rounded-full
                      mr-3
                    ' src={bridgeToNetwork.icon} alt={'WEUSD'} width={24} height={24} />
              {
                bridgeToNetwork.chainId
                  ? (
                    <span className="text-xs">{truncateString(address || 'Connect Wallet')}</span>
                  )
                  : (
                    <span className="text-xs">{truncateString(account?.address || 'Connect Wallet')}</span>
                  )
              }
            </div>
            <div className="flex bg-[#1A1C22] rounded-[20px]">
              <div className="flex-1 flex flex-col items-start border-r border-[#21252E] px-6 py-5">
                <span className="text-[#707279] text-xs mb-2">Token</span>
                <div className="flex items-center">
                  <Image className='
                      w-5 h-5
                      rounded-full
                      mr-2
                    ' src={getImgUrl('coin_weusd.png')} alt={'WEUSD'} width={22} height={22} />
                  <span className="text-white text-sm font-semibold">WEUSD</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-start px-6 py-5">
                <span className="text-[#707279] text-xs mb-2">To</span>
                <div className="flex items-center w-full">
                  <BridgeSelectNetwork currentCoin={bridgeToNetwork} setCurrentCoin={(item) => { setBridgeToNetwork(item); setInputFromBrdige(null); setInputToBrdige(null) }} excludeList={[globalNetwork]} />
                </div>
              </div>
            </div>

            {/* 金额输入和余额 */}
            <div className="bg-[#1A1C22] rounded-2xl px-6 py-4 flex flex-col gap-2">
              <div className="flex items-center">
                <InputNumber className='flex-grow outline-none bg-transparent text-white text-left !leading-1
                              text-base h-7.5
                            '
                  placeholder=''
                  changeOnWheel={false}
                  controls={false}
                  value={inputFromBridge} min={5}
                  onChange={(value) => {
                    // 限制小数点后最多6位
                    let processedValue = value
                    if (typeof value === 'string' && value.includes('.')) {
                      const parts = value.split('.')
                      if (parts[1] && parts[1].length > 6) {
                        processedValue = parts[0] + '.' + parts[1].substring(0, 6)
                      }
                    } else if (typeof value === 'number') {
                      // 对于数字类型，转换为字符串处理
                      const valueStr = value.toString()
                      if (valueStr.includes('.')) {
                        const parts = valueStr.split('.')
                        if (parts[1] && parts[1].length > 6) {
                          processedValue = parseFloat(parts[0] + '.' + parts[1].substring(0, 6))
                        }
                      }
                    }

                    setInputFromBrdige(processedValue)
                    const _val = decSub(processedValue, bridgeToNetwork.fee)
                    setInputToBrdige(_val)
                  }}
                />
                <span className="text-[#707279] text-xs mr-4 text-right">Balance<br />{globalNetwork.chainId ? bridgeFromBalance : tokenBalance.weusd}</span>
                <button className="bg-[#413D24] text-[#FDDA35] font-bold px-5 py-1 rounded-xl text-xs" onClick={handleBridgeMax}>MAX</button>
              </div>
            </div>

            <div className='flex text-sm'>
              <div className='flex-1'>You will receive</div>
              <div>
                <span>{decSub(inputFromBridge, decAdd(decMul(inputFromBridge, 0.01), globalNetwork.fee))}</span>
              </div>
            </div>

            <div className='flex text-xs'>
              <div className='flex-1'>Transaction Fees</div>
              <div>
                <span>{decAdd(decMul(inputFromBridge, 0.01), globalNetwork.fee)}</span>
              </div>
            </div>

            {/* Bridge 按钮 */}
            <button className="w-full bg-[#FFD100] text-black text-base font-semibold rounded-full py-3 mt-auto hover:bg-[#ffe066] transition" onClick={() => { handleBridgeBefore() }}>
              Bridge
            </button>
          </div>
        )
      }

      {
        active == 'mint' && (
          <>
            {/* <div className='flex bg-[#22252E] rounded-[30px] mb-4
      max-w-[510px] mx-auto
      p-6 mt-7
      xl:p-[28px] xl:mb-6
      2xl:p-[35px]'>
              <div>
                <span className='text-[#fff] text-xs xl:text-2xl mr-1'>${new Intl.NumberFormat().format(poolAmount.usdt || 0)}</span>
                <span className='text-[#707279] text-[10px] xl:text-sm'>USDT</span>
              </div>
            </div> */}
            <Mint 
              debouncedHandleChangeAmount={handleChangeAmount} 
              inputWEUSD={inputWEUSD} 
              mintCost={mintCost} 
              handleMINT={handleMINT} 
              handleREDEEM={handleREDEEM} 
              redeemCost={redeemCost} 
              WEUSDPrice={WEUSDPrice} 
              movePrice={movePrice} 
              PIPIRatio={PIPIRatio} 
              checkSelectNetwork={checkSelectNetwork} 
              handleSelect={handleSelect} 
              btnLoading={btnLoading} 
              handleMintMax={handleMintMax} 
              handleRedeemMax={handleRedeemMax} 
              tokenBalance={tokenBalance} 
              evmUSDTBalance={evmUSDTBalance} 
              bridgeFromBalance={bridgeFromBalance}
            />
            <Balance tokenBalance={tokenBalance} bridgeFromBalance={bridgeFromBalance} />
          </>
        )
      }

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

function Mint ({ 
  debouncedHandleChangeAmount, 
  inputWEUSD, 
  mintCost, 
  handleMINT, 
  handleREDEEM, 
  redeemCost, 
  WEUSDPrice, 
  movePrice, 
  PIPIRatio, 
  checkSelectNetwork, 
  handleSelect, 
  btnLoading, 
  handleMintMax, 
  tokenBalance, 
  evmUSDTBalance, 
  handleRedeemMax,
  bridgeFromBalance
}) {
  const [type, setType] = useState('mint')
  const [amount, setAmount] = useState(0)
  const { globalNetwork } = useNetwork()
  const [redeemInput, setRedeemInput] = useState(0)

  return <div className='w-full bg-[#22252E] overflow-hidden text-white
    max-w-[510px] mx-auto
    rounded-[18px] px-[19px] py-[19px]
    md:rounded-[18px] md:px-[19px] md:py-[19px]
    lg:rounded-[22px]  lg:px-[19px] lg:py-[19px]
    xl:rounded-[26px]  xl:px-7 xl:py-[36px]
    2xl:rounded-[30px]  2xl:px-7 2xl:py-[36px]
    mt-7 2xl:mt-[30px]
  '>
    <div className='text-base mb-[22px]
    '>Mint or redeem WEUSD</div>
    {/* <div className='flex items-center justify-center border border-[#3A3A3A] bg-[#1C1C1C] font-open-sans
    w-30 h-10 gap-1.5 rounded-[6px]
    md:w-[140px] md:h-11 md:gap-2 md:rounded-[6px]
    lg:w-[150px] lg:h-12 lg:gap-2.5 lg:rounded-[8px]
    xl:w-48 xl:h-12.5 xl:gap-3 xl:rounded-[10px]
  '>
      <Image className='
      w-7 h-7
      md:w-7.5 md:h-7.5
      lg:w-8 lg:h-8
      rounded-full
    ' src={globalNetwork?.icon || ''} alt={globalNetwork?.name || ''} width={40} height={40} />
      <span className='
      text-sm
    '>
        {globalNetwork?.name || ''}
      </span>
    </div> */}
    <div className='w-full flex items-center justify-center bg-[#1A1C22] mt-4
      rounded-[27px] text-xs h-6
       md:h-6
       lg:h-6
       xl:h-10
       2xl:h-[42px] mx-1 py-1 px-1
    '>
      <button className={cn('flex-1 h-full rounded-full flex items-center justify-center uppercase transition-all duration-300 font-semibold',
        type === 'mint' ? 'bg-[#FFDA34] text-black' : 'text-[#707279] bg-transparent',
      )} onClick={() => setType('mint')}>
        mint
      </button>
      <button className={cn('flex-1 h-full  rounded-full flex items-center justify-center uppercase transition-all duration-300 font-semibold',
        type === 'redeem' ? 'bg-[#FFDA34] text-black' : 'text-[#707279] bg-transparent',
      )} onClick={() => setType('redeem')}>
        redeem
      </button>
    </div>

    <div className='w-full bg-[#1A1C22] rounded-[20px] py-[2px] mt-[13px]
      md:mt-[13px]
      lg:mt-[13px]
      xl:mt-[14px]
      2xl:mt-[26px]
    '>
      {
        type == 'mint' && (
          <>
            <div className='flex items-center px-5 2xl:px-[22px] pt-4 2xl:pt-[18px] pb-3'>
              <Image className='h-7
        w-7
      ' src={getImgUrl('coin_usdc.png')} alt="usdt" width={28} height={28} />
              <div className='text-sm font-semibold ml-2 2xl:ml-[10px]'>USDC</div>
              <div className='text-sm flex-1'>
                <InputNumber className='w-full h-full text-right text-white text-sm font-semibold'
                  changeOnWheel={false}
                  controls={false}
                  value={inputWEUSD}
                  min={0}
                  onChange={(value) => {
                    const processedValue = limitDecimalPlaces(value)
                    debouncedHandleChangeAmount(processedValue)
                  }}
                />
              </div>
            </div>
            <div className='flex items-center pb-4 2xl:pb-[18px] border-b border-[#21252E] 2xl:px-[22px]'>
              <div className='text-[#707279] text-xs flex-1'>
                Balance: {globalNetwork.chainId ? evmUSDTBalance : tokenBalance.usdt}
              </div>
              <div className='text-[#FDDA35] text-sm font-semibold underline cursor-pointer' onClick={handleMintMax}>MAX</div>
            </div>
            <div className='flex items-center px-5 2xl:px-[22px] py-4 2xl:py-[18px]'>
              <Image className='h-7
        w-7
      ' src={getImgUrl('coin_weusd.png')} alt="usdt" width={28} height={28} />
              <div className='text-sm font-semibold ml-2 2xl:ml-[10px]'>WEUSD</div>
              <div className='text-sm flex-1'>
                <InputNumber className='w-full h-full text-right text-white text-sm font-semibold'
                  changeOnWheel={false}
                  controls={false}
                  value={inputWEUSD}
                  min={0}
                  onChange={(value) => {
                    const processedValue = limitDecimalPlaces(value)
                    debouncedHandleChangeAmount(processedValue)
                  }}
                />
              </div>
            </div>
          </>
        )
      }

      {
        type == 'redeem' && (
          <>
            <div className='flex items-center px-5 2xl:px-[22px] pt-4 2xl:pt-[18px] pb-3'>
              <Image className='h-7
        w-7
      ' src={getImgUrl('coin_weusd.png')} alt="usdt" width={28} height={28} />
              <div className='text-sm font-semibold ml-2 2xl:ml-[10px]'>WEUSD</div>
              <div className='text-sm flex-1'>
                <InputNumber className='w-full h-full text-right text-white text-sm font-semibold'
                  changeOnWheel={false}
                  controls={false}
                  value={inputWEUSD}
                  min={0}
                  onChange={(value) => {
                    const processedValue = limitDecimalPlaces(value)
                    debouncedHandleChangeAmount(processedValue)
                    const _val = limitDecimalPlaces(bigMul(0.99, processedValue))
                    setRedeemInput(_val)
                  }}
                />
              </div>
            </div>
            <div className='flex items-center pb-4 2xl:pb-[18px] border-b border-[#21252E] 2xl:px-[22px]'>
              <div className='text-[#707279] text-xs flex-1'>
                Balance: {globalNetwork.chainId ? bridgeFromBalance : tokenBalance.weusd}
              </div>
              <div className='text-[#FDDA35] text-sm font-semibold underline cursor-pointer' onClick={handleRedeemMax}>MAX</div>
            </div>
            <div className='flex items-center border-b border-[#21252E] px-5 2xl:px-[22px] py-4 2xl:py-[18px] '>
              <Image className='h-7
        w-7
      ' src={getImgUrl('coin_usdc.png')} alt="usdt" width={28} height={28} />
              <div className='text-sm font-semibold ml-2 2xl:ml-[10px]'>USDC</div>
              <div className='text-sm flex-1'>
                <InputNumber className='w-full h-full text-right text-white text-sm font-semibold'
                  changeOnWheel={false}
                  controls={false}
                  value={redeemInput}
                  min={0}
                  onChange={(value) => {
                    const processedValue = limitDecimalPlaces(value)
                    setRedeemInput(processedValue)
                    const _val = bigDiv(processedValue, 0.99, 6)
                    debouncedHandleChangeAmount(_val)
                  }}
                />
              </div>
            </div>
          </>
        )
      }

      {/* <div className='flex-1'>
        <div className=' text-[#707279] text-xs mb-[10px]
        md:mb-[10px]
        lg:mb-[14px]
        xl:mb-[16px]
        2xl:mb-[18px]
        '>Amount to {type === 'mint' ? 'Mint' : 'Redeem'}</div>
        <div className=' border border-[#26282C] rounded-[5px] w-[140px] h-[27px] py-[2px] px-[7px] text-base
          md:w-[140px] md:h-[27px] md:py-[2px] md:px-[7px]
          lg:w-[180px] lg:h-[30px] lg:py-[4px] lg:px-[9px] lg:text-base
          xl:w-[240px] xl:h-[40px] xl:py-[5px] xl:px-[11px] xl:text-base
          2xl:w-[260px] 2xl:h-[50px] 2xl:py-[7px] 2xl:px-[13px] 2xl:text-base
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
            type == 'mint'
              ? (
                <span> USDT: {inputWEUSD}</span>
              )
              : (
                <span>WEUSD: {inputWEUSD}</span>
              )
          }

        </div>
      </div>

      <div>
        <div className='text-[#707279] text-xs mb-[10px]
        md:text-xs md:mb-[10px]
        lg:text-xs lg:mb-[12px]
        xl:text-xs xl:mb-[13px]
        2xl:text-xs 2xl:mb-[14px]'>
          Estimated Return
        </div>
        <div className='text-right text-sm mb-[7px]
          md:text-xs md:mb-[7px]
          lg:text-xs  lg:mb-[9px]
          xl:text-xs  xl:mb-[11px]
          2xl:text-xs 2xl:mb-[12px]
        '>
          {
            type === 'mint'
              ? (
                <>
                  <span className='text-xs'>{inputWEUSD}</span>
                  <span className='text-[#707279] ml-1 text-xs md:text-sm'>WEUSD</span>
                </>
              )
              : (
                <>
                  <span className='text-xs'>{bigMul(0.99, inputWEUSD)}</span>
                  <span className='text-[#707279] ml-1 text-xs md:text-sm'>USDT</span>
                </>
              )
          }

        </div>
      </div> */}
    </div>

    {/* <Button loading={btnLoading} onClick={() => { checkSelectNetwork(type) }} className='w-full  flex items-center justify-center rounded-full relative
      bg-[#FFDA34] text-black hover:text-black hover:bg-[#FFDA34] transition-all duration-300
      mt-[20px] h-10 text-base font-semibold
    '>
      <span className="py-4">
        {type === 'mint' ? 'Mint WEUSD' : 'Redeem USDT'}
      </span>

    </Button> */}
    <button className="w-full mt-[20px] bg-[#FFD100] text-black text-base font-semibold rounded-full py-3 hover:bg-[#ffe066] transition" onClick={() => { checkSelectNetwork(type) }}>
      {type === 'mint' ? 'Mint WEUSD' : 'Redeem USDC'}
    </button>
  </div>
}

function Balance ({ tokenBalance, bridgeFromBalance }) {
  const { globalNetwork } = useNetwork()
  return <div className='w-full flex text-white
    max-w-[510px] mx-auto
    mt-2 gap-2
    md:mt-5 md:gap-2.5
  '>
    <div className='flex-1 bg-[#22252E] flex items-center
      rounded-[8px] py-2 px-2 gap-2
      md:rounded-[16px] md:py-4 md:px-5
      lg:rounded-[20px] lg:py-3
      xl:rounded-[26px] xl:py-5 xl:pl-5 xl:pr-8
      2xl:rounded-[30px]
    '>
      <Image className='h-9
        w-9
        2xl:w-[38px] 2xl:h-[38px]
      ' src={getImgUrl('logo_WEUSD.png')} alt="balance_icon" width={38} height={38} />
      <h1 className='font-medium font-open-sans
          text-base flex-1 ml-4 2xl:ml-[17px]
        '>WEUSD</h1>
      <div className='flex items-center'>
        <div className='text-xl'>{globalNetwork.chainId ? bridgeFromBalance : tokenBalance.weusd}</div>
        {/* <div className='text-xs text-[#707279]'>(${globalNetwork.chainId ? bridgeFromBalance : tokenBalance.weusd})</div> */}
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

function Pool ({ poolAmount, movePrice }) {
  const infoList = [
    { id: 1, title: 'Native Stablecoin', intro: '$WEUSD anchors your DeFi activities on the Movement/EVM Chain, ensuring a stable peg and swift transactions.' },
    // { id: 2, title: 'Gateway to PIPI', intro: 'When you mint $WEUSD, you gain direct access to $PIPI—the AI Agent token poised to enhance your DeFi experience.' },
    { id: 2, title: 'Omnichain Ready', intro: 'Designed with cross-chain functionality in mind, $WEUSD lets you move assets smoothly between multiple networks.' },
  ]
  return (
    <div className='w-full'>
      <div className='text-base xl:text-2xl xl:pt-3 xl:pl-2 xl:pb-6'>What is $WEUSD?</div>
      <div className='
      xl:flex xl:justify-between xl:flex-wrap
      '>
        {infoList.map((item, idx) => (
          <div className='group' key={idx}>
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
                    <line x1="4.25" y1="0" x2="4.25" y2="8.5" stroke="#FFC90F" strokeWidth="1.5" strokeLinecap="round" className="hidden" />
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
}

function MyTable ({ handleChangePage, tableData, total }) {
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

function SelectNetwork ({ currentCoin, setCurrentCoin, excludeList = [] }) {
  return <div className='flex-none relative group '>
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
      rounded-full
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
    h-0 group-hover:h-[152px] group-hover:border
    rounded-[10px] overflow-y-scroll
  '>
      {
        Config.networkList
          .filter(item => !excludeList.find(ex => ex.chainId === item.chainId))
          .map(item => (
            <div key={item.name} className='w-full h-12.5 flex items-center cursor-pointer
          text-sm gap-2.5 px-3
          md:text-base md:gap-3 md:px-3.5
          lg:text-lg lg:gap-3.5 lg:px-4
        ' onClick={() => setCurrentCoin(item)}>
              <Image className='
            w-7 h-7
            md:w-7.5 md:h-7.5
            lg:w-8 lg:h-8
            rounded-full
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

function BridgeSelectNetwork ({ currentCoin, setCurrentCoin, excludeList = [] }) {
  return <div className='flex-none relative group w-full '>
    <div className='flex items-center font-open-sans w-full'>
      <Image className='
      w-5 h-5
      mr-2
      rounded-full
    ' src={currentCoin.icon} alt={currentCoin.name} width={22} height={22} />
      <span className='
      text-sm
      font-semibold
      flex-1
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
    <div className='absolute z-10 left-[-24px] top-full w-[226px] border-[#3A3A3A] bg-[#1C1C1C] font-open-sans overflow-hidden transition-all duration-200
    h-0 group-hover:h-[152px] group-hover:border
    rounded-[10px] overflow-y-scroll hide-scrollbar mt-5
  '>
      {
        Config.networkList
          .filter(item => !excludeList.find(ex => ex.chainId === item.chainId))
          .map(item => (
            <div key={item.name} className='w-full h-12.5 flex items-center cursor-pointer
          text-sm gap-2.5 px-6
          hover:bg-[#1E2129]
        ' onClick={() => setCurrentCoin(item)}>
              <Image className='
            w-5 h-5
            rounded-full
          ' src={item.icon} alt={item.name} width={22} height={22} />
              <span className=''>
                {item.name}
              </span>
            </div>
          ))
      }
    </div>
  </div>
}
