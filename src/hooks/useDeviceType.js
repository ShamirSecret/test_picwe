import { useState, useEffect } from 'react'

const useDeviceType = (handleResize = null) => {
  const [deviceType, setDeviceType] = useState(null)
  const [deviceIsPc, setDeviceIsPc] = useState(true)
  const [deviceIsMobile, setDeviceIsMobile] = useState(true)

  const _handleResize = () => {
    const val = window.innerWidth >= 768
    setDeviceType(val ? 'desktop' : 'mobile')
    setDeviceIsPc(val)
    setDeviceIsMobile(!val)

    handleResize?.()
  }

  useEffect(() => {
    _handleResize()
    window.addEventListener('resize', _handleResize)

    return () => {
      window.removeEventListener('resize', _handleResize)
    }
  }, [])

  return {
    deviceType,
    deviceIsPc,
    deviceIsMobile,
  }
}

export default useDeviceType
