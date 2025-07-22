'use client'
import { getImgUrl } from '@/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Chat () {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const icon = document.querySelector('.chat-icon')
      if (!icon) return

      const rect = icon.getBoundingClientRect()
      const iconCenterX = rect.left + rect.width / 2
      const iconCenterY = rect.top + rect.height / 2

      const angle = Math.atan2(e.clientY - iconCenterY, e.clientX - iconCenterX)
      const maxDistance = 4
      const x = Math.cos(angle) * maxDistance
      const y = Math.sin(angle) * maxDistance

      setEyePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <a href="https://agent.pipimove.com/" target="_blank" className="fixed z-[999999] chat-icon cursor-pointer
    bottom-10 right-10 w-12.5 h-12.5
    md:bottom-10 md:right-10 md:w-14 md:h-14
    lg:bottom-10 lg:right-10 lg:w-18 lg:h-18
    xl:bottom-20 xl:right-10 xl:w-20 xl:h-20
  ">
    <svg className='w-full h-full' width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_108_40)">
      <circle cx="41" cy="40" r="40" fill="url(#paint0_linear_108_40)"/>
      </g>
      <circle cx="41" cy="40" r="40" fill="url(#paint1_linear_108_40)" fillOpacity="0.8"/>
      <path d="M50 13C53.6667 13.8333 61.7 17.6 64.5 26" stroke="white" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <g filter="url(#filter1_b_108_40)">
      <circle cx="41" cy="40" r="37.5" stroke="white" strokeOpacity="0.5" strokeWidth="5"/>
      </g>
      <g filter="url(#filter2_d_108_40)" style={{ transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` }}>
      <rect x="38" y="18" width="8" height="22" rx="4" fill="url(#paint2_linear_108_40)"/>
      </g>
      <g filter="url(#filter3_d_108_40)" style={{ transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` }}>
      <rect x="21" y="18" width="8" height="22" rx="4" fill="url(#paint3_linear_108_40)"/>
      </g>
      <defs>
      <filter id="filter0_d_108_40" x="0" y="0" width="88" height="88" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="3" dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_108_40"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_108_40" result="shape"/>
      </filter>
      <filter id="filter1_b_108_40" x="-4" y="-5" width="90" height="90" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feGaussianBlur in="BackgroundImageFix" stdDeviation="2.5"/>
      <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_108_40"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_108_40" result="shape"/>
      </filter>
      <filter id="filter2_d_108_40" x="36" y="16" width="14" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_108_40"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_108_40" result="shape"/>
      </filter>
      <filter id="filter3_d_108_40" x="19" y="16" width="14" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_108_40"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_108_40" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear_108_40" x1="41" y1="0" x2="41" y2="80" gradientUnits="userSpaceOnUse">
      <stop stopColor="#E749A0"/>
      <stop offset="1" stopColor="#AB55F3"/>
      </linearGradient>
      <linearGradient id="paint1_linear_108_40" x1="22.5" y1="80" x2="55" y2="5.5" gradientUnits="userSpaceOnUse">
      <stop stopColor="#6CFFF3"/>
      <stop offset="1" stopColor="#AB55F3" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="paint2_linear_108_40" x1="42" y1="18" x2="42" y2="40" gradientUnits="userSpaceOnUse">
      <stop stopColor="#FFB2EE"/>
      <stop offset="1" stopColor="#FEFCFF"/>
      </linearGradient>
      <linearGradient id="paint3_linear_108_40" x1="25" y1="18" x2="25" y2="40" gradientUnits="userSpaceOnUse">
      <stop stopColor="#FFB2EE"/>
      <stop offset="1" stopColor="#FEFCFF"/>
      </linearGradient>
      </defs>
    </svg>
  </a>
}
