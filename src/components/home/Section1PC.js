'use client'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { classnames } from '@/utils'
import gsap from 'gsap'
import Indicator from './Indicator'
import Section1Header from './Section1Header'
import TextPlugin from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

export default function Section ({ lang, dict }) {
  const containerRef = useRef(null)
  const [itemSize, setItemSize] = useState(160)
  const [isMaskRounded, setIsMaskRounded] = useState(false)
  const [isMove, setIsMove] = useState(false)
  const [hasTriggeredAutoClick, setHasTriggeredAutoClick] = useState(false)

  useEffect(() => {
    const updateSize = () => {
      const maskElement = document.querySelector('.banner-mask')
      if (maskElement) {
        const maskWidth = maskElement.offsetWidth
        // 每行13个，预留一些边距空间
        const size = Math.floor((maskWidth * 0.95) / 13)
        setItemSize(size)
        setIsMaskRounded(true)
      }
    }

    /**
     * 处理滚动事件
     * 当用户开始向下滚动时自动触发中心位置的拼图点击
     */
    const handleScroll = () => {
      // 检查是否已经触发过自动点击或者动画正在进行
      if (hasTriggeredAutoClick || isMove) return

      // 获取当前滚动位置
      const scrollY = window.scrollY || window.pageYOffset

      // 当滚动超过50px时触发中心位置点击
      if (scrollY > 50) {
        triggerCenterPieceClick()
      }
    }

    // textAnimation()
    updateSize()
    window.addEventListener('resize', updateSize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasTriggeredAutoClick, isMove])

  const arr = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 10, 'chain_9', 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'chain_3', 11, 'chain_15', 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 'chain_17', 7, 'chain_1', 9, 10, 11, 12, 'chain_12', 14, 15, 16, 17, 18, 19],

    [1, 2, 3, 4, 5, 6, 7, 8, 'chain_2', 'chain_0', 'chain_5', 12, 13, 'chain_18', 15, 16, 17, 18, 19],

    [1, 2, 3, 4, 5, 'chain_4', 7, 'chain_8', 'chain_20', 10, 11, 12, 'chain_10', 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 'chain_7', 11, 'chain_21', 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 'chain_13', 8, 'chain_14', 10, 'chain_6', 12, 'chain_16', 'chain_11', 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 'chain_19', 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  ]

  // arr = [
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9],
  // ]
  const animationCount = useRef(0)
  const totalAnimations = useRef(0)
  const isFinally = useRef(false)

  const textAnimation = () => {
    if (lang === 'cn') return
    const tl = gsap.timeline()
    tl.to('.banner-h1', {
      text: dict.home.section1.title[0],
      duration: 1,
      ease: 'none',
    })
    tl.to('.banner-h2', {
      text: dict.home.section1.title[1],
      duration: 1,
      ease: 'none',
    })
    tl.to('.banner-h3', {
      text: dict.home.section1.title[2],
      duration: 1,
      ease: 'none',
    })
    tl.to('.banner-h4', {
      text: dict.home.section1.title[3],
      duration: 1,
      ease: 'none',
    })
  }

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

  const finallyAnimation = () => {
    if (isFinally.current) return
    isFinally.current = true
    gsap.to('.banner-mask', {
      opacity: 0,
      display: 'none',
      duration: 0.5,
      ease: 'power1.in',
    })
    gsap.to('.banner-main', {
      opacity: 1,
      duration: 0.6,
      ease: 'power1.in',
      onComplete: () => {
        textAnimation()
      },
    })
    gsap.to('.banner-header-menu', {
      opacity: 1,
      duration: 0.6,
      ease: 'power1.in',
    })

    const tl = gsap.timeline()
    tl.from('.banner-main-image-hand', {
      transformOrigin: 'left 30% top 30% ',
      rotate: '30deg',
      x: '10%',
      duration: 0.6,
      ease: 'power1.in',
    })
    tl.from('.banner-main-image-ship', {
      transformOrigin: 'left 30% top 30% ',
      x: '10%',
      y: '34%',
      duration: 0.6,
      ease: 'power1.in',
    }, 0)
    tl.from('.banner-text', {
      opacity: 0,
      duration: 0.6,
      ease: 'power1.in',
    })
  }

  /**
   * 自动触发中心位置的拼图点击
   * 找到拼图数组中心位置并模拟点击事件
   */
  const triggerCenterPieceClick = () => {
    if (hasTriggeredAutoClick || isMove) return

    // 计算中心位置坐标
    const centerRow = Math.floor(arr.length / 2)
    const centerCol = Math.floor(arr[0].length / 2)

    // 查找中心位置的拼图元素
    const centerPiece = document.querySelector(`[data-piece="${centerRow}-${centerCol}"]`)
    if (centerPiece) {
      setHasTriggeredAutoClick(true)
      // 创建模拟的点击事件
      const mockEvent = {
        currentTarget: centerPiece,
        preventDefault: () => {},
        stopPropagation: () => {},
      }
      handlePieceClick(mockEvent, centerRow, centerCol)
    }
  }

  /**
   * 处理拼图点击事件
   * @param {Event} e - 点击事件对象
   * @param {number} rowIndex - 行索引
   * @param {number} colIndex - 列索引
   */
  const handlePieceClick = (e, rowIndex, colIndex) => {
    if (isMove) return
    setIsMove(true)
    console.log('currentTarget', e.currentTarget)
    const clickedPiece = e.currentTarget
    const allPieces = getAllPiecesWithDistance(rowIndex, colIndex)
    const maxDistance = Math.sqrt(arr.length * arr.length + arr[0].length * arr[0].length)

    setTimeout(() => {
      finallyAnimation()
    }, 3500)

    // 获取容器高度，用于计算下落距离
    const containerHeight = containerRef.current.getBoundingClientRect().height
    const fallDistance = containerHeight + 100 // 只需要比容器高度多一点点即可

    // 重置计数器
    animationCount.current = 0
    totalAnimations.current = allPieces.length + 1 // 所有其他块 + 点击的块

    const checkAllAnimationsComplete = () => {
      animationCount.current++
      if (animationCount.current === totalAnimations.current) {
        finallyAnimation()
      }
    }

    // 设置点击的拼图的初始状态
    gsap.set(clickedPiece, {
      transformOrigin: 'center center',
      zIndex: 1000,
    })

    // 点击的拼图动画
    gsap.to(clickedPiece, {
      y: fallDistance,
      x: gsap.utils.random(-100, 100),
      rotation: gsap.utils.random(-720, 720),
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
        const tl = gsap.timeline()

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
          onComplete: checkAllAnimationsComplete,
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

  return <section className="w-full min-h-screen home-banner overflow-hidden
    hidden md:flex
    pt-6 pb-6
    lg:pt-8 lg:pb-8
    xl:pt-10 xl:pb-10
  ">
    <div className="container mx-auto w-full flex-grow">
      <div className='w-full h-full flex flex-col relative'>
        <Section1Header lang={lang} dict={dict} />
        <div className='w-full h-full overflow-hidden relative
          rounded-b-[30px]
        ' ref={containerRef}>

          <div className={classnames(`w-full h-full flex items-center justify-center overflow-hidden banner-mask
            absolute inset-0 z-10
          `,
          )}>
            <div className={classnames('bg-[#15161B]', isMaskRounded ? 'opacity-100' : 'opacity-0')}>
              {
                arr.map((item, rowIndex) => (
                  <div key={rowIndex} className="flex w-fit">
                    {item.map((i, colIndex) => {
                      const pieceKey = `${rowIndex}-${colIndex}`
                      return (
                        <div
                            key={pieceKey}
                            data-piece={pieceKey}
                            className={classnames(`flex items-center justify-center cursor-pointer jigsaw-item
                              transform-oorigin-center-center relative z-[1]
                            `,
                            i === 'chain_0' ? 'z-[1000]' : '',
                            typeof i !== 'number' && !isMove ? 'jigsaw-box ' : '',
                            )}
                            style={{
                              width: `${itemSize}px`,
                              height: `${itemSize}px`,
                            }}
                            onClick={(e) => handlePieceClick(e, rowIndex, colIndex)}
                          >
                        {
                          i === 'chain_0'
                            ? <Image className="h-auto !max-w-none absolute z-50
                              left-1/2 -translate-x-1/2
                            "
                            style={{
                              width: `${itemSize * 1.5}px`,
                              top: `-${itemSize * 0.48}px`,
                            }}
                            src={'/images/jigsaw_chain_0.png'} alt="" width={242} height={177} priority={true} loading="eager" />
                            : (
                                (rowIndex + colIndex) % 2 === 0
                                  ? (
                              <Image className="!max-w-none"
                                style={{
                                  width: `${itemSize * 1.54}px`,
                                  height: `${itemSize * 1.04}px`,
                                }}
                                src={`/images/jigsaw_${typeof i === 'number' ? '1' : i}.png`} alt="" width={234} height={160} priority={true} loading="eager" />
                                    )
                                  : (
                                <Image className="!max-w-none"
                                  style={{
                                    width: `${itemSize * 1.04}px`,
                                    height: `${itemSize * 1.54}px`,
                                    marginLeft: `-${itemSize * 0.02}px`,
                                  }}
                                  src={`/images/jigsaw_${typeof i === 'number' ? '2' : i}.png`} alt="" width={160} height={234} priority={true} loading="eager" />
                                    )
                              )
                            }
                      </div>
                      )
                    })}
                  </div>
                ))
              }
            </div>
          </div>

          {/* opacity-100 relative z-[100000] */}
          <div className='w-full h-full banner-main bg-white text-black opacity-0
            pt-10 px-10
            lg:pt-12 lg:px-12
            xl:pt-15 xl:px-15
            2xl:pt16 2xl:px-16
          '>
            <div className='w-full h-full flex flex-col items-center justify-between relative
              pt-6
              lg:pt-8
              xl:pt-9
              2xl:pt-10
            '>
              <a href="https://mirror.xyz/0xbee7d276004a9C205c67B91a604591581AC79E68/cnHpzNc99jmSfd3vEQE7MvkTzAKbv1w0c0AujKMIQmw" target="_blank" className=' bg-[#F1F1F1] border border-[#dbdbdb] rounded-full flex items-center
                px-12 py-1 gap-3.5 text-sm
                lg:px-15 lg:py-1.5 lg:gap-4 lg:text-base
                xl:px-18 xl:py-2 xl:gap-5 xl:text-lg
                2xl:px-20 2xl:py-2.5 2xl:gap-6 2xl:text-xl
              '>
                <span className=''>
                  {dict.home.section1.link}
                </span>
                <svg className='
                  w-4.5 h-4.5
                  lg:w-5 lg:h-5
                  xl:w-6 xl:h-6
                ' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11.5" stroke="#B9B9B9"/>
                  <path d="M5 12H18.5M18.5 12L13 6M18.5 12L13 17.5" stroke="#B9B9B9" strokeLinejoin="round"/>
                </svg>
              </a>

              {
                lang === 'cn' && (
                  <div className='w-full flex flex-col items-center
                  '>
                    <h1 className='font-bold !leading-1.1 uppercase
                      md:text-[60px]
                      lg:text-[70px]
                      xl:text-[80px]
                      2xl:text-[96px]
                    '>
                      {dict.home.section1.title}
                    </h1>
                    <div className='
                      md:text-base md:mt-2
                      lg:text-lg lg:mt-2.5
                      xl:text-xl xl:mt-3
                    '>
                      {
                        dict.home.section1.intro.map((item, index) => (
                          <p key={index}>
                            {item}
                          </p>
                        ))
                      }
                    </div>
                  </div>
                )
              }
              {
                lang === 'en' && (
                  <div className='w-full flex flex-col
                    font-ms font-bold !leading-1 self-end
                    max-w-[450px] text-[50px] mt-6 pr-10
                    lg:max-w-[580px] lg:text-[60px] lg:mt-8 lg:pr-15
                    xl:max-w-[750px] xl:text-[76px] xl:mt-9 xl:pr-20
                    2xl:max-w-[980px] 2xl:text-[96px] 2xl:mt-10 2xl:self-center
                  '>
                    <div className='flex justify-start uppercase'>
                      <h1 className='banner-h1'>&nbsp;</h1>
                      <span>&nbsp;</span>
                    </div>
                    <div className='flex justify-center items-center uppercase
                      gap-3.5 pl-14
                      lg:gap-4 lg:pl-16
                      xl:gap-5 xl:pl-20
                      2xl:gap-6 2xl:pl-25
                    '>
                      <div className='rounded-full bg-[#FFC90F]
                        w-10 h-10
                        lg:w-12 lg:h-12
                        xl:w-14 xl:h-14
                        2xl:w-16 2xl:h-16
                      '></div>
                      <h1 className='banner-h2'>&nbsp;</h1>
                      <span>&nbsp;</span>
                    </div>
                    <div className='flex items-center uppercase
                      pl-16
                      lg:pl-20
                      xl:pl-25
                      2xl:pl-30
                    '>
                      <h1 className='banner-h3'>&nbsp;</h1>
                      <span>&nbsp;</span>
                      <div className='rounded-full bg-[#FFC90F]
                        w-10 h-10
                        lg:w-12 lg:h-12
                        xl:w-14 xl:h-14
                        2xl:w-16 2xl:h-16
                      '></div>
                    </div>
                    <div className='flex justify-end uppercase'>
                      <h1 className='banner-h4'>&nbsp;</h1>
                      <span>&nbsp;</span>
                    </div>
                    <div className='text-right banner-text
                      md:text-sm
                      lg:text-base
                      xl:text-lg
                    '>
                      {
                        dict.home.section1.intro.map((item, index) => (
                          <p key={index}>
                            {item}
                          </p>
                        ))
                      }
                      {/* <p>PicWe is the world's first decentralized infrastructure</p> */}
                      {/* <p>enabling omni-chain liquidity for traders and developers.</p> */}
                    </div>
                  </div>
                )
              }

              <div className={classnames(`aspect-[920/488] relative banner-main-image self-start
                w-[60%] max-w-[920px]
              `,
              lang === 'en' && 'mt-[-10%]',
              )}
              >
                <Image className='w-full h-full object-contain relative z-20' src={'/images/banner_main.png'} alt="" width={920} height={488} priority={true} loading="eager" />
                <Image className='absolute h-auto banner-main-image-hand
                  w-[8.26086%] top-[13.5%] left-[50.01%]
                ' src={'/images/banner_hand.png'} alt="" width={76} height={90} priority={true} loading="eager" />
                <Image className='absolute h-auto z-10 banner-main-image-ship
                  w-[8.1521739%] top-[-1.6%] left-[52.9%]
                ' src={'/images/banner_ship.png'} alt="" width={75} height={86} priority={true} loading="eager" />
              </div>

              {/* <div className='absolute bottom-0 aspect-[920/488] banner-main-image
                left-0 w-[60%] max-w-[920px]
                2xl:left-[5%] 2xl:w-[70%]
              '>
                <Image className='w-full h-full object-contain relative z-20' src={'/images/banner_main.png'} alt="" width={920} height={488} priority={true} loading="eager" />
                <Image className='absolute h-auto banner-main-image-hand
                  w-[8.26086%] top-[13.5%] left-[50.01%]
                ' src={'/images/banner_hand.png'} alt="" width={76} height={90} priority={true} loading="eager" />
                <Image className='absolute h-auto z-10 banner-main-image-ship
                  w-[8.1521739%] top-[-1.6%] left-[52.9%]
                ' src={'/images/banner_ship.png'} alt="" width={75} height={86} priority={true} loading="eager" />
              </div> */}

            </div>
          </div>

          <Indicator containerRef={containerRef} lang={lang} dict={dict} />
        </div>
      </div>
    </div>
  </section>
}
