'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Mousewheel, Autoplay } from 'swiper/modules'
import useDeviceType from '@/hooks/useDeviceType'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function Section ({ lang, dict }) {
  const list1Data = dict.home.section4.list1
  const list2Data = dict.home.section4.list2

  const deviceType = useDeviceType()

  const list1 = [
    { id: 1, index: '01', img: '/images/swiper_img1.png', activeImg: '/images/swiper_img1_active.png', w: 249, h: 129, title: list1Data.item1.title, intro: list1Data.item1.intro },
    { id: 2, index: '02', img: '/images/swiper_img2.png', activeImg: '/images/swiper_img2_active.png', w: 252, h: 75, title: list1Data.item2.title, intro: list1Data.item2.intro },
    { id: 3, index: '03', img: '/images/swiper_img3.png', activeImg: '/images/swiper_img3_active.png', w: 146, h: 151, title: list1Data.item3.title, intro: list1Data.item3.intro },
    { id: 4, index: '04', img: '/images/swiper_img4.png', activeImg: '/images/swiper_img4_active.png', w: 126, h: 122, title: list1Data.item4.title, intro: list1Data.item4.intro },
    { id: 5, index: '05', img: '/images/swiper_img5.png', activeImg: '/images/swiper_img5_active.png', w: 163, h: 69, title: list1Data.item5.title, intro: list1Data.item5.intro },
  ]

  const [activeIndex, setActiveIndex] = useState(null)

  const list2 = [
    { id: 1, title: list2Data.item1.title, intro: list2Data.item1.intro },
    { id: 2, title: list2Data.item2.title, intro: list2Data.item2.intro },
    { id: 3, title: list2Data.item3.title, intro: list2Data.item3.intro },
    { id: 4, title: list2Data.item4.title, intro: list2Data.item4.intro },
    { id: 5, title: list2Data.item5.title, intro: list2Data.item5.intro },
  ]
  return <section className="w-full overflow-hidden
    pt-6 pb-6
    md:pt-7 md:pb-12
    lg:pt-8 lg:pb-15
    xl:pt-9 xl:pb-18
    2xl:pt-10 2xl:pb-20
  ">
    <div className="container mx-auto">
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
          2xl:text-[80px]
        '>
          {dict.home.section4.title}
        </h1>
        <p className='font-ms !leading-1.1 text-[#BFBFBF]
          mt-2 text-sm
          md:mt-3 md:text-base
          lg:mt-3.5 lg:text-lg
          xl:mt-4 xl:text-xl
          2xl:mt-4.5 2xl:text-2xl
        '>
          {dict.home.section4.intro}
        </p>

        <div className='flex items-center
          mt-2.5 h-7
          md:mt-3 md:h-10
          lg:mt-4 lg:h-12
          xl:mt-5 xl:h-14
          2xl:mt-7 2xl:h-16
        '>
          <div className='rounded-full bg-[#FFC90F]
            w-7 h-7
            md:w-10 md:h-10
            lg:w-12 lg:h-12
            xl:w-14 xl:h-14
            2xl:w-16 2xl:h-16
          '></div>
          <div className='rounded-full bg-[#FFC90F]
            w-7 h-7
            md:w-10 md:h-10
            lg:w-12 lg:h-12
            xl:w-14 xl:h-14
            2xl:w-16 2xl:h-16
          '></div>
          <h2 className='flex-1 h-full font-bold bg-[#FFC90F] font-ms flex items-center justify-end text-black
            pt-1 px-2 text-[30px]
            md:pt-1.5 md:px-3 md:text-[40px]
            lg:pt-2 lg:px-4 lg:text-[45px]
            xl:pt-2.5 xl:px-5 xl:text-[50px]
            2xl:pt-2.5 2xl:px-4 2xl:text-[80px]
          '>
            Redefined
          </h2>
        </div>
      </div>

    </div>

    <div className='container mx-auto
      mt-7.5 mb-7.5
      md:mt-14 md:mb-16
      lg:mt-16 lg:mb-20
      xl:mt-20 xl:mb-25
      2xl:mt-[90px] 2xl:mb-[110px]
    '>
      <Swiper className="w-full !overflow-visible
        !px-2.5
        md:!px-8
        lg:!px-10
        xl:!px-12
        2xl:!px-15
      "
        modules={[Mousewheel, Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        mousewheel={{
          forceToAxis: true,
          thresholdDelta: 10,
        }}
        slidesPerView="auto"
        spaceBetween={deviceType === 'desktop' ? 30 : 16}
      >
        {
          list1.map(item => (
            <SwiperSlide key={item.id} className='group relative
              !w-[302px] aspect-[302/205]
              md:!w-[406px] md:aspect-[476/324]
              lg:!w-[436px] lg:aspect-[476/324]
              xl:!w-[476px] xl:aspect-[476/324]
            ' style={{
              background: activeIndex === item.id
                ? 'url(/images/swiper_item_bg_active.png) no-repeat center center / contain'
                : 'url(/images/swiper_item_bg.png) no-repeat center center / contain',
            }}>
              <div className="w-full h-full flex flex-col font-ms relative z-10 transition-all duration-300
                hover:text-black
                px-4.5 py-3.5
                md:px-5 md:py-4
                lg:px-5 lg:py-4.5
                xl:px-6 xl:py-5
                2xl:px-7 2xl:py-6
              " onMouseEnter={() => setActiveIndex(item.id)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className='absolute top-[3.1%] right-[2.5%] text-[#8B8B8B]
                  text-[10px]
                  md:text-xs
                  lg:text-sm
                  xl:text-base
                '>
                  / {item.index}
                </div>
                <h1 className='font-bold
                  text-lg
                  md:text-xl
                  lg:text-2xl
                  xl:text-[28px]
                  2xl:text-[30px]
                '>
                  {item.title}
                </h1>
                <h2 className='
                  mt-1 text-xs
                  md:mt-1.5 md:text-sm
                  lg:mt-2 lg:text-base
                  xl:mt-3 xl:text-lg
                  2xl:mt-4
                ' dangerouslySetInnerHTML={{
                  __html: item.intro,
                }}>
                </h2>
                <div className='flex-grow flex items-center justify-end'>
                  <Image className='h-auto
                    transition-all duration-300
                  ' width={item.w} height={item.h} src={activeIndex === item.id ? item.activeImg : item.img} priority={true} loading="eager" alt='' style={{
                    width: `${item.w / 476 * 100}%`,
                  }} />
                </div>
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>

    <div className='container mx-auto'>
      <div className='w-full flex flex-col
        px-0
        md:px-12
        lg:px-15
        xl:px-18
        2xl:px-20
      '>
        {
          list2.map((item) => (
            <div key={item.id} className='w-full flex  border-b border-[#B9B9B9]
              flex-col
              md:flex-row md:items-center md:justify-between
              py-3 gap-1
              md:py-7 md:gap-3
              lg:py-8 lg:gap-3
              xl:py-9 xl:gap-4
              2xl:py-10 2xl:gap-5
            '>
              <div className='flex-none flex items-center gap-3'>
                <svg className='flex-none
                  w-2.5 h-2.5
                  md:w-3 md:h-3
                  lg:w-4 lg:h-4
                  xl:w-5 xl:h-5
                ' width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 9.88L19 9.88M9.88 19L9.88 0" stroke="#B9B9B9" strokeLinejoin="round"/>
                </svg>
                <h3 className='flex-grow font-semibold
                  text-base
                  md:text-lg
                  lg:text-xl
                  xl:text-2xl
                  2xl:text-[28px]
                '>
                  {item.title}
                </h3>
              </div>
              <p className=' text-[#8b8b8b]
                pl-5 md:pl-0
                text-xs
                md:text-sm
                lg:text-base
                xl:text-lg
              '>
                {item.intro}
              </p>
            </div>
          ))
        }
        <div className='w-full flex justify-end
          mt-10 px-11
          md:px-0
          md:mt-4.5
          lg:mt-5
          xl:mt-6
          2xl:mt-7
        '>
          <button className='border border-white rounded-full font-semibold !leading-1.4 transition-all duration-300
            hover:bg-[#FFC90F] hover:text-black hover:border-[#FFC90F]
              w-full md:w-auto
              px-0 py-2.5 text-base
              md:px-12 md:py-3
              lg:px-15 lg:py-3.5 lg:text-lg
              xl:px-16 xl:py-4
              2xl:px-18 2xl:py-4.5
          '>
            {dict.home.section4.moreBtn}
          </button>
        </div>
      </div>
    </div>
  </section>
}
