import Image from 'next/image'
import { getImgUrl } from '@/utils'

export default function Section ({ lang, dict }) {
  return <section className="w-full overflow-hidden
    pt-6 md:pt-0
    pb-6
    md:pb-12
    lg:pb-15
    xl:pb-18
    2xl:pb-20
  ">
    <div className="container mx-auto">
      <div className='w-full
        py-10
        md:py-12
        lg:py-15
        xl:py-18
        2xl:py-20
      '>
        <div className='w-full
          px-0
          md:px-12
          lg:px-16
          xl:px-18
          2xl:px-20
        '>
          <h1 className='font-ms font-bold !leading-1.1
            text-[30px]
            md:text-[40px]
            lg:text-[45px]
            xl:text-[50px]
            2xl:text-[64px]
          '>
            {dict.home.section3.title1}
          </h1>
          <p className='font-ms !leading-1.1 text-[#BFBFBF]
            mt-2 text-sm
            md:mt-3 md:text-base
            lg:mt-3.5 lg:text-lg
            xl:mt-4 xl:text-xl
            2xl:mt-4.5 2xl:text-2xl
          '>
            {dict.home.section3.intro1}
          </p>
        </div>
        {/* 轮播 */}
        <div className='w-full mt-2 pt-7 pb-4 relative' >
          <div className='absolute top-0 left-0 w-full h-full z-10' style={{
            background: 'linear-gradient(90deg, #15161B 0%, transparent 5%, transparent 95%, #15161B 100% )',
          }}></div>

          <div className='w-full section-1-logo
            h-6
            md:h-8
            lg:h-10
            xl:h-12
            2xl:h-15
          ' style={{
            background: `url(${getImgUrl('logos1.png')}) center left / auto 100%`,
          }}>
          </div>
          <div className='w-full section-2-logo
            h-4 mt-2
            md:h-6 md:mt-2.5
            lg:h-8 lg:mt-3
            xl:h-10 xl:mt-3.5
            2xl:h-13 2xl:mt-4
          ' style={{
            background: `url(${getImgUrl('logos2.png')}) center right / auto 100%`,
          }}>
          </div>
        </div>
      </div>

      <div className='w-full bg-white text-black flex flex-col items-center
        pt-8 px-4 rounded-[25px]
        md:pt-14 md:px-18 md:rounded-[35px]
        lg:pt-16 lg:px-20 lg:rounded-[45px]
        xl:pt-18 xl:px-25 xl:rounded-[60px]
        2xl:pt-20 2xl:px-[116px] 2xl:rounded-[75px]
      '>
        <h1 className='text-center font-ms font-bold !leading-1.1 uppercase
          text-[30px]
          md:text-[40px]
          lg:text-[50px]
          xl:text-[60px]
          2xl:text-[80px]
        '>
          {dict.home.section3.title}
        </h1>
        <p className='text-center !leading-1.2 mt-4
          text-[10px]
          md:text-sm
          lg:text-base
          xl:text-lg
          2xl:text-xl
        '>
          {dict.home.section3.subtitle}
        </p>

        <div className='w-[90%] mx-auto text-center'>
          <a href={`/${lang}/bridge`} target='_blank' className='inline-block border border-black rounded-full font-semibold !leading-1.4 transition-all duration-300
            hover:bg-[#FFC90F] hover:text-black hover:border-[#FFC90F] mt-5
            w-full md:w-auto
            px-0 py-2.5 text-base
            md:px-12 md:py-3
            lg:px-15 lg:py-3.5 lg:text-lg
            xl:px-16 xl:py-4
            2xl:px-18 2xl:py-4.5 2xl:text-xl
          '>
            {dict.home.section3.joinBtn}
          </a>
        </div>

        <div className='aspect-[800/639] relative
          w-full
          md:w-[57%]
        '>
          <Image className='h-auto
            w-full
          ' src='/images/treasure_box.png' alt='' width={800} height={639}/>
          <Image className='h-auto gold-coin-1
            w-[13%] absolute left-[53.25%] top-[43.5054%]
          ' src='/images/gold_coin_1.png' alt='' width={104} height={104}/>
          <Image className='h-auto gold-coin-2
            w-[14.25%] absolute left-[43.75%] top-[56.964%]
          ' src='/images/gold_coin_2.png' alt='' width={114} height={80}/>
        </div>

      </div>
    </div>

  </section>
}
