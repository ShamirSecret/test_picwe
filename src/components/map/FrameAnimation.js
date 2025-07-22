'use client'
import { useState, useRef, useEffect } from 'react'
import NextImage from 'next/image'
import { cn } from '@/utils'

/**
 * 序列帧动画组件
 * @param {Object} props 组件属性
 * @param {string} props.basePath 图片基础路径，例如 "/images/EVM_LOGO_"
 * @param {string} props.ext 图片扩展名，例如 ".png"
 * @param {number} props.totalFrames 总帧数
 * @param {number} props.fps 每秒帧数
 * @param {boolean} props.loop 是否循环播放
 * @param {boolean} props.twoStageMode 是否启用两阶段模式
 * @param {number} props.firstStageEnd 第一阶段结束帧（默认24）
 * @param {number} props.firstStageFps 第一阶段的FPS（默认与fps相同）
 * @param {Object} props.style 样式对象
 * @param {string} props.className 类名
 * @param {string} props.id 元素ID
 * @param {number} props.width 图片宽度
 * @param {number} props.height 图片高度
 * @param {string} props.alt 图片alt文本
 * @param {boolean} props.isPlaying 是否正在播放（用于外部控制，可选）
 * @param {Function} props.onComplete 动画完成时的回调
 * @returns {JSX.Element}
 */
export default function FrameAnimation ({
  disabled = false,
  basePath,
  ext = '.png',
  totalFrames,
  fps = 24,
  autoPlay = false,
  loop = true,
  twoStageMode = false,
  firstStageEnd = 26,
  firstStageFps = null, // 如果为null，则使用fps
  style = {},
  className = '',
  id = '',
  width = 100,
  height = 100,
  alt = '',
  onComplete,
  onClick,
}) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFirstStage, setIsFirstStage] = useState(true) // 跟踪当前阶段
  const animationRef = useRef(null)
  const lastTimeRef = useRef(0)
  const currentFrameRef = useRef(0) // 用于动画循环中获取最新帧数

  // 内部鼠标事件处理
  const handleMouseEnter = (e) => {
    if (disabled) return
    setIsPlaying(true)
  }

  const handleMouseLeave = (e) => {
    if (disabled) return
    setIsPlaying(false)
  }

  // 启动动画
  const startAnimation = () => {
    if (animationRef.current) return

    lastTimeRef.current = 0

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const elapsed = timestamp - lastTimeRef.current

      // 根据帧率控制更新频率 - 两阶段模式下使用不同的FPS
      const currentFps = twoStageMode && firstStageFps && (currentFrameRef.current < firstStageEnd) ? firstStageFps : fps
      if (elapsed > (1000 / currentFps)) {
        setCurrentFrame(prev => {
          const nextFrame = prev + 1

          if (twoStageMode) {
            // 两阶段模式 - 基于当前帧来判断阶段
            if (prev < firstStageEnd) {
              // 当前在第一阶段：播放0到firstStageEnd-1帧
              if (nextFrame >= firstStageEnd) {
                // 第一阶段完成，直接进入第二阶段
                currentFrameRef.current = firstStageEnd // 更新ref
                return firstStageEnd // 开始第二阶段
              }
              currentFrameRef.current = nextFrame // 更新ref
              return nextFrame
            } else {
              // 当前在第二阶段：从firstStageEnd到totalFrames-1循环
              if (nextFrame >= totalFrames) {
                currentFrameRef.current = firstStageEnd // 更新ref
                return firstStageEnd // 回到第二阶段的开始
              }
              currentFrameRef.current = nextFrame // 更新ref
              return nextFrame
            }
          } else {
            // 原有的单阶段模式
            if (nextFrame >= totalFrames) {
              // 如果设置了完成回调，则调用
              onComplete?.()

              // 如果循环播放，则回到第一帧，否则停留在最后一帧
              const finalFrame = loop ? 0 : totalFrames - 1
              currentFrameRef.current = finalFrame // 更新ref
              return finalFrame
            }
            currentFrameRef.current = nextFrame // 更新ref
            return nextFrame
          }
        })

        lastTimeRef.current = timestamp
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // 停止动画
  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  // 重置动画
  const resetAnimation = () => {
    stopAnimation()
    setCurrentFrame(0)
    currentFrameRef.current = 0 // 重置ref
    setIsFirstStage(true) // 重置到第一阶段
  }

  // 播放状态变化时启动或停止动画
  useEffect(() => {
    if (isPlaying) {
      startAnimation()
    } else {
      stopAnimation()
      setCurrentFrame(0)
      currentFrameRef.current = 0 // 重置ref
      setIsFirstStage(true) // 重置到第一阶段
    }

    // 组件卸载时清理
    return () => {
      stopAnimation()
    }
  }, [isPlaying])

  // 构建当前帧的图片路径
  const frameSrc = `${basePath}${currentFrame.toString().padStart(5, '0')}${ext}`

  return (
    <NextImage
      id={id}
      className={cn(className,
        !disabled && !isPlaying && 'sail-glow-effect',
      )}
      style={style}
      src={frameSrc}
      alt={alt}
      width={width}
      height={height}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}
