/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
'use client'
import Link from 'next/link'
import { classnames } from '@/utils'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import ScrollTrigger from 'gsap/ScrollTrigger'
import useDeviceType from '@/hooks/useDeviceType'
import Menu from './Menu'
import { usePathname } from 'next/navigation'
import '@aptos-labs/wallet-adapter-ant-design/dist/index.css'
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design'
import { useModal } from '@/components/ReactQueryClientProvider'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { truncateString } from '@/utils/utils'
import NetworkSelect from './NetworkSelect'
import { useNetwork } from '@/components/NetwrokProvider'
import { useAccount, useSwitchChain } from 'wagmi'
import { useAppKit, useAppKitNetwork, useDisconnect } from '@reown/appkit/react'
import { Modal } from 'antd'
// import { disconnect as wagmiDisconnect } from '@wagmi/core'
import wagmiConfig from '@/config/config'
import Config from '@/config/index'

export default function Navbar ({ lang, dict }) {
  const { account, connected, wallet, network, changeNetwork, connect, disconnect, signAndSubmitTransaction } = useWallet()
  const { chains, switchChain } = useSwitchChain()
  const { isModalOpen, setIsModalOpen } = useModal()
  const pathname = usePathname()
  const menuData = dict?.home?.menu || {}

  const { isConnected, address } = useAccount()
  const { open, close } = useAppKit()
  const { chainId } = useAppKitNetwork()
  const { disconnect: wagmiDisconnect } = useDisconnect()

  const menuList = [
    {
      id: 1,
      label: menuData['0']?.label,
      href: `/${lang}`,
    },
    {
      id: 2,
      label: menuData['1']?.label,
      items: [
        { id: 1, label: menuData['1']?.items['0']?.label, intro: menuData['1']?.items['0']?.intro, href: `/${lang}/bridge`, target: '_self' },
        { id: 2, label: menuData['1']?.items['1']?.label, intro: menuData['1']?.items['1']?.intro, isComingSoon: true, href: '', target: '_blank' },
        { id: 3, label: menuData['1']?.items['2']?.label, intro: menuData['1']?.items['2']?.intro, isComingSoon: true, href: '', target: '_blank' },
      ],
    },
    {
      id: 3,
      label: menuData['2']?.label,
      items: [
        { id: 1, label: menuData['2']?.items['0']?.label, intro: menuData['2']?.items['0']?.intro, href: 'https://picwe.gitbook.io/picwe', target: '_blank' },
        { id: 2, label: menuData['2']?.items['1']?.label, intro: menuData['2']?.items['1']?.intro, href: `${lang}/brand`, target: '_blank' },
      ],
    },
    {
      id: 4,
      label: menuData['3']?.label,
      items: [
        { id: 1, label: menuData['3']?.items['0']?.label, intro: menuData['3']?.items['0']?.intro, href: 'https://picwe.gitbook.io/picwe', target: '_blank' },
        { id: 2, label: menuData['3']?.items['1']?.label, intro: menuData['3']?.items['1']?.intro, href: 'https://drive.google.com/file/d/16vNHYdKg9uifh286dTmXvhiwzeWapxF6/view', target: '_blank' },
      ],
    },
    {
      id: 5,
      label: menuData['4']?.label,
      items: [
        { id: 1, type: 'language', label: 'English', value: 'en' },
        { id: 2, type: 'language', label: '中文', value: 'cn' },
      ],
    },
  ]

  const { deviceIsMobile } = useDeviceType()

  const [currentMenuIndex, setCurrentMenuIndex] = useState(null)

  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const { setGlobalNetwork, globalNetwork, connectModalOpen, setConnectModalOpen } = useNetwork()

  // const [connectModalOpen, setConnectModalOpen] = useState(false)

  const initGsap = () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
    ScrollTrigger.create({
      trigger: '.home-banner',
      start: 'bottom-=80px top',
      end: 'bottom+=0px top',
      scrub: true,
      // markers: true,
      onUpdate: (self) => {
        gsap.to('.common-header', {
          opacity: self.progress,
        })
      },
    })
  }

  useEffect(() => {
    initGsap()

    if (isOpenMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpenMenu])

  const handleClickItem = (item) => {
    if (item.type === 'language') {
      if (lang !== item.value) {
        window.location.href = `/${item.value}`
      }
    } else if (item.href) {
      window.open(item.href, item.target)
    }
  }

  const _network = Config.networkList.find(item => item.chainId === chainId)

  const handleGlobalNetwrok = async (item) => {
    if (item.chainId) {
      switchChain({ chainId: item.chainId })
    }
    setGlobalNetwork(item)
  }

  useEffect(() => {
    console.log('isConnected', isConnected)
    console.log('chainId', chainId)
    console.log('_network', _network)
  }, [isConnected])

  return <>
    {/* pc */}
    <header className={classnames('z-[999] left-0 top-0 w-full common-header bg-[#15161B]',
      'hidden md:block',
      'pt-5',
      pathname.includes('swap') || pathname.includes('brand') || pathname.includes('bridge') ? 'opacity-100' : 'opacity-0 fixed',
    )}>
      <div className="flex items-center w-full pr-6">
        <div className='flex-grow flex items-center rounded-full  text-white
          h-18 px-7
        '>
          <Link href={`/${lang}`}>
            <Image src='/images/logo.png' alt='logo' width={111} height={30}
              className='h-auto
                w-[111px]
            '
            />
          </Link>
          <div className='h-full flex items-center ml-16
            gap-5
          '>
            <Menu lang={lang} dict={dict} />
            {
              !pathname.includes('swap') && !pathname.includes('bridge') && (
                <a href={`/${lang}/bridge`} target='_blank' className='flex items-center justify-center bg-[#FFC90F] font-bold rounded-full border border-[#FFC90F] transition-all duration-300
                hover:bg-transparent hover:border-black
                h-11 px-6 text-lg
              '>
                  <span className=''>Launch app</span>
                </a>
              )
            }
          </div>
        </div>
        {
          (pathname.includes('swap') || pathname.includes('bridge')) && (
            // <appkit-button className="evmwallet-content-btn"/>
            <button onClick={() => { setConnectModalOpen(true) }} className='ml-2 mr-2 flex-none flex items-center justify-center bg-[#FFC90F] text-black font-bold rounded-full transition-all duration-300
            hover:bg-white hover:text-black
            h-9 px-4 text-sm
          '>
              {
                (connected || isConnected) && (
                  <Image src='/images/wallet_icon.png' alt="movement" width={16} height={16} className='w-4 h-4 mr-3' />
                )
              }
              {
                (connected || isConnected) && (
                  globalNetwork.chainId
                    ? (
                      <span>{truncateString(address || 'Connect Wallet')}</span>
                    )
                    : (
                      <span>{truncateString(account?.address || 'Connect Wallet')}</span>
                    )

                )
              }
              {
                !connected && !isConnected && (
                  <span className=''>Connect Wallet</span>
                )
              }
            </button>
          )
        }
        {
          (pathname.includes('swap') || pathname.includes('bridge')) && (
            <NetworkSelect onChange={(item) => { handleGlobalNetwrok(item) }} />
          )
        }
      </div>
    </header>

    {/* mobile */}
    <header className='fixed z-[9999] left-0 top-0 w-full h-18 px-5 flex items-center justify-between bg-black backdrop-blur
      md:hidden
    '>
      <Image src='/images/logo.png' alt='logo' width={111} height={30}
        className='h-auto
          w-[89px]
        '
      />

      <div className='flex items-center'>
        {
          !pathname.includes('swap') && !pathname.includes('bridge') && (
            <a href={`/${lang}/bridge`} target='_blank' className='bg-[#FFC90F] text-black rounded-full flex items-center justify-center
              h-7 px-3 text-xs font-semibold
            '>
              <span className=''>Launch app</span>
            </a>
          )
        }
        {
          (pathname.includes('swap') || pathname.includes('bridge')) && (
            // <appkit-button className="evmwallet-content-btn"/>
            <button onClick={() => { setConnectModalOpen(true) }} className='ml-2 mr-2 flex-none flex items-center justify-center bg-[#FFC90F] text-black font-bold rounded-full transition-all duration-300
            hover:bg-white hover:text-black
            h-9 px-2 text-sm
          '>
              {/* {
                (connected || isConnected) && (
                  <Image src='/images/wallet_icon.png' alt="movement" width={16} height={16} className='w-4 h-4 mr-3' />
                )
              } */}
              {
                (connected || isConnected) && (
                  globalNetwork.chainId
                    ? (
                      <span>{truncateString(address || 'Connect', 4, 4)}</span>
                    )
                    : (
                      <span>{truncateString(account?.address || 'Connect', 4, 4)}</span>
                    )

                )
              }
              {
                !connected && !isConnected && (
                  <span className=''>Connect</span>
                )
              }
            </button>
          )
        }
        {
          (pathname.includes('swap') || pathname.includes('bridge')) && (
            <NetworkSelect onChange={(item) => { handleGlobalNetwrok(item) }} />
          )
        }
        <button onClick={() => setIsOpenMenu(true)}>
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.512939" y="0.395996" width="21.4172" height="3.21259" rx="1.60629" fill="white" />
            <rect x="0.512939" y="8.24902" width="21.4172" height="3.21259" rx="1.60629" fill="white" />
            <rect x="0.512939" y="16.1021" width="21.4172" height="3.21259" rx="1.60629" fill="white" />
          </svg>
        </button>
      </div>
    </header>

    {
      deviceIsMobile && <div className={classnames('fixed z-[10000] left-0 top-0 w-full h-full bg-white text-black',
        'transition-all duration-300 flex flex-col',
        isOpenMenu ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
      )}>
        <div className='w-full px-5 h-18 flex items-center justify-between
        '>
          <Image src='/images/logo_dark.png' alt='logo' width={111} height={30}
            className='h-auto
              w-[125px]
            '
          />
          <button onClick={() => setIsOpenMenu(false)}>
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.513672" y="16.0427" width="21.4172" height="3.21259" rx="1.60629" transform="rotate(-45 0.513672 16.0427)" fill="black" />
              <rect x="15.658" y="18.3145" width="21.4172" height="3.21259" rx="1.60629" transform="rotate(-135 15.658 18.3145)" fill="black" />
            </svg>
          </button>
        </div>
        <div className='flex-grow w-full overflow-x-hidden overflow-y-auto'>
          {
            menuList.map(item => (
              <div key={item.id} className='w-full' onClick={() => setCurrentMenuIndex(item.id)}>
                <div className='w-full px-5'>
                  <div className='w-full flex items-center justify-between border-t border-[#D9D9D9]'>
                    <h1 className='text-xl font-bold py-5'>{item.label}</h1>
                    {
                      currentMenuIndex === item.id
                        ? (
                          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 13H25.5M13 25.5L13 0.5" stroke="#D9D9D9" />
                          </svg>
                        )
                        : (
                          <svg width="26" height="1" viewBox="0 0 26 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 0.5H25.5" stroke="#D9D9D9" />
                          </svg>
                        )
                    }
                  </div>
                </div>
                {
                  item.items && item.items.length > 0 && (
                    <div className={classnames('w-full flex-col',
                      currentMenuIndex === item.id ? 'flex' : 'hidden',
                    )}>
                      {
                        item.items && item.items.map(subItem => (
                          <div key={subItem.id} className='w-full py-3 hover:bg-[#FFC90F]'
                            onClick={() => handleClickItem(subItem)}
                          >
                            <div className='w-full px-5'>
                              <h1 className='text-base font-bold
                                px-2 py-0.5
                              '>{subItem.label}</h1>
                              <h2 className='text-xs
                                pl-2
                              '>
                                {subItem.intro || ''}
                              </h2>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )
                }
              </div>
            ))
          }
        </div>
      </div>
    }

    {/* Antd Modal for EVM Wallet */}
    <Modal
      open={connectModalOpen}
      onCancel={() => setConnectModalOpen(false)}
      footer={null}
      centered
      styles={{
        content: {
          padding: '32px 24px', // 上下32px，左右24px
          background: '#21252E',
          borderRadius: 30,
        },
      }}
      closeIcon={
        <Image src="/images/close.png" alt="close" width={16} height={16} />
      }
      zIndex={980}
    >
      <h2 className="text-base font-semibold mb-2 text-white ml-6">Connect Wallet</h2>
      <div className='text-[#707279] text-xs mb-9 ml-6'>You can only connect one wallet per environment</div>
      {
        isConnected
          ? (
            <div className='rounded-[20px] bg-[#191C21] py-4 pl-6 pr-4 flex items-center cursor-pointer hover:bg-[#979797] mb-4' onClick={async () => {
              // await wagmiDisconnect(wagmiConfig)
              await wagmiDisconnect()
              // open({ view: 'Account' })
            }}>
              <Image src={_network?.icon} alt={_network?.name} width={30} height={30} className='w-7 h-7 rounded-full' />
              <div className='text-sm font-semibold flex-1 text-white ml-3'>{truncateString(address || '')}</div>
              <Image src="/images/logout.png" alt="logout" width={18} height={18} className='w-5 h-5' />
            </div>)
          : (
            <div className='rounded-[20px] bg-[#191C21] py-4 pl-6 pr-4 flex items-center cursor-pointer hover:bg-[#979797] mb-4' onClick={() => {
              open({ view: 'Connect', namespace: 'eip155' })
            }}>
              <div className='text-sm font-semibold flex-1 text-white'>EVM</div>
              <Image src="/images/coin_weth.png" alt="eth" width={30} height={30} className='w-7 h-7 ml-3 rounded-full' />
              <Image src="/images/coin_bsc.png" alt="bsc" width={30} height={30} className='w-7 h-7 ml-3 rounded-full' />
              <Image src="/images/coin_arb.png" alt="arb" width={30} height={30} className='w-7 h-7 ml-3 rounded-full' />
            </div>
          )
      }

      {
        connected
          ? (
            <div className='rounded-[20px] bg-[#191C21] py-4 pl-6 pr-4 flex items-center cursor-pointer hover:bg-[#979797] mb-4' onClick={async () => {
              disconnect()
            }}>
              <Image src='/images/coin_move.png' alt="movement" width={30} height={30} className='w-7 h-7 rounded-full' />
              <div className='text-sm font-semibold flex-1 text-white ml-3'>{truncateString(account?.address || '')}</div>
              <Image src="/images/logout.png" alt="logout" width={18} height={18} className='w-5 h-5' />
            </div>
          )
          : (
            <div className='rounded-[20px] bg-[#191C21] py-4 pl-6 pr-4 flex items-center cursor-pointer hover:bg-[#979797]' onClick={() => {
              setIsModalOpen(true)
            }}>
              <div className='text-sm font-semibold flex-1 text-white'>MOVEMENT</div>
              <Image src="/images/coin_move.png" alt="movement" width={30} height={30} className='w-7 h-7 rounded-full' />
            </div>
          )
      }

    </Modal>

    <div className="hidden">
      <WalletSelector setModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
    </div>
  </>
}
