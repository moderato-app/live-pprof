'use client'
import React from 'react'
import { registerTheme } from 'echarts'
import { useIsSSR } from '@react-aria/ssr'

import { ChartPref } from '@/components/charts/chart-pref'
import darkTheme from '@/components/charts/dark-theme'
import { PprofType } from '@/components/charts/option/use-graph-data'
import { PprofGraph } from '@/components/charts/pprof-chart'
import { useWindowListener } from '@/components/window-listener'

registerTheme('dark', darkTheme())

export const AllGraphs: React.FC = () => {
  useWindowListener()

  if (useIsSSR()) {
    return null
  }

  return (
    <div className="flex flex-row flex-wrap justify-between h-full w-full pb-2 overflow-clip">
      <div className="flex flex-col basis-[49%] h-[49%] relative">
        <ChartPref className="absolute top-2.5 left-20 z-10" pprofType={PprofType.cpu} />
        <PprofGraph pprofType={PprofType.cpu} />
      </div>
      <div className="flex flex-col basis-[49%] h-[49%] relative ">
        <ChartPref className="absolute top-2.5 left-20 z-10" pprofType={PprofType.heap} />
        <PprofGraph pprofType={PprofType.heap} />
      </div>
      <div className="flex flex-col basis-[49%] h-[49%] relative">
        <ChartPref className="absolute top-2.5 left-20 z-10" pprofType={PprofType.allocs} />
        <PprofGraph pprofType={PprofType.allocs} />
      </div>
      <div className="flex flex-col basis-[49%] h-[49%] relative ">
        <ChartPref className="absolute top-2.5 left-32 z-10" pprofType={PprofType.goroutine} />
        <PprofGraph pprofType={PprofType.goroutine} />
      </div>
    </div>
  )
}
