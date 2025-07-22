import Image from 'next/image'
import Menu from '@/components/common/Menu'

export default function Section1Header ({ lang, dict }) {
  return <div className='w-full flex-none flex items-center z-[9999] absolute top-0 left-0
    h-20
  '>
    <div className='h-full flex-none flex items-start justify-center bg-[#15161B]
      rounded-br-[30px]
      md:px-5 md:pt-3
      lg:px-7 lg:pt-3.5
      xl:px-7.5 xl:pt-4
    '>
      <Image src='/images/logo.png' alt='logo' width={111} height={30}
        className='h-auto flex-none
          md:w-20
          lg:w-25
          xl:w-[111px]
        '
      />
    </div>

    <div className='h-full flex-grow text-black relative'>
      <div className='flex opacity-0 h-full items-center justify-end banner-header-menu
        md:pr-5
        lg:pr-7
        xl:pr-7.5
      '>
        <Menu lang={lang} dict={dict} />
      </div>

      <div className='absolute left-0 top-0 bg-[#15161B] mask-tl
        w-[30px] h-[30px]
      ' style={{
        '--mask-rounded': '30px',
      }}>
      </div>
      <div className='absolute right-0 top-0 bg-[#15161B] mask-tr
        w-[30px] h-[30px]
      ' style={{
        '--mask-rounded': '30px',
      }}>
      </div>

    </div>

    <div className='h-full flex-none flex items-start justify-center bg-[#15161B] text-black
      rounded-bl-[30px]
      md:px-5 md:pt-3
      lg:px-7 lg:pt-3.5
      xl:px-7.5 xl:pt-4
    '>
      <a href={`/${lang}/bridge`} target='_blank' className='flex items-center justify-center bg-[#FFC90F] font-bold rounded-full border border-[#FFC90F] transition-all duration-300
        hover:bg-white hover:border-black
        md:h-8 md:px-4 md:text-sm
        lg:h-10 lg:px-5 lg:text-base
        xl:h-11 xl:px-6 xl:text-lg
      '>
        <span className=''>Launch app</span>
      </a>
    </div>

    <div className='absolute left-0 bg-[#15161B] mask-tl
        -bottom-7.5 w-7.5 h-7.5
      ' style={{
      '--mask-rounded': '30px',
    }}>
      </div>
      <div className='absolute right-0 bg-[#15161B] mask-tr
        -bottom-7.5 w-7.5 h-7.5
    ' style={{
        '--mask-rounded': '30px',
      }}>
    </div>
</div>
}
