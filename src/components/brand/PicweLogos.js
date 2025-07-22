import { classnames } from '@/utils'

export default function PicweLogos ({ dict }) {
  const list = [
    { id: 1, title: dict.brand.fullLogo, img: '/images/brand-picwe/fullLogoYellowDark.png' },
    { id: 2, title: dict.brand.fullLogoDark, img: '/images/brand-picwe/fullLogoDark.png' },
    { id: 3, title: dict.brand.fullLogoWhite, img: '/images/brand-picwe/fullLogoWhite.png' },
    { id: 4, title: dict.brand.fullLogo, img: '/images/brand-picwe/fullLogoYellowWhite.png' },
    { id: 5, title: dict.brand.logomarkYellow, img: '/images/brand-picwe/logomarkYellow.png' },
    { id: 6, title: dict.brand.logomarkDark, img: '/images/brand-picwe/logomarkDark.png' },
    { id: 7, title: dict.brand.logomarkWhite, img: '/images/brand-picwe/logomarkWhite.png' },
    { id: 8, title: 'ffda34' },
  ]

  const list2 = [
    { id: 1, title: dict.brand.powered },
    { id: 2, title: dict.brand.powered2 },
  ]

  return (
    <>
      <div className='w-full grid gap-5
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
      '>
        {
          list.map(item => {
            return (
              <div className={classnames(`flex flex-col items-center justify-center
                rounded-[18px] gap-3 py-8
              `,
              [1, 2, 5, 6].includes(item.id) && 'bg-[#F9F9F9] text-black',
              [3, 4, 7].includes(item.id) && 'bg-black text-white',
              item.id === 8 && 'bg-[#FFDA34] text-black',
              )} key={item.id}>
                {
                  item.img && (
                    <img src={item.img} alt={item.title} className={classnames('w-auto', `
                      h-10
                    `,
                    )} />
                  )
                }
                <span className='
                  text-xl
                '>{item.title}</span>
              </div>
            )
          })
        }
      </div>

      <div className='w-full grid gap-5 mt-5
        grid-cols-1
        md:grid-cols-2
      '>
        {
          list2.map(item => {
            return (
              <div className={classnames(`flex flex-col items-center justify-center
                rounded-[18px] gap-3 py-8
              `,
              item.id === 1 && 'bg-[#F9F9F9] text-black',
              item.id === 2 && 'bg-black text-white',
              )} key={item.id}>
                <div className={classnames(` w-fit flex items-center border border-opacity-10 rounded-full
                  px-7 py-2 gap-2
                `,
                item.id === 1 && 'border-black bg-[#F9F9F9]',
                item.id === 2 && 'border-white bg-[#1B1B1B]',
                )}
                >
                  <div className='flex items-center justify-center bg-[#FFDA34] rounded-full
                    w-6 h-6
                  '>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <g clipPath="url(#clip0_355_1865)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10.1856 0.127441C11.0273 0.127441 11.7128 0.81328 11.7128 1.65539V8.72212C11.7128 10.0851 10.6021 11.1964 9.23987 11.1964H8.4069C8.1466 11.2571 7.59996 11.5089 7.59996 12.2555C7.59996 13.141 8.30278 13.3667 8.5197 13.3667H9.27458C9.67371 13.3754 10.0381 13.3754 10.3592 13.3667C10.8451 13.3494 12.0685 13.0281 13.0663 11.8127C13.7345 10.9967 14.0468 9.98094 14.0121 8.75685V5.05853H15.383C16.2247 5.05853 16.9102 5.74437 16.9102 6.58648V14.669C16.9102 15.4763 16.2594 16.1274 15.4525 16.1274H7.63467C6.79302 16.1274 6.10755 15.4416 6.10755 14.5995V7.53276C6.11623 6.16976 7.21818 5.05853 8.58044 5.05853H9.41341C9.67371 4.99776 10.2204 4.746 10.2204 3.99939C10.2204 3.11388 9.51753 2.88816 9.30061 2.88816H8.54573C8.1466 2.87948 7.78217 2.87948 7.46113 2.88816C6.97523 2.90552 5.7518 3.22674 4.75397 4.44215C4.08586 5.25821 3.7735 6.27394 3.8082 7.49803V11.1877H2.43727C1.59562 11.1877 0.910156 10.5018 0.910156 9.65973V1.57725C0.910156 0.778554 1.56092 0.127441 2.36786 0.127441H10.1856Z" fill="black"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_355_1865">
                        <rect width="16" height="16" fill="white" transform="translate(0.910156 0.127441)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  </div>
                  <span className='
                    text-xl
                  '>Powered by PicWe</span>
                </div>
                <span className='
                  text-xl
                '>{item.title}</span>
              </div>
            )
          })
        }
      </div>
    </>
  )
}
