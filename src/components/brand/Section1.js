'use client'

import { useState } from 'react'
import { classnames } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import XIcon from '@/assets/icons/x.svg'
import DiscordIcon from '@/assets/icons/discord.svg'
import TelegramIcon from '@/assets/icons/telegram.svg'
import PicweLogos from './PicweLogos'
import WEUSDLogos from './WEUSDLogos'

export default function Section1 ({ lang, dict }) {
  const [currentType, setCurrentType] = useState('picwe')

  const linkList = [
    { id: 1, name: 'x', icon: XIcon, href: 'https://x.com/PicWeGlobal' },
    { id: 2, name: 'discord', icon: DiscordIcon, href: 'https://discord.gg/picwe' },
    { id: 3, name: 'telegram', icon: TelegramIcon, href: 'https://t.me/PicWeCommunity' },
  ]

  const downloadPNG = () => {
    if (currentType === 'picwe') {
      // const link = '/zip/Picwe-Logo-PNG.zip'
      const link = 'https://drive.google.com/drive/folders/1dVmN017c2FAelI8lXiIrv42a4RGcZWrB?usp=sharing'
      window.open(link, '_blank')
    } else {
      // const link = '/zip/WEUSD-Logo-PNG.zip'
      const link = 'https://drive.google.com/drive/folders/1i4iP3UtaIlSo3UVJC-YTol5vIEWgvA4w?usp=sharing'
      window.open(link, '_blank')
    }
  }

  const downloadSVG = () => {
    if (currentType === 'picwe') {
      // const link = '/zip/Picwe-Logo-SVG.zip'
      const link = 'https://drive.google.com/drive/folders/1g9N4Cw2YDSQa0veT0aq9wVQNCbKtI8gW?usp=sharing'
      window.open(link, '_blank')
    } else {
      // const link = '/zip/WEUSD-Logo-SVG.zip'
      const link = 'https://drive.google.com/drive/folders/1itY0tzFsWHX9tov29IuifS7mKt4mjOKp?usp=sharing'
      window.open(link, '_blank')
    }
  }
  return <div className="min-h-[calc(100vh-92px)] w-full bg-white text-black
    pt-[140px]
  ">
    <div className='container mx-auto'>
      <Image className='h-auto
        w-20
      ' src="/images/brand-logo.png" alt="logo" width={100} height={100} />
      <h1 className='font-bold
        mt-5 text-[64px]
      '>
        {dict.brand.title}
      </h1>

      {/* 类型选择 */}
      <div className='bg-[#F9F9F9] w-fit rounded-full flex items-center
        mt-10 h-15 px-2 py-1 gap-2
      '>
        <div className={classnames(`rounded-full font-medium cursor-pointer
          px-7.5 py-2 text-lg
        `,
        currentType === 'picwe' ? 'bg-white' : 'text-[#989898]',
        )} onClick={() => setCurrentType('picwe')}>PicWe</div>
        <div className={classnames(`rounded-full font-medium cursor-pointer
          px-7.5 py-2 text-lg
        `,
        currentType === 'weusd' ? 'bg-white' : 'text-[#989898]',
        )} onClick={() => setCurrentType('weusd')}>WEUSD</div>
      </div>

      {/* 标题 */}
      <div className='flex items-center justify-between
        mt-10 gap-10
      '>
        <h2 className='font-bold
          text-[36px]
        '>PicWe Logo</h2>
        <div className='flex items-center
          gap-10
        '>
          <button className='border border-black rounded-full flex items-center
            px-7.5 py-1.5 gap-4
          ' onClick={downloadPNG}>
            PNG
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
              <path d="M3.97461 15.9428V27.1876H26.4746V15.9376" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.8496 15.3126L15.2246 20.9376L9.59961 15.3126" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.2197 4.68762V20.9376" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className='border border-black rounded-full flex items-center
            px-7.5 py-2 gap-4
          ' onClick={() => downloadSVG}>
            SVG
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
              <path d="M3.97461 15.9428V27.1876H26.4746V15.9376" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.8496 15.3126L15.2246 20.9376L9.59961 15.3126" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.2197 4.68762V20.9376" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 内容 */}
      <div className='w-full
        mt-15
      '>
        {
          currentType === 'picwe' ? <PicweLogos dict={dict} /> : <WEUSDLogos dict={dict} />
        }
      </div>

      {/* 底部 */}
      <div className='flex items-center justify-between
        mt-15 pb-6
        md:mt-20 md:pb-7
        lg:mt-30 lg:pb-8
        xl:mt-[150px] xl:pb-9
        2xl:mt-[170px] 2xl:pb-10
      '>
        <svg xmlns="http://www.w3.org/2000/svg" width="124" height="36" viewBox="0 0 124 36" fill="none">
          <g clipPath="url(#clip0_364_2873)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6391 0.224854C21.4211 0.224854 22.8725 1.72512 22.8725 3.56723V19.0257C22.8725 22.0073 20.5209 24.4381 17.6366 24.4381H15.8729C15.3218 24.571 14.1644 25.1218 14.1644 26.755C14.1644 28.692 15.6525 29.1858 16.1118 29.1858H17.7101C18.5552 29.2048 19.3268 29.2048 20.0065 29.1858C21.0353 29.1478 23.6257 28.4451 25.7384 25.7864C27.153 24.0013 27.8144 21.7794 27.7409 19.1017V11.0116H30.6436C32.4256 11.0116 33.877 12.5119 33.877 14.354V32.0344C33.877 33.8005 32.4991 35.2249 30.7906 35.2249H14.2379C12.4558 35.2249 11.0045 33.7246 11.0045 31.8825V16.424C11.0229 13.4424 13.3561 11.0116 16.2404 11.0116H18.004C18.5552 10.8787 19.7126 10.3279 19.7126 8.69474C19.7126 6.75768 18.2245 6.26392 17.7652 6.26392H16.1669C15.3218 6.24493 14.5502 6.24493 13.8705 6.26392C12.8416 6.3019 10.2513 7.00456 8.13856 9.66327C6.72395 11.4484 6.06258 13.6703 6.13607 16.348V24.4191H3.23338C1.45135 24.4191 0 22.9188 0 21.0767V3.39631C0 1.64916 1.37786 0.224854 3.0864 0.224854H19.6391Z" fill="black"/>
            <path d="M58.3735 13.9893C58.3735 17.8577 55.4029 20.9304 51.5449 20.9304H48.0304V27.7234H44.0879V7.05005H51.5449C55.401 7.05005 58.3735 10.1209 58.3735 13.9912V13.9893ZM54.4586 13.9893C54.4586 12.1871 53.2295 10.8577 51.5449 10.8577H48.0304V17.119H51.5449C53.2314 17.119 54.4586 15.7611 54.4586 13.9893Z" fill="black"/>
            <path d="M60.3447 8.85049C60.3447 7.58001 61.3735 6.48804 62.6026 6.48804C63.8316 6.48804 64.888 7.58001 64.888 8.85049C64.888 10.121 63.8592 11.1845 62.6026 11.1845C61.346 11.1845 60.3447 10.121 60.3447 8.85049ZM60.7728 12.9563H64.4581V27.7235H60.7728V12.9563Z" fill="black"/>
            <path d="M67.0869 20.3398C67.0869 15.9397 70.2872 12.5422 74.6302 12.5422C77.43 12.5422 79.8587 14.0786 81.0308 16.3518L77.8599 18.2718C77.2886 17.0601 76.0595 16.2929 74.6027 16.2929C72.4036 16.2929 70.7741 17.9774 70.7741 20.3398C70.7741 22.7023 72.4036 24.3564 74.6027 24.3564C76.0889 24.3564 77.3161 23.6177 77.8875 22.4079L81.0878 24.2975C79.8587 26.6011 77.43 28.1375 74.6302 28.1375C70.2872 28.1375 67.0869 24.7419 67.0869 20.3398Z" fill="black"/>
            <path d="M81.8867 7.05005H86.0295L89.8581 22.3775L94.0302 7.05005H97.4014L101.601 22.3775L105.43 7.05005H109.573L103.973 27.7234H99.4866L95.7149 14.0785L91.9726 27.7234H87.4863L81.8867 7.05005Z" fill="black"/>
            <path d="M117.115 24.6811C118.544 24.6811 119.687 24.0601 120.315 23.2036L123.285 24.9754C121.943 26.9847 119.8 28.1355 117.058 28.1355C112.257 28.1355 109.229 24.74 109.229 20.3379C109.229 15.9358 112.287 12.5403 116.773 12.5403C121.002 12.5403 124.002 15.9966 124.002 20.3379C124.002 20.8981 123.945 21.4014 123.859 21.9027H113.087C113.602 23.8512 115.173 24.6792 117.116 24.6792L117.115 24.6811ZM120.315 18.9516C119.857 16.8246 118.314 15.9681 116.773 15.9681C114.802 15.9681 113.459 17.0601 113.031 18.9516H120.317H120.315Z" fill="black"/>
          </g>
          <defs>
            <clipPath id="clip0_364_2873">
              <rect width="124" height="35" fill="white" transform="translate(0 0.224854)"/>
            </clipPath>
          </defs>
        </svg>

        <div className='flex items-center
          gap-2.5
          md:gap-3
          lg:gap-3.5
          xl:gap-4
          2xl:gap-5
        '>
          {
            linkList.map((item) => (
              <Link key={item.id} href={item.href} target='_blank' className="">
                <item.icon className='
                  w-6 h-6
                  md:w-7 md:h-7
                  lg:w-8 lg:h-8
                  xl:w-9 xl:h-9
                  2xl:w-10 2xl:h-10
                ' />
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  </div>
}
