import Section1Pc from './Section1PC'
import Section1Mobile from './Section1Mobile'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
// import Chat from '../common/Chat'

export default function Index ({ lang, dict }) {
  return <>
    <Section1Pc lang={lang} dict={dict} />
    <Section1Mobile lang={lang} dict={dict} />
    <Section2 lang={lang} dict={dict} />
    <Section3 lang={lang} dict={dict} />
    <Section4 lang={lang} dict={dict} />
    {/* <Chat lang={lang} dict={dict} /> */}
  </>
}
