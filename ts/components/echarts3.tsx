'use client'
import React, { useEffect } from 'react'

import { abcd } from '@/components/e3'

export const MyEcharts3: React.FC = () => {
  useEffect(() => {
    setTimeout(abcd, 1000)
  }, [])

  return <div className="w-full h-[400px]" id={'xxx'} />
}
