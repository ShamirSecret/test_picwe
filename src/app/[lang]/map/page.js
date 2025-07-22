import '@/styles/map.scss'
import Index from '@/components/map/Index'

export default async function Map ({ params: { lang } }) {
  return <Index lang={lang} />
}
