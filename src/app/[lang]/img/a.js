'use client'
import Image from 'next/image'
import { useState } from 'react'
import gsap from 'gsap'

export default function Page () {
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

  const handlePieceClick = (e, rowIndex, colIndex) => {
    const clickedPiece = e.currentTarget
    const allPieces = getAllPiecesWithDistance(rowIndex, colIndex)
    const maxDistance = Math.sqrt(arr.length * arr.length + arr[0].length * arr[0].length)

    // 点击的拼图动画
    gsap.to(clickedPiece, {
      y: 2000,
      rotation: gsap.utils.random(-180, 180),
      scale: 0.8,
      duration: 1.2,
      ease: 'power2.in',
    })

    // 其他拼图的动画
    allPieces.forEach(({ row, col, distance, angle }) => {
      const pieceElement = document.querySelector(`[data-piece="${row}-${col}"]`)
      if (pieceElement) {
        const normalizedDistance = distance / maxDistance // 归一化距离 0-1
        const delay = normalizedDistance * 0.5 // 最大延迟0.5秒

        // 根据方向角度计算X偏移
        const xOffset = Math.cos(angle) * gsap.utils.random(200, 600)

        gsap.to(pieceElement, {
          y: gsap.utils.random(1500, 2500),
          x: xOffset,
          rotation: gsap.utils.random(-360, 360),
          scale: gsap.utils.random(0.6, 1.2),
          duration: gsap.utils.random(1, 2),
          delay,
          ease: 'power2.in',
          opacity: 0,
        })
      }
    })
  }

  return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="w-[80%] h-[80%] bg-white overflow-hidden flex flex-col items-center justify-center relative">
          <div className=''>
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
