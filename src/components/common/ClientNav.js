'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'

export default function ClientNav ({ children, lang, dict }) {
  const pathname = usePathname()
  const isMapPage = pathname.includes('/map')
  const isBrandPage = pathname.includes('/brand')

  return (
    <>
      {!isMapPage && <Navbar lang={lang} dict={dict} />}
      {children}
      {!isMapPage && !isBrandPage && <Footer lang={lang} dict={dict} />}
    </>
  )
}
