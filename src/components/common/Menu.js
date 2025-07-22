import { classnames } from '@/utils'
import { useEffect } from 'react'

export default function Menu ({ lang, dict }) {
  const menuData = dict?.home?.menu || {}

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
  const handleClickItem = (item) => {
    if (item.type === 'language') {
      if (lang !== item.value) {
        window.location.href = `/${item.value}`
      }
    } else if (item.href) {
      window.open(item.href, item.target)
    }
  }

  return <div className="flex items-center
    md:gap-4
    lg:gap-5
    xl:gap-6
  ">
    {
      menuList.map(item => (
        <div key={item.id} className='relative group/outer'>
          {
            item.href && (
              <a href={item.href} className='w-full flex items-center justify-center gap-2 cursor-pointer border transition-all duration-300 rounded-full
                border-transparent hover:border-[#DBDBDB]
                h-11 px-2 text-lg
                md:px-3
                lg:px-4
                xl:px-5
              '>
                <span className='
                  text-lg
                '>{item.label}</span>
              </a>
            )
          }
          {
            item.items && (
              <>
                <div className='w-full flex items-center justify-center gap-2 cursor-pointer border transition-all duration-300 rounded-full
                  border-transparent hover:border-[#DBDBDB]
                  h-11 px-2 text-lg
                  md:px-3
                  lg:px-4
                  xl:px-5
                '>
                  <span className='
                    text-lg
                  '>{item.label}</span>
                  {
                    item.items && (
                      <svg className='group-hover/outer:rotate-180 transition-all duration-300
                      ' width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.17163L5.17157 5.3432L9.34314 1.17163" stroke="white"/>
                      </svg>
                    )
                  }
                </div>
                <div className='opacity-0 -translate-y-10 z-[-1] pointer-events-none absolute left-1/2 -translate-x-1/2 transition-all duration-300
                  group-hover/outer:opacity-100 group-hover/outer:pointer-events-auto group-hover/outer:translate-y-0 group-hover/outer:z-10
                  top-11 w-[280px] pt-4
                '>
                  <div className='flex flex-col border border-[#D9D9D9] bg-white
                    px-6 py-8 rounded-xl gap-2.5 text-black
                  '>
                    {
                      item.items && item.items.map(subItem => (
                        <div key={subItem.id} className={classnames(`cursor-pointer group/inner
                          border-b border-[#D9D9D9]
                          last:border-b-0 last:pb-0
                          pb-4
                          `,
                        subItem.isComingSoon ? 'opacity-50 cursor-not-allowed' : '',
                        )} onClick={() => handleClickItem(subItem)}>
                          <h1 className={classnames(`text-base font-medium transition-all duration-300 rounded-full w-fit
                            px-2 py-0.5
                            group-hover/inner:bg-[#FFC90F]
                          `, lang === subItem.value ? 'bg-[#FFC90F]' : '',
                          )}>{subItem.label}</h1>
                          <h2 className='text-sm text-[#666666] font-light
                            pl-2
                          '>
                            {subItem.intro}
                          </h2>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </>
            )
          }
        </div>
      ))
    }
  </div>
}
