'use client'
import React from 'react'

import { HeapGraph } from '@/components/charts/heap-graph'
import { CPUGraph } from '@/components/charts/cpu-chart'
import { uiState } from '@/components/state/ui-state'
import { ChartPref } from '@/components/charts/chart-pref'
import { graphPrefsState } from '@/components/state/pref-state'

export const AllGraphs: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full gap-2">
      <ChartPref graphPrefProxy={graphPrefsState.inuseSpace} />
      <div
        className="flex flex-col gap-10 h-full w-full overflow-clip"
        role="presentation"
        onClick={() => {
          uiState.freezeTooltip = false
          window.document.querySelectorAll('.tooltip').forEach(el => {
            el.parentNode?.childNodes.forEach(c => c.remove())
          })
        }}
      >
        <CPUGraph />
        <HeapGraph />
      </div>
    </div>
  )
}
