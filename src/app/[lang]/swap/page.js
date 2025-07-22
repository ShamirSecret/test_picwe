'use client'

import '@/styles/swap.scss'
import dynamic from 'next/dynamic'

// 动态导入组件，禁用 SSR
const Index = dynamic(() => import('@/components/swap3/Index'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-96">Loading...</div>
})

export default function Swap() {
  return <Index />
}
