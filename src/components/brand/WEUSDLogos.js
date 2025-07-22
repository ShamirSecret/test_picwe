import { classnames } from '@/utils'

export default function WEUSDLogos ({ dict }) {
  const list = [
    { id: 1, title: dict.brand.fullLogo, img: '/images/brand-weusd/WEUSD-LOGO.png' },
    { id: 2, title: dict.brand.fullLogoDark, img: '/images/brand-weusd/WEUSD-LOGO-dark.png' },
    { id: 3, title: dict.brand.fullLogoWhite, img: '/images/brand-weusd/WEUSD-LOGO-white.png' },
    { id: 4, title: 'FFA700 / FFC80F' },
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
              [1, 2].includes(item.id) && 'bg-[#F9F9F9] text-black',
              item.id === 3 && 'bg-black text-white',
              item.id === 4 && 'bg-gradient-to-b from-[#FFA700] to-[#FFC80F] text-black',
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
                '>{ item.id === 4
                  ? <p className='text-center'>
                  FFA700 <br />
                  / <br />
                  FFC80F
                </p>
                  : item.title}</span>
              </div>
            )
          })
        }
      </div>
    </>
  )
}
