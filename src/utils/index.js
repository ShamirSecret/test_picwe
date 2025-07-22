import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import config from '@/config'

export const classnames = (...classes) => {
  return twMerge(clsx(...classes))
}
export const cn = (...classes) => {
  return twMerge(clsx(...classes))
}

export const getImgUrl = (name) => {
  return config.imageUrl + name + '?tr:f-avif&t=1'
}

export const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve()
    }, time)
  })
}

export const copy = (data) => {
  return JSON.parse(JSON.stringify(data))
}

export const shortAddress = (address) => {
  return address ? `${address.substr(0, 5)}...${address.substr(-4)}` : ''
}

export const isPc = () => {
  return window.innerWidth >= 768
}
export const isMobile = () => {
  return window.innerWidth < 768
}

// This function generates a random string of a given length
export const getRandomString = length => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const throttle = (fn, interval = 300) => {
  let canRun = true
  return function () {
    if (!canRun) return
    canRun = false
    setTimeout(() => {
      fn.apply(this, arguments)
      canRun = true
    }, interval)
  }
}

export const debounce = (fn, interval = 300) => {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, interval)
  }
}
