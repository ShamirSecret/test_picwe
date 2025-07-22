'use client'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

export default function PageLoadingComponent ({
  videoOver,
  setVideoOver,
  videoLoaded,
  setVideoLoaded,
  imagesLoaded,
  assetsLoaded,
}) {
  const videoRef = useRef(null)

  // 处理视频加载和播放
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      // console.log('视频可以开始播放')
      setVideoLoaded(true)
    }

    const handleEnded = () => {
      // console.log('视频播放结束')
      setVideoOver(true)
    }

    const handleError = () => {
      // console.error('视频加载错误:', error)
      // 视频加载失败时，直接跳过视频
      setVideoOver(true)
    }

    // 添加事件监听器
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    // 手动加载视频
    video.load()

    // 清理事件监听器
    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    // 资源加载完毕，播放视频
    if (assetsLoaded) {
      videoRef.current.play()
    }
  }, [assetsLoaded])

  if (videoOver) {
    return null
  }

  return (
    <div className="bg-black flex items-center justify-center fixed inset-0 z-[100]">
      {
        !assetsLoaded && (
        <div className="aspect-[1920/1080]
          absolute bottom-0 left-1/2 -translate-x-1/2
          min-h-full min-w-full
        " style={{
          '--root-w': 1920,
          '--root-h': 1080,
        }}>
            <div className='position-sail1' style={{
              '--l': 725,
              '--t': 440,
              '--w': 260,
            }}>
              <Image
                className="w-full"
                src="/images/map-sail1.gif" alt="loading" width={411} height={361}
              />
              <p className='text-center'>Loading...</p>
            </div>
          </div>
        )
      }
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${!assetsLoaded ? 'hidden' : ''}`}
        src="/mp4/to-map.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  )
}
