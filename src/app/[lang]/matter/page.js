'use client'
import { useState, useEffect } from 'react'

export default function Matter () {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const moveBox = document.querySelector('.move-box')
    const container = document.querySelector('.wrapper-box')
    let isHovering = false

    const handleMouseMove = (e) => {
      if (isHovering) {
        const rect = container.getBoundingClientRect()
        // 计算相对于容器的位置
        const x = Math.min(Math.max(0, e.clientX - rect.left - 30), rect.width - 60)
        const y = Math.min(Math.max(0, e.clientY - rect.top - 30), rect.height - 60)
        setPosition({ x, y })
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
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[800px] h-[800px] border bg-white relative">
        <div className="w-full h-15 absolute left-0 bottom-0 wrapper-box">
          <div
            className="w-15 h-15 bg-red-500 absolute cursor-move move-box"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
