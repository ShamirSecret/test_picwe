import { Inter } from 'next/font/google'
import '@/styles/index.scss'
import seo from '@/config/seo'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import Script from 'next/script'
import { getDictionary } from '@/app/dictionaries'
import { cn } from '@/utils'
import { WalletProvider } from '@/components/WalletProvider'
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider'
import ContextProvider from '@/components/wagmi'
import { NetworkProvider } from '@/components/NetwrokProvider'
import ClientNav from '@/components/common/ClientNav'

const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  openGraph: {
    type: 'website',
    title: seo.title,
    description: seo.description,
    url: seo.url,
    images: [{ url: seo.preview }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: [seo.preview],
  },
}

export async function generateStaticParams () {
  return [
    { lang: 'en' },
    { lang: 'cn' },
  ]
}

export default async function RootLayout ({ children, params }) {
  const dict = await getDictionary(params.lang)

  return (
    <html lang={params.lang}>
      <body className={cn(
        params.lang === 'en' && 'font-en',
        params.lang === 'cn' && 'font-cn',
      )}>
        <ContextProvider >
          <ReactQueryClientProvider>
            <NetworkProvider>
              <WalletProvider>
                <ClientNav lang={params.lang} dict={dict}>
                  {children}
                </ClientNav>
              </WalletProvider>
            </NetworkProvider>
          </ReactQueryClientProvider>
        </ContextProvider>
      </body>

      {/* <Script id='1' type="text/javascript" src="https://www.googletagmanager.com/gtag/js?id=G-xxx" />
      <Script id='2' dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', "G-xxx");
      `,
      }}></Script> */}

      <Script id="3" dangerouslySetInnerHTML={{
        __html: `
          !(function (n, e) {
            function setViewHeight() {
              var windowVH = e.innerHeight / 100
              n.documentElement.style.setProperty('--vh', windowVH + 'px')
            }
            var i = 'orientationchange' in window ? 'orientationchange' : 'resize'
            n.addEventListener('DOMContentLoaded', setViewHeight)
            e.addEventListener(i, setViewHeight)
            setViewHeight()
          })(document, window);
        `,
      }}></Script>
    </html>
  )
}
