'use client'
import Section1 from './Section1'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollSmoother from 'gsap/ScrollSmoother'

export default function Index () {
  const smootherRef = useRef()

  const init = () => {
    gsap.registerPlugin(ScrollSmoother)
    smootherRef.current = ScrollSmoother.create({
      effects: true,
    })
    document.querySelector('body').style.overflow = 'unset'
    document.querySelector('body').style.height = 'var(--100vh)'
    smootherRef.current.scrollTop(0)
  }
  useEffect(() => {
    init()
    return () => {
      smootherRef.current?.kill()
    }
  }, [])

  return <div id="smooth-wrapper">
    <div id="smooth-content">
      <Section1/>
    </div>
  </div>
}
