'use client'
import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import ReactECharts from 'echarts-for-react'
import { EChartsType } from 'echarts'
import { EChartsOption } from 'echarts-for-react/src/types'
import clsx from 'clsx'

type BasicGraphProps = {
  option: EChartsOption
  refreshKey?: string
  className?: string
}

export const BasicGraph: React.FC<BasicGraphProps> = ({ option, refreshKey, className }) => {
  const theme = useTheme()
  const ref = useRef<any>()

  useEffect(() => {
    const chart = ref.current?.getEchartsInstance() as EChartsType
    if (chart) {
      chart.getZr().on('click', (params: any) => {})
      chart.getZr().on('dblclick', (params: any) => {})
    }
  }, [ref])

  return (
    <ReactECharts
      key={refreshKey}
      ref={ref}
      className={clsx('p-1 border-2 border-dotted border-default-400 rounded-xl', className)}
      option={option}
      style={{ height: '100%', width: '100%' }}
      theme={theme.resolvedTheme == 'dark' ? 'dark' : ''}
    />
  )
}
