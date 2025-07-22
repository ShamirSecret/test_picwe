'use client'
import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

export default function Indicator ({ containerRef, lang, dict }) {
  const [position, setPosition] = useState({ x: '70%' })
  useEffect(() => {
    const moveBox = document.querySelector('.move-box')
    const container = document.querySelector('.move-wrapper')
    let isHovering = false

    const handleMouseMove = (e) => {
      if (isHovering) {
        const rect = container.getBoundingClientRect()
        const moveBoxRect = moveBox.getBoundingClientRect()
        // 计算相对于容器的位置
        const x = Math.min(Math.max(0, e.clientX - rect.left - moveBoxRect.width / 2), rect.width - moveBoxRect.width)
        setPosition({ x: `${x}px`, y: 0 })
      }
    }

    const handleMouseEnter = () => {
      isHovering = true
    }

    const handleMouseLeave = () => {
      isHovering = false
    }

    moveBox.addEventListener('mouseenter', handleMouseEnter)
    moveBox.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      moveBox.removeEventListener('mouseenter', handleMouseEnter)
      moveBox.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className='absolute bottom-0 left-0 w-full move-wrapper z-50
      h-30
    '>
      <a href={`/${lang}/map`} target='_blank' className='bg-[#15161B] absolute bottom-0 cursor-pointer move-box
        w-[240px] h-[120px] rounded-t-[120px]
      ' style={{
        left: `${position.x}`,
      }}>
      <div className='w-full h-full flex flex-col items-center justify-center box-border
        gap-2.5 pt-5
      '>
        <svg className='
          w-11 h-11
        ' width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21.5417" cy="21.5417" r="21.0417" stroke="#B9B9B9"/>
          <path d="M8.97569 21.5417H33.2101M33.2101 21.5417L23.3368 10.7709M33.2101 21.5417L23.3368 31.415" stroke="#B9B9B9" strokeLinejoin="round"/>
        </svg>
        <span className='text-white
          text-xl
        '>
          {dict.home.section1.button}
        </span>
      </div>
      </a>
    </div>
  )
}

Indicator.propTypes = {
  containerRef: PropTypes.object.isRequired,
}
