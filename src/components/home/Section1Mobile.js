'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { cn } from '@/utils'

export default function Section ({ lang, dict }) {
  const containerRef = useRef(null)

  return (
    <section className="w-full home-banner overflow-hidden
      md:hidden
      pt-20
      pb-10
    ">
    <div className="container mx-auto h-full flex flex-col relative">
      <div className='w-full h-full overflow-hidden relative
        bg-white text-black
        rounded-[20px]
      ' ref={containerRef}>
        <div className='w-full h-full bg-white text-black
        '>
          <div className='w-full h-full flex flex-col relative
            pt-6 px-4
          '>
            <a href="https://mirror.xyz/0xbee7d276004a9C205c67B91a604591581AC79E68/cnHpzNc99jmSfd3vEQE7MvkTzAKbv1w0c0AujKMIQmw" target="_blank" className=' bg-[#F1F1F1] border border-[#dbdbdb] rounded-full flex items-center justify-center
              w-full h-9 gap-5
            '>
              <span className='text-lg'>
                {dict.home.section1.link}
              </span>
              <svg className='
              ' width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11.5" stroke="#B9B9B9"/>
                <path d="M5 12H18.5M18.5 12L13 6M18.5 12L13 17.5" stroke="#B9B9B9" strokeLinejoin="round"/>
              </svg>
            </a>

            {
              lang === 'cn' && (
                <div className='w-full flex flex-col items-start
                  font-ms uppercase font-bold !leading-1
                  mt-4 text-[50px]
                '>
                  <div className='flex items-center'>
                    <h1>{dict.home.section1.mTitle[0]}</h1>
                    <div className='rounded-full bg-[#FFC90F]
                      w-8 h-8
                    '></div>
                  </div>
                  <div className='flex items-center
                    gap-1
                  '>
                    <h1>{dict.home.section1.mTitle[1]}</h1>
                    <div className='rounded-full bg-[#FFC90F]
                      w-8 h-8
                    '></div>
                  </div>
                </div>
              )
            }
            {
              lang === 'en' && (
                <div className='w-full flex flex-col items-start
                  font-ms uppercase font-bold !leading-1
                  mt-4 text-[50px]
                '>
                  <div className='flex items-center'>
                    <h1>{dict.home.section1.mTitle[0]}</h1>
                    <div className='rounded-full bg-[#FFC90F]
                      w-8 h-8
                    '></div>
                  </div>
                  <div className='flex
                    gap-1
                  '>
                    <h1>{dict.home.section1.mTitle[1]}</h1>
                  </div>
                  <div className='flex items-center
                    gap-1
                  '>
                    <h1>{dict.home.section1.mTitle[2]}</h1>
                    <div className='rounded-full bg-[#FFC90F]
                      w-8 h-8
                    '></div>
                  </div>
                  <div className='flex '>
                    <h1>{dict.home.section1.mTitle[3]}</h1>
                  </div>
                </div>
              )
            }

            <div className={cn(`text-[10px] mt-3 w-full text-left
              `,
            lang === 'cn' ? 'w-[80%]' : 'w-full',
            )}>
              {
                dict.home.section1.intro.map((p, index) => (
                  <p key={index}>
                    {p}
                  </p>
                ))
              }
            </div>

            <Image className='mt-10 w-full h-auto object-contain' src={'/images/banner_m.png'} alt="" width={726} height={479} priority={true} loading="eager" />
            {/* <div className='mt-10 w-full aspect-[920/488] relative
            '>
              <Image className='w-full h-full object-contain relative z-20' src={'/images/banner_main.png'} alt="" width={920} height={488} priority={true} loading="eager" />
              <Image className='absolute h-auto
                w-[8.26086%] top-[13.5%] left-[50.01%]
              ' src={'/images/banner_hand.png'} alt="" width={76} height={90} priority={true} loading="eager" />
              <Image className='absolute h-auto z-10
                w-[8.1521739%] top-[-1.6%] left-[52.9%]
              ' src={'/images/banner_ship.png'} alt="" width={75} height={86} priority={true} loading="eager" />
            </div> */}
          </div>
        </div>

        <div className='absolute bottom-0 left-0 w-full z-50
          h-30
        '>
          <a href={`/${lang}/map`} target='_blank' className='bg-[#15161B] absolute bottom-0 cursor-pointer
            w-[160px] h-20 rounded-t-[80px] left-1/2 -translate-x-1/2
          '>
            <div className='w-full h-full flex flex-col items-center justify-center box-border
              gap-2 pt-2
            '>
              <svg className='
                w-8 h-8
              ' width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="21.5417" cy="21.5417" r="21.0417" stroke="#B9B9B9"/>
                <path d="M8.97569 21.5417H33.2101M33.2101 21.5417L23.3368 10.7709M33.2101 21.5417L23.3368 31.415" stroke="#B9B9B9" strokeLinejoin="round"/>
              </svg>
              <span className='text-white
                text-sm
              '>
                {dict.home.section1.button}
              </span>
            </div>

            <div className='absolute bottom-0 -left-8 w-10 h-10 bg-[#15161B] mask-br' style={{
              '--mask-rounded': '40px',
            }}></div>
            <div className='absolute bottom-0 -right-8 w-10 h-10 bg-[#15161B] mask-bl' style={{
              '--mask-rounded': '40px',
            }}></div>
          </a>
        </div>

      </div>
    </div>
  </section>
  )
}
