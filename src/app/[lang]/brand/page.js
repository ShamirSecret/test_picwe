import '@/styles/brand.scss'
import Index from '@/components/brand/Index'
import { getDictionary } from '@/app/dictionaries'

export default async function Brand ({ params: { lang } }) {
  const dict = await getDictionary(lang)

  return <Index lang={lang} dict={dict} />
}
