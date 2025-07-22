'use client'
import Image from 'next/image'
import { useState, useRef } from 'react'
import gsap from 'gsap'

export default function Page () {
  const animationCount = useRef(0)
  const totalAnimations = useRef(0)
  const arr = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  ]

  // 获取所有拼图的距离信息
  const getAllPiecesWithDistance = (rowIndex, colIndex) => {
    const pieces = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[0].length; j++) {
        // 跳过当前位置
        if (i === rowIndex && j === colIndex) continue

        // 计算到中心的距离
        const deltaRow = i - rowIndex
        const deltaCol = j - colIndex
        const distance = Math.sqrt(deltaRow * deltaRow + deltaCol * deltaCol)

        pieces.push({
          row: i,
          col: j,
          distance,
          // 计算方向角度，用于决定X方向的偏移
          angle: Math.atan2(deltaRow, deltaCol),
        })
      }
    }
    // 按距离排序，这样近的先掉落
    return pieces.sort((a, b) => a.distance - b.distance)
  }

  const [isMove, setIsMove] = useState(false)
  const handlePieceClick = (e, rowIndex, colIndex) => {
    if (isMove) return
    setIsMove(true)
    const clickedPiece = e.currentTarget
    const allPieces = getAllPiecesWithDistance(rowIndex, colIndex)
    const maxDistance = Math.sqrt(arr.length * arr.length + arr[0].length * arr[0].length)

    // 重置计数器
    animationCount.current = 0
    totalAnimations.current = allPieces.length + 1 // 所有其他块 + 点击的块

    const checkAllAnimationsComplete = () => {
      animationCount.current++
      if (animationCount.current === totalAnimations.current) {
        // console.log('所有动画已完成！')
        // 这里可以触发你想要的回调函数
      }
    }

    // 设置点击的拼图的初始状态
    gsap.set(clickedPiece, {
      transformOrigin: 'center center',
      zIndex: 1000,
    })

    // 点击的拼图动画
    gsap.to(clickedPiece, {
      y: 2000,
      x: gsap.utils.random(-100, 100),
      rotation: gsap.utils.random(-720, 720),
      scale: 0.8,
      duration: 2.5,
      ease: 'power1.in',
      transformOrigin: 'center center',
      rotationX: gsap.utils.random(-360, 360),
      rotationY: gsap.utils.random(-360, 360),
      onStart: () => {
        // 创建一个旋转补间动画
        gsap.to(clickedPiece, {
          rotation: `+=${gsap.utils.random(180, 360)}`,
          duration: 1,
          ease: 'power1.in',
          delay: 0.5,
        })
      },
      onComplete: checkAllAnimationsComplete,
    })

    // 其他拼图的动画
    allPieces.forEach(({ row, col, distance, angle }, index) => {
      const pieceElement = document.querySelector(`[data-piece="${row}-${col}"]`)
      if (pieceElement) {
        const normalizedDistance = distance / maxDistance
        const baseDelay = distance * 0.15
        const waveDelay = Math.pow(normalizedDistance, 0.5) * 0.8
        const delay = baseDelay + waveDelay
        const zIndex = Math.round(900 - normalizedDistance * 800)
        const duration = 2.5 + normalizedDistance * 0.8

        gsap.set(pieceElement, {
          transformOrigin: 'center center',
          zIndex,
        })

        const xOffset = Math.cos(angle) * gsap.utils.random(200, 400)
        const yOffset = 2000 + Math.pow(normalizedDistance, 0.5) * 800

        // 主动画时间轴
        const tl = gsap.timeline({
          onComplete: checkAllAnimationsComplete,
        })

        // 添加主动画
        tl.to(pieceElement, {
          y: yOffset,
          x: xOffset,
          rotation: gsap.utils.random(-360, 360),
          rotationX: gsap.utils.random(-360, 360),
          rotationY: gsap.utils.random(-360, 360),
          scale: gsap.utils.random(0.8, 1),
          duration,
          delay,
          ease: 'power2.in',
          transformOrigin: 'center center',
        })

        // 添加额外旋转
          .to(pieceElement, {
            rotation: `+=${gsap.utils.random(-180, 180)}`,
            rotationX: `+=${gsap.utils.random(-180, 180)}`,
            rotationY: `+=${gsap.utils.random(-180, 180)}`,
            duration: duration * 0.6,
            ease: 'power1.in',
          }, delay + duration * 0.2)

        // 添加透明度动画
          .to(pieceElement, {
            opacity: 0,
            duration: 0.1,
            ease: 'none',
            onComplete: () => {
              gsap.set(pieceElement, { visibility: 'hidden' })
            },
          }, delay + duration - 0.1)
      }
    })
  }

  return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="w-[80%] h-[80%] bg-white overflow-hidden flex flex-col items-center justify-center relative">
          <div className='relative'>
            {
              arr.map((item, rowIndex) => (
                <div key={rowIndex} className="flex w-fit">
                  {item.map((i, colIndex) => {
                    const pieceKey = `${rowIndex}-${colIndex}`
                    return (
                      <div
                        key={pieceKey}
                        data-piece={pieceKey}
                        className="w-[160px] h-[160px] flex items-center justify-center jigsaw-box"
                        style={{
                          transformOrigin: 'center center',
                          position: 'relative',
                          zIndex: 1,
                        }}
                        onClick={(e) => handlePieceClick(e, rowIndex, colIndex)}
                      >
                        {
                          (rowIndex + colIndex) % 2 === 0
                            ? (
                            <Image className="w-[245px] h-[167px] !max-w-none" src={'/images/jigsaw_1.png'} alt="" width={234} height={160} priority={true} loading="eager" />
                              )
                            : (
                            <Image className="w-[167px] h-[245px] !max-w-none" src={'/images/jigsaw_2.png'} alt="" width={160} height={234} priority={true} loading="eager" />
                              )
                        }
                      </div>
                    )
                  })}
                </div>
              ))
            }
          </div>

          <div className="indicator"></div>
        </div>
      </div>
  )
}
