import Image from 'next/image'
import { classnames, getImgUrl } from '@/utils'
import Jigsaw from './Jigsaw'

export default function Section ({ lang, dict }) {
  const list = [
    { id: 1, title: 'USERS', count: 607, unit: 'k' },
    { id: 2, title: 'Interaction', count: 221, unit: 'k' },
    { id: 3, title: 'Transaction', count: 326, unit: 'm+' },
  ]
  return <section className="w-full overflow-hidden
    pt-7 pb-7.5
    md:pt-15 md:pb-3
    lg:pt-18 lg:pb-3.5
    xl:pt-20 xl:pb-4
    2xl:pt-25 2xl:pb-5
  ">
    <div className="container mx-auto pt-20">
      <div className='w-full
        px-0
        md:px-14
        lg:px-16
        xl:px-18
        2xl:px-20
      '>
        <div className='flex items-center
          gap-2.5
          md:gap-5
          lg:gap-6
          xl:gap-7
          2xl:gap-7.5
        '>
          <h1 className='font-bold font-ms uppercase !leading-1.1
            text-[50px]
            md:text-[80px]
            lg:text-[100px]
            xl:text-[120px]
            2xl:text-[140px]
          '>
            One Piece
          </h1>
          <svg className='
            w-[33px] h-[33px]
            md:w-15 md:h-15
            lg:w-18 lg:h-18
            xl:w-20 xl:h-20
            2xl:w-[94px] 2xl:h-[95px]
          ' width="94" height="95" viewBox="0 0 94 95" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 0.5L93 94.5M93 94.5V8M93 94.5H7.5" stroke="#B9B9B9" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className='flex items-center mt-2.5
          h-5
          md:h-10
          lg:h-12
          xl:h-14
          2xl:h-15
        '>
          <h2 className='h-full font-bold w-fit bg-[#FFC90F] uppercase font-ms flex items-center text-black
            px-2.5 text-[13px] min-w-[200px]
            md:px-3 md:text-2xl md:min-w-[400px]
            lg:px-3.5 lg:text-[30px] lg:min-w-[500px]
            2xl:px-4 2xl:text-[36px] 2xl:min-w-[600px]
          '>
            {dict.home.section2.title}
          </h2>
          <div className='rounded-full bg-[#FFC90F]
            w-5 h-5
            md:w-10 md:h-10
            lg:w-12 lg:h-12
            xl:w-14 xl:h-14
            2xl:w-15 2xl:h-15
          '></div>
          <div className='rounded-full bg-[#FFC90F]
            w-5 h-5
            md:w-10 md:h-10
            lg:w-12 lg:h-12
            xl:w-14 xl:h-14
            2xl:w-15 2xl:h-15
          '></div>
        </div>

        {/* content */}
        <div className='w-full flex
          flex-col
          md:flex-row md:items-end
          gap-10 md:gap-0
        '>
          <div className='h-full
            w-full
            md:w-[55%]
          '>
            {/* <div className='flex items-center
              my-4.5 gap-2.5
              md:my-10 md:gap-5
              lg:my-12 lg:gap-6
              xl:my-14 xl:gap-7
              2xl:my-16 2xl:gap-7.5
            '>
              {
                list.map((item, index) => <>
                  <div key={index} className={classnames('flex-1 h-full flex justify-center',
                  )}>
                    <div className='flex flex-col gap-2.5'>
                      <h3 className='font-semibold uppercase !leading-1
                        text-3xl
                        md:text-[38px]
                        lg:text-[44px]
                        xl:text-[50px]
                        2xl:text-[60px]
                      '>
                        <span className='text-white'>{item.count}</span>
                        <span className='text-[#FFC90F]'>{item.unit}</span>
                      </h3>
                      <h2 className='!leading-1.1 text-[#BFBFBF]
                        text-sm
                        md:text-base
                        lg:text-lg
                        xl:text-xl
                      '>{item.title}</h2>
                    </div>
                  </div>
                  {
                    index !== list.length - 1 && <div className='flex-none w-px bg-[#B9B9B9]
                      h-10
                      md:h-14
                      lg:h-16
                      xl:h-18
                      2xl:h-20
                    '></div>
                  }
                </>,
                )
              }
            </div> */}
            <div className='font-ms text-[#BFBFBF]
              text-[10px]
              md:text-sm
              lg:text-base
              xl:text-lg
              2xl:text-lg
            '>
              {
                dict.home.section2.intro.map((p, index) => (
                  <p key={index}>
                    {p}
                  </p>
                ))
              }
            </div>

            {/* pc show */}
            <a href={`/${lang}/map`} target='_blank' className='border border-white rounded-full font-semibold !leading-1.4 transition-all duration-300
              hover:bg-[#FFC90F] hover:text-black hover:border-[#FFC90F]
                hidden md:inline-block
                md:mt-12 md:px-10 md:py-3 md:text-sm
                lg:mt-16 lg:px-12 lg:py-3.5 lg:text-base
                xl:mt-20 xl:px-14 xl:py-4 xl:text-lg
                2xl:mt-[94px] 2xl:px-15 2xl:py-4.5 2xl:text-xl
            '>
              {dict.home.section2.button}
            </a>

            <div className="border-l border-b border-[#b9b9b9] w-full relative
              hidden md:block
              md:mt-12 md:h-[140px]
              lg:mt-16 lg:h-[160px]
              xl:mt-18 xl:h-[180px]
              2xl:mt-20 2xl:h-[200px]
            ">
              <a href={`/${lang}/map`} target='_blank' className='absolute bottom-0 right-0'>
                <Image className=' w-auto
                  h-[120px]
                  md:h-[160px]
                  lg:h-[180px]
                  xl:h-[200px]
                  2xl:h-[240px]
                ' src={getImgUrl('/map-sail1.gif')} alt="map" width={411} height={361} />
              </a>
            </div>
          </div>

          <div className='h-full flex flex-col justify-end items-end
            w-full
            md:w-[45%]
          '>
            <div className='w-full aspect-[657/526]'>
              <Jigsaw />
            </div>

            <div className='text-[#bfbfbf] font-ms text-right
              hidden md:block text-[10px]
              md:mt-7 md:max-w-[350px] md:text-xs
              lg:mt-8 lg:max-w-[400px] lg:text-sm
              xl:mt-9 xl:max-w-[450px] xl:text-base
              2xl:mt-10 2xl:max-w-[500px] 2xl:text-lg
            '>
              {dict.home.section2.intro2}
            </div>
          </div>
        </div>

        {/* mobile show */}
        <div className='w-[80%] mt-10 mx-auto
          md:hidden
        '>
          <a href={`/${lang}/map`} target='_blank' className='border border-white rounded-full font-semibold !leading-1.4 transition-all duration-300
            hover:bg-[#FFC90F] hover:text-black hover:border-[#FFC90F]
            w-full py-2.5 text-base flex items-center justify-center
          '>
            {dict.home.section2.button}
          </a>
        </div>
      </div>

    </div>

  </section>
}
