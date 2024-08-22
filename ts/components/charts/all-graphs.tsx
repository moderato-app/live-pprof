'use client'
import React, { useEffect } from 'react'
import { registerTheme } from 'echarts'
import { useIsSSR } from '@react-aria/ssr'

import { ChartPref } from '@/components/charts/chart-pref'
import darkTheme from '@/components/charts/dark-theme'
import { PprofType } from '@/components/hooks/use-graph-data'
import { PprofGraph } from '@/components/charts/pprof-chart'
import { useWindowListener } from '@/components/window-listener'
import { useGraphPrefSnap } from '@/components/hooks/use-graph-pref-snap'

export const AllGraphs: React.FC = () => {
  const ssr = useIsSSR()
  useWindowListener()
  const [cpu, heap, allocs, goroutine] = [
    useGraphPrefSnap(PprofType.cpu),
    useGraphPrefSnap(PprofType.heap),
    useGraphPrefSnap(PprofType.allocs),
    useGraphPrefSnap(PprofType.goroutine),
  ]

  useEffect(() => {
    if (ssr) return
    registerTheme('dark', darkTheme())
  }, [ssr])

  return (
    <div className="flex flex-row flex-wrap justify-between h-full w-full pb-2 overflow-clip">
      {[cpu, heap, allocs, goroutine]
        .filter(snap => snap.prefSnap.enabled)
        .map(snap => (
          <div key={snap.pprofType} className="flex flex-col basis-[49%] h-[49%] relative">
            <ChartPref
              className={`absolute top-2.5 z-10 ${snap.leftOffsetLarge ? 'left-32' : 'left-20'}`}
              pprofType={snap.pprofType}
            />
            <PprofGraph pprofType={snap.pprofType} />
          </div>
        ))}
    </div>
  )
}
