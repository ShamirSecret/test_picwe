'use client'

import Image from 'next/image'
import Link from 'next/link'
import XIcon from '@/assets/icons/x.svg'
import DiscordIcon from '@/assets/icons/discord.svg'
import TelegramIcon from '@/assets/icons/telegram.svg'
import { cn } from '@/utils'
import { usePathname } from 'next/navigation'

export default function Footer ({ lang, dict }) {
  const pathname = usePathname()

  const linkList = [
    { id: 1, name: 'x', icon: XIcon, href: 'https://x.com/PicWeGlobal' },
    { id: 2, name: 'discord', icon: DiscordIcon, href: 'https://discord.gg/picwe' },
    { id: 3, name: 'telegram', icon: TelegramIcon, href: 'https://t.me/PicWeCommunity' },
  ]

  if (pathname.includes('/swap') || pathname.includes('/bridge')) {
    return null
  }

  return <footer className="w-full bg-white overflow-hidden
    rounded-t-[30px]
    md:rounded-t-[50px]
    lg:rounded-t-[70px]
    xl:rounded-t-[80px]
    2xl:rounded-t-[90px]
  ">
    <div className="container mx-auto
      pt-12
      md:pt-20
      lg:pt-25
      xl:pt-30
      2xl:pt-[130px]
    ">
      {/* <Link href='https://movementlabs.xyz' target='_blank'
        className='mx-auto border border-black rounded-full flex items-center justify-between cursor-pointer
        my-7 h-12.5 px-4 gap-3 w-full
        md:w-[90%]
        md:my-12 md:h-20 md:px-10 md:gap-4
        lg:my-14 lg:h-25 lg:px-12 lg:gap-4.5
        xl:my-16 xl:h-30 xl:px-15 xl:gap-5
        2xl:my-18 2xl:h-[130px] 2xl:px-16 2xl:gap-6
      '>
        <h1 className={cn(`text-black
          text-xl
          md:text-[40px]
          lg:text-[48px]
          xl:text-[54px]
          2xl:text-[60px]
        `,
        lang === 'cn' ? '' : 'font-ms',
        )}
        >
          {dict.home.footer.trusted}
        </h1>
        <div className='h-px flex-grow bg-black'></div>
        <Image src='/images/movement_logo.png' alt='logo' width={375} height={48}
          className="h-auto
            w-[134px]
            md:w-[245px]
            lg:w-[290px]
            xl:w-[340px]
            2xl:w-[375px]
          "
        />
      </Link> */}

      {/* card bg pc */}
      <div className='w-full
        hidden md:flex
        h-[90px]
      '>
        <div className='flex-grow h-full bg-black
          rounded-tl-[45px]
        '></div>
        <div className='flex-none w-[260px] h-full relative'>
          <div className='h-full flex absolute top-0 left-0 z-10'>
            <div className='h-full bg-black rounded-tr-[45px]
              w-[45px]
            '>
            </div>
            <div className='h-full'>
              <div className='w-[45px] h-[45px]'></div>
              <div className='w-[45px] h-[45px] bg-black footer-card-mask'></div>
            </div>
          </div>
          <div className='h-full flex absolute top-0 left-0'>
            <div className='h-full bg-[#414141] rounded-tr-[45px]
              w-[120px]
            '>
            </div>
            <div className='h-full'>
              <div className='w-[45px] h-[45px]'></div>
              <div className='w-[45px] h-[45px] bg-[#414141] footer-card-mask'></div>
            </div>
          </div>
        </div>
      </div>

      {/* card bg mobile */}
      <div className='w-full h-10 flex
        md:hidden
      '>
        <div className='flex-grow h-full bg-black
          rounded-t-[20px]
        '></div>
        <div className='w-10 h-10 flex items-end'>
          <div className='w-1/2 h-1/2 bg-black mask-bl' style={{
            '--mask-rounded': '20px',
          }}></div>

        </div>
      </div>

      <div className='w-full bg-black footer-card pt-px
        rounded-tr-[20px]
        md:rounded-tr-[45px]
        px-4 pb-20
        md:px-16 md:pb-15
        lg:px-18 lg:pb-25
        xl:px-20 xl:pb-[110px]
        2xl:px-[96px] 2xl:pb-[120px]
      '>
        <div className='w-full
          -mt-5 md:mt-0
        '>
          <div className='flex items-center
            gap-1
            md:gap-3.5
            lg:gap-4
            xl:gap-5
            2xl:gap-6
          '>
            <h1 className={cn(`!leading-1
              text-[30px]
              md:text-[50px]
              lg:text-[60px]
              xl:text-[70px]
              2xl:text-[80px]
            `,
            lang === 'cn' ? 'font-bold' : 'font-ms',
            )}
            >
              {dict.home.footer.title}
            </h1>
            <div className='flex flex-grow'>
              <div className='flex w-full
                h-5 max-w-[100px]
                md:max-w-[200px] md:h-10
                lg:max-w-[250px] lg:h-12
                xl:max-w-[300px] xl:h-14
                2xl:max-w-[400px] 2xl:h-15
              '>
                <div className='flex-grow h-full bg-[#FFC90F]'></div>
                <div className='flex-none h-full bg-[#FFC90F] rounded-full
                  w-5
                  md:w-10
                  lg:w-12
                  xl:w-14
                  2xl:w-15
                '></div>
                <div className='flex-none h-full bg-[#FFC90F] rounded-full
                  w-5
                  md:w-10
                  lg:w-12
                  xl:w-14
                  2xl:w-15
                '></div>
              </div>
            </div>
          </div>
          <h2 className='font-ms !leading-1
            mt-2 text-sm
            md:mt-3 md:text-xl
            lg:mt-3.5 lg:text-2xl
            xl:mt-4 xl:text-[28px]
            2xl:mt-4.5 2xl:text-[32px]
          '>
            {dict.home.footer.subtitle}
          </h2>

          <div className='border border-white !leading-1.8 text-center
            mt-5 rounded-[10px] px-2.5 py-5 text-[10px]
            md:mt-6 md:rounded-[16px] md:px-5 md:py-6 md:text-sm
            lg:mt-7 lg:rounded-[18px] lg:px-6 lg:py-7 lg:text-base
            xl:mt-8 xl:rounded-[22px] xl:px-7 xl:py-8 xl:text-lg
            2xl:mt-9 2xl:rounded-[26px] 2xl:px-7.5 2xl:py-9 2xl:text-xl
          '>
            {dict.home.footer.intro}
          </div>

          <div className='flex justify-between
            flex-col-reverse items-end
            md:flex-row md:items-end
            mt-5
            md:mt-15
            lg:mt-18
            xl:mt-20
            2xl:mt-25
          '>
            <div className='flex items-center
              mt-2.5 md:mt-0
              gap-6
              md:gap-9
              lg:gap-12
              xl:gap-14
              2xl:gap-[78px]
            '>
              {
                linkList.map((item) => (
                  <Link key={item.id} href={item.href} target='_blank' className="flex items-center justify-center rounded-full
                    border border-white transition-all duration-300
                    hover:bg-[#FFC90F] hover:text-black hover:border-none
                    w-10 h-10
                    md:w-15 md:h-15
                    lg:w-18 lg:h-18
                    xl:w-20 xl:h-20
                    2xl:w-25 2xl:h-25
                  ">
                    <item.icon className='
                      w-5 h-5
                      md:w-8 md:h-8
                      lg:w-9 lg:h-9
                      xl:w-10 xl:h-10
                      2xl:w-12 2xl:h-12
                    ' />
                  </Link>
                ))
              }
            </div>
            <div className='font-test font-bold
              text-base
              md:text-xl
              lg:text-2xl
              xl:text-[28px]
              2xl:text-[32px]
            '>
              {dict.home.footer.joinText}
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
}
