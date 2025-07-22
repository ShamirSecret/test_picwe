import '@/styles/home.scss'
import Index from '@/components/home/Index'
import { getDictionary } from '@/app/dictionaries'

export default async function Home ({ params: { lang } }) {
  const dict = await getDictionary(lang)

  return <Index lang={lang} dict={dict} />
}
