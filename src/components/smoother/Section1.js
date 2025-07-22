'use client'
import config from '@/config'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { classnames, getImgUrl } from '@/utils'
import { Mousewheel } from 'swiper/modules'
import useDeviceType from '@/hooks/useDeviceType'

export default function Section () {
  return <section className="w-full
    pt-6 pb-20
    md:pt-10
    lg:pt-12 md:pb-25
    xl:pt-15
  ">
    <div className="container mx-auto">
      section1
    </div>

  </section>
}
