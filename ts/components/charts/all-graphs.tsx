'use client'
import React from 'react'
import { registerTheme } from 'echarts'

import { HeapGraph } from '@/components/charts/heap-graph'
import { ChartPref } from '@/components/charts/chart-pref'
import { graphPrefsState } from '@/components/state/pref-state'
import darkTheme from '@/components/charts/dark-theme'
import { CPUGraph } from '@/components/charts/cpu-chart'

registerTheme('dark', darkTheme())

export const AllGraphs: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full overflow-clip">
      <ChartPref graphPrefProxy={graphPrefsState.cpu} />
      <CPUGraph />
      <div className="h-10" />
      <ChartPref graphPrefProxy={graphPrefsState.memory} />
      <HeapGraph />
    </div>
  )
}
