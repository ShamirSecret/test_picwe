'use client'
import NextImage from 'next/image'
import { useState, useRef, useEffect, useMemo } from 'react'
import PageLoadingComponent from './PageLoading'
import gsap from 'gsap'
import FrameAnimation from './FrameAnimation'
import Dialog from './Dialog'
import { cn } from '@/utils'

export default function Section1 ({ lang }) {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [videoOver, setVideoOver] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const assetsLoaded = useMemo(() => {
    return videoLoaded && imagesLoaded
  }, [videoLoaded, imagesLoaded])

  useEffect(() => {
    const imagePaths = [
      '/images/map-bg.png',
      '/images/map-dialog-content.png',
      '/images/map-dialog-close.png',
      '/images/map-dialog-obj.png',
      '/images/map-dialog-button.png',
      '/images/map-sail1.gif',
      '/images/map-sail2.gif',
      '/images/map-evm-dao.png',
      '/images/map-evm-logo.png',
      // 预加载所有EVM LOGO序列帧
      ...Array.from({ length: 60 }, (_, i) => `/images/evm-logos/EVM_LOGO_${i.toString().padStart(5, '0')}.png`),
      ...Array.from({ length: 60 }, (_, i) => `/images/pipi-logos/PIPI_LOGO_${i.toString().padStart(5, '0')}.png`),
      '/images/map-evm-obj1.gif',
      '/images/map-evm-obj2.gif',
      '/images/map-evm-obj3.gif',
      '/images/map-evm-obj4.gif',
      '/images/map-evm-obj5.gif',
      '/images/map-evm-obj6.gif',
      '/images/map-evm-obj7.gif',
      '/images/map-move-dao.png',
      '/images/map-move-logo.png',
      '/images/map-move-obj1.gif',
      '/images/map-flag.png',
      '/images/map-btc-dao.png',
      '/images/map-btc-logo.png',
      '/images/map-btc-obj1.gif',
      '/images/map-btc-obj2.gif',
      '/images/map-btc-obj3.gif',
      '/images/map-solana-dao.png',
      '/images/map-solana-logo.png',
      '/images/map-solana-obj1.gif',
      '/images/map-solana-obj2.gif',
      '/images/map-solana-obj3.gif',
      '/images/map-ton-dao.png',
      '/images/map-ton-logo.png',
      '/images/map-ton-obj1.gif',
      '/images/map-no-dao.png',
      '/images/map-cloud1.png',
      '/images/map-cloud2.png',
      '/images/map-cloud3.png',
    ]
    const a = new Date()
    let loadedCount = 0
    const totalImages = imagePaths.length

    const preloadImages = () => {
      imagePaths.forEach(path => {
        const img = new Image()
        img.src = path
        img.onload = () => {
          loadedCount++
          if (loadedCount === totalImages) {
            const b = new Date()
            setImagesLoaded(true)
          }
        }
        img.onerror = () => {
          loadedCount++
          if (loadedCount === totalImages) {
            setImagesLoaded(true)
          }
        }
      })
    }

    preloadImages()
  }, [])

  const startMoveCloud = () => {
    const cloud1 = document.querySelector('.position-cloud1')
    const cloud2 = document.querySelector('.position-cloud2')
    const cloud3 = document.querySelector('.position-cloud3')
    const titleH1 = document.querySelector('#title-h1')
    const titleH2 = document.querySelector('#title-h2')

    // 初始化标题位置 - 在视野下方并且不可见
    gsap.set(titleH1, {
      y: 100,
      opacity: 0,
    })
    gsap.set(titleH2, {
      y: 100,
      opacity: 0,
    })

    // 云朵动画
    gsap.to(cloud1, {
      '--l': -1218,
      '--t': -450,
      duration: 1,
      ease: 'power2.inOut',
    })
    gsap.to(cloud2, {
      '--r': -984,
      '--t': -417,
      duration: 1,
      ease: 'power2.inOut',
    })
    gsap.to(cloud3, {
      '--l': -640,
      '--b': -430,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        // 云朵动画完成后，开始标题动画和云朵浮动
        animateTitles()
        startCloudFloat()
      },
    })
  }

  // 云朵随机浮动动画
  const startCloudFloat = () => {
    const cloud1 = document.querySelector('.position-cloud1')
    const cloud2 = document.querySelector('.position-cloud2')
    const cloud3 = document.querySelector('.position-cloud3')

    // 为每个云朵创建循环浮动动画
    const createFloatAnimation = (cloud, baseL, baseT, baseR, baseB, isUsingRight = false, isUsingBottom = false) => {
      const floatLoop = () => {
        // 随机生成浮动范围
        const randomX = (Math.random() - 0.5) * 200 // X轴随机偏移 -100 到 +100
        const randomY = (Math.random() - 0.5) * 180 // Y轴随机偏移 -90 到 +90
        const duration = 4 + Math.random() * 2 // 动画时长 4-8秒

        const animationProps = {
          duration,
          ease: 'power1.inOut',
          onComplete: floatLoop, // 循环执行
        }

        // 根据定位方式设置动画属性
        if (isUsingRight) {
          animationProps['--r'] = baseR + randomX
        } else {
          animationProps['--l'] = baseL + randomX
        }

        if (isUsingBottom) {
          animationProps['--b'] = baseB + randomY
        } else {
          animationProps['--t'] = baseT + randomY
        }

        gsap.to(cloud, animationProps)
      }

      // 延迟启动，避免所有云朵同步
      setTimeout(floatLoop, Math.random() * 2000)
    }

    // 为三个云朵分别创建浮动动画
    // cloud1: 使用 left 和 top
    createFloatAnimation(cloud1, -1218, -450, null, null, false, false)

    // cloud2: 使用 right 和 top
    createFloatAnimation(cloud2, null, -417, -984, null, true, false)

    // cloud3: 使用 left 和 bottom
    createFloatAnimation(cloud3, -640, null, null, -430, false, true)
  }

  // 标题动画函数
  const animateTitles = () => {
    const titleH1 = document.querySelector('#title-h1')
    const titleH2 = document.querySelector('#title-h2')

    // 创建时间轴
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
    })

    // 添加h1动画
    tl.to(titleH1, {
      y: 0,
      opacity: 1,
      duration: 1,
    })

    // 添加h2动画，在h1动画开始后0.3秒开始
    tl.to(titleH2, {
      y: 0,
      opacity: 1,
      duration: 1,
    }, '-=0.7') // 使h2动画在h1动画完成前0.7秒开始，形成错落感
  }

  const startMoveSail = () => {
    const sail = document.querySelector('.position-sail2')
    // 起始位置 (420, 930)
    const tl = gsap.timeline()
    tl.to(sail, {
      '--l': 560,
      '--t': 880,
      duration: 1.5,
      ease: 'linear',
    })
    tl.to(sail, {
      '--l': 655,
      '--t': 766,
      duration: 1.5,
      ease: 'linear',
      onComplete: () => {
        setArriveEvm(true)
        setIsMoving(false)
      },
    })
  }

  // 鸟飞行动画
  const startBirdsFly = () => {
    const birds = document.querySelectorAll('.position-bird')

    // 为每只鸟设置初始位置（屏幕左侧外）
    birds.forEach((bird, index) => {
      gsap.set(bird, {
        '--l': -600,
        '--t': 200 + Math.random() * 400, // 随机高度
      })
    })

    // 创建飞行动画函数
    const flyBird = (bird, delay) => {
      // 随机飞行路径参数
      const duration = 10 + Math.random() * 8 // 飞行时间 10-18秒

      // 随机起点和终点
      const startX = -600 - Math.random() * 300 // 左侧屏幕外随机位置
      const startY = Math.random() * 1440 // 随机高度
      const endX = 2560 + Math.random() * 300 // 右侧屏幕外随机位置
      const endY = Math.random() * 1440 // 随机高度

      // 创建时间轴
      const tl = gsap.timeline({
        delay,
        onComplete: () => {
          // 完成后再次触发飞行（循环）
          setTimeout(() => {
            flyBird(bird, Math.random() * 5)
          }, Math.random() * 10000) // 0-10秒的随机间隔
        },
      })

      // 使用fromTo设置起始和结束状态
      tl.fromTo(bird,
        {
          // 起始状态
          '--l': startX,
          '--t': startY,
        },
        {
          // 结束状态
          '--l': endX,
          '--t': endY,
          duration,
          ease: 'power1.inOut',
          onStart: () => {
          },
        },
      )
      return tl
    }

    // 随机间隔启动每只鸟的飞行
    birds.forEach((bird, index) => {
      setTimeout(() => {
        flyBird(bird, 0)
      }, index * 5000 + Math.random() * 10000) // 每只鸟之间有2-5秒的随机间隔
    })
  }

  // 当加载完成后启动鸟飞行动画
  useEffect(() => {
    if (imagesLoaded) {
      startBirdsFly()
    }
  }, [imagesLoaded])

  useEffect(() => {
    if (videoOver) {
      startMoveCloud()
    }
  }, [videoOver])

  const [isMoving, setIsMoving] = useState(false)
  const [arriveEvm, setArriveEvm] = useState(false)
  const [step, setStep] = useState(0)

  const handleClickSail = () => {
    if (isMoving) return
    setIsMoving(true)
    if (step === 0) {
      startMoveSail()
      setStep(1)
    }
  }

  return <>
    <PageLoadingComponent
      videoOver={videoOver}
      setVideoOver={setVideoOver}
      videoLoaded={videoLoaded}
      setVideoLoaded={setVideoLoaded}
      imagesLoaded={imagesLoaded}
      assetsLoaded={assetsLoaded}
    />

    <div className="w-full h-screen bg-white relative overflow-auto scrollbar-hide">
      {/* <div className="w-[2560px] h-[1440px] relative overflow-hidden
        " style={{
        '--root-w': 2560,
        '--root-h': 1440,
        background: 'url(/images/map-bg.png) no-repeat center center / 100% 100%',
      }}> */}
      <div className="aspect-[2560/1440]
        absolute bottom-0 left-0
        min-h-full min-w-full
        transform overflow-hidden
      " style={{
        '--root-w': 2560,
        '--root-h': 1440,
        background: 'url(/images/map-bg.png) no-repeat center center / 100% 100%',
      }}>

        {/* evm */}
        <div className={cn('position-island z-10 transition-all duration-[2s]',
          !arriveEvm && 'grayscale',
        )}
          style={{
            '--l': 552,
            '--t': 291,
            '--w': 989,
            '--h': 693,
            background: 'url(/images/map-evm-dao.png) no-repeat center center / 100% 100%',
          }}
        >
          {/* 动态logo */}
          <FrameAnimation
            className={cn('position-obj',
              arriveEvm ? 'cursor-pointer' : '',
            )}
            style={{
              '--l': 511,
              '--t': -138,
              '--obj-w': 355,
            }}
            disabled={!arriveEvm}
            basePath="/images/evm-logos/EVM_LOGO_"
            ext=".png"
            totalFrames={60}
            fps={24}
            loop={true}
            twoStageMode={true}
            firstStageEnd={28}
            firstStageFps={60}
            width={500}
            height={500}
            alt="evm logo"
            onClick={() => {
              if (arriveEvm) {
                setDialogVisible(true)
              }
            }}
          />
          {/* 静态logo - 默认显示，hover时隐藏
          <NextImage id="env-logos-static" className='position-obj cursor-pointer opacity-100 group-hover:opacity-0 transition-opacity duration-300
          ' style={{
            '--l': 610,
            '--t': 118,
            '--obj-w': 154,
            '--obj-h': 61,
          }} src='/images/map-evm-logo.png' alt='ton' width={100} height={100}
          onClick={() => setDialogVisible(true)} /> */}
          <NextImage className='position-obj
          ' style={{
            '--l': 191,
            '--t': 175,
            '--obj-w': 98,
            '--obj-h': 122,
          }} src='/images/map-evm-obj1.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 351,
            '--t': 173,
            '--obj-w': 122,
            '--obj-h': 124,
          }} src='/images/map-evm-obj2.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 659,
            '--t': 302,
            '--obj-w': 105,
            '--obj-h': 108,
          }} src='/images/map-evm-obj3.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 189,
            '--t': 451,
            '--obj-w': 100,
            '--obj-h': 194,
          }} src='/images/map-evm-obj4.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 276,
            '--t': 486,
            '--obj-w': 75,
            '--obj-h': 78,
          }} src='/images/map-evm-obj5.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 351,
            '--t': 534,
            '--obj-w': 178,
            '--obj-h': 168,
          }} src='/images/map-evm-obj6.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 447,
            '--t': 478,
            '--obj-w': 76,
            '--obj-h': 63,
          }} src='/images/map-evm-obj7.gif' alt='ton' width={100} height={100} />
        </div>

        {/* move */}
        <div className='position-island z-20
        ' style={{
          '--l': 126,
          '--t': 861,
          '--w': 542,
          '--h': 440,
          background: 'url(/images/map-move-dao.png) no-repeat center center / 100% 100%',
        }}>
          {/* 动态logo */}
          <FrameAnimation
            className='position-obj cursor-pointer z-10'
            style={{
              '--l': 175,
              '--t': -141,
              '--obj-w': 226,
            }}
            basePath="/images/pipi-logos/PIPI_LOGO_"
            ext=".png"
            totalFrames={60}
            fps={24}
            loop={true}
            twoStageMode={true}
            firstStageEnd={28}
            firstStageFps={60}
            width={500}
            height={500}
            alt="move logo"
            onClick={() => setDialogVisible(true)}
          />
          {/* <NextImage className='position-obj
          ' style={{
            '--l': 236,
            '--t': -29,
            '--obj-w': 94,
            '--obj-h': 77,
          }} src='/images/map-move-logo.png' alt='ton' width={100} height={100} /> */}
          <NextImage className='position-obj
          ' style={{
            '--l': 132,
            '--t': -9,
            '--obj-w': 120,
            '--obj-h': 168,
          }} src='/images/map-move-obj1.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj z-50
          ' style={{
            '--l': 260,
            '--t': 268,
            '--obj-w': 96,
            '--obj-h': 113,
          }} src='/images/map-flag.png' alt='ton' width={100} height={100} />
        </div>

        {/* btc */}
        <div className='position-island z-10 grayscale
        ' style={{
          '--l': 1528,
          '--t': 316,
          '--w': 1019,
          '--h': 579,
          background: 'url(/images/map-btc-dao.png) no-repeat center center / 100% 100%',
        }}>
          <NextImage className='position-obj
          ' style={{
            '--l': 605,
            '--t': -56,
            '--obj-w': 73,
            '--obj-h': 88,
          }} src='/images/map-btc-logo.png' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 669,
            '--t': 158,
            '--obj-w': 149,
            '--obj-h': 237,
          }} src='/images/map-btc-obj1.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 436,
            '--t': 158,
            '--obj-w': 82,
            '--obj-h': 115,
          }} src='/images/map-btc-obj2.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 472,
            '--t': 243,
            '--obj-w': 135,
            '--obj-h': 121,
          }} src='/images/map-btc-obj3.gif' alt='ton' width={100} height={100} />
        </div>

        {/* solana */}
        <div className='position-island z-40 grayscale
        ' style={{
          '--l': 1846,
          '--t': 809,
          '--w': 712,
          '--h': 581,
          background: 'url(/images/map-solana-dao.png) no-repeat center center / 100% 100%',
        }}>
          <NextImage className='position-obj
          ' style={{
            '--l': 240,
            '--t': -20,
            '--obj-w': 93,
            '--obj-h': 74,
          }} src='/images/map-solana-logo.png' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 116,
            '--t': 51,
            '--obj-w': 123,
            '--obj-h': 182,
          }} src='/images/map-solana-obj1.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 436,
            '--t': 142,
            '--obj-w': 143,
            '--obj-h': 161,
          }} src='/images/map-solana-obj2.gif' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 246,
            '--t': 277,
            '--obj-w': 163,
            '--obj-h': 112,
          }} src='/images/map-solana-obj3.gif' alt='ton' width={100} height={100} />
        </div>

        {/* ton */}
        <div className='position-island z-40 grayscale
        ' style={{
          '--l': 1466,
          '--t': 1036,
          '--w': 304,
          '--h': 253,
          background: 'url(/images/map-ton-dao.png) no-repeat center center / 100% 100%',
        }}>
          <NextImage className='position-obj
          ' style={{
            '--l': 226,
            '--t': 6,
            '--obj-w': 95,
            '--obj-h': 87,
          }} src='/images/map-ton-logo.png' alt='ton' width={100} height={100} />
          <NextImage className='position-obj
          ' style={{
            '--l': 8,
            '--t': 35,
            '--obj-w': 164,
            '--obj-h': 130,
          }} src='/images/map-ton-obj1.gif' alt='ton' width={100} height={100} />
        </div>

        {/* no */}
        <div className='position-island z-40 grayscale
        ' style={{
          '--l': 808,
          '--t': 945,
          '--w': 862,
          '--h': 390,
          background: 'url(/images/map-no-dao.png) no-repeat center center / 100% 100%',
        }}>

        </div>

        {/* cloud */}
        <NextImage className='position-cloud1 z-50 pointer-events-none
        ' style={{
          '--l': 0,
          '--t': 0,
          '--w': 2072,
          '--h': 838,
        }} src='/images/map-cloud1.png' alt='ton' width={100} height={100} />
        <NextImage className='position-cloud2 z-50 pointer-events-none
        ' style={{
          '--r': 0,
          '--t': 0,
          '--w': 2264,
          '--h': 961,
        }} src='/images/map-cloud2.png' alt='ton' width={100} height={100} />
        <NextImage className='position-cloud3 z-50 pointer-events-none
        ' style={{
          '--l': 0,
          '--b': -0,
          '--w': 2072,
          '--h': 838,
        }} src='/images/map-cloud3.png' alt='ton' width={100} height={100} />

        {/* bird */}
        <NextImage className='position-bird pointer-events-none
        ' style={{
          '--l': -600,
          '--t': -600,
          '--w': 373,
          '--h': 280,
        }} src='/images/map-bird1.gif' alt='ton' width={100} height={100} />
        <NextImage className='position-bird pointer-events-none
        ' style={{
          '--l': -600,
          '--t': -600,
          '--w': 384,
          '--h': 319,
        }} src='/images/map-bird2.gif' alt='ton' width={100} height={100} />
        <NextImage className='position-bird pointer-events-none
        ' style={{
          '--l': -600,
          '--t': -600,
          '--w': 560,
          '--h': 462,
        }} src='/images/map-bird3.gif' alt='ton' width={100} height={100} />

        {/* 船 */}
        <div className='position-sail2 z-30' style={{
          '--l': 420,
          '--t': 930,
          '--w': 280,
        }}
        onClick={handleClickSail}
        >
          <NextImage className={cn('w-full h-auto',
            step === 0 && 'sail-glow-effect cursor-pointer',
          )}
            src='/images/map-sail2.gif' alt='ton' width={100} height={100}
          />

          {/* 点击提示 */}
          {step === 0 && (
            <div className='sail-tooltip cursor-pointer absolute left-1/2 z-40
              -top-8
              md:-top-8
            '>
              <div className='tooltip-bubble text-black rounded-full  font-bold shadow-lg border-2 border-yellow-300
                px-2 py-1 text-[10px]
                md:px-3 md:py-1.5 md:text-xs
                lg:px-4 lg:py-2 lg:text-sm
              '>
                Click to explore
              </div>
              <div className='tooltip-arrow absolute left-1/2 -translate-x-1/2 top-full'>
                <div className='w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-400'></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* title */}
      <div className='text-white font-inter absolute top-10 left-10 z-50 pointer-events-none'>
          <h1 id="title-h1" className='font-extrabold !leading-1.2
            text-[30px]
            md:text-[40px]
            lg:text-[50px]
            xl:text-[68px]
            2xl:text-[78px]
          '>
            PicWe Omnichain Treasure Map
          </h1>
          <h2 id="title-h2" className='font-medium !leading-1.2
            text-sm
            md:text-base
            lg:text-lg
            xl:text-xl
            2xl:text-2xl
          '>
            Isolated blockchains like scattered islands, await connection. With each step
            <br />
            the One Piece Campaign uncovers the missing pieces, bridging gaps and uniting chains
          </h2>

        </div>
    </div>

    <Dialog lang={lang} dialogVisible={dialogVisible} setDialogVisible={setDialogVisible} />
  </>
}
