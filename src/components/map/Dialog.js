'use client'
import NextImage from 'next/image'
import { useState } from 'react'
import { cn } from '@/utils'

export default function Dialog ({
  lang,
  dialogVisible,
  setDialogVisible,
}) {
  return <div className={cn('fixed top-0 left-0 w-full h-full dialog-bg flex flex-col items-center justify-center transition-all duration-300',
    dialogVisible ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none -z-50',
  )}>
    <div className="aspect-[1160/730] relative
      w-[80%]
      md:w-[600px]
      lg:w-[700px]
      xl:w-[800px]
      2xl:w-[1000px]
    "
      style={{
        '--w': 1160,
        '--h': 730,
        background: 'url(/images/map-dialog-content.png) no-repeat center center / contain',
      }}
    >
      <NextImage className='position-obj cursor-pointer
        transition-all duration-200
        hover:scale-105
        ' style={{
        '--l': 1033,
        '--t': 35,
        '--obj-w': 69,
      }} src='/images/map-dialog-close.png' alt='ton' width={100} height={100}
        onClick={() => setDialogVisible(false)}
      />
      <NextImage className='position-obj
        ' style={{
        '--l': 1018,
        '--t': 386,
        '--obj-w': 306,
      }} src='/images/map-dialog-obj.png' alt='ton' width={100} height={100} />
      <a href={`/${lang}/bridge`} target='_self'>
        <NextImage className='position-obj cursor-pointer
          transition-all duration-200
          hover:scale-105
          ' style={{
          '--l': 444,
          '--t': 745,
          '--obj-w': 272,
        }} src='/images/map-dialog-button.png' alt='ton' width={100} height={100}/>
      </a>
    </div>
  </div>
}
