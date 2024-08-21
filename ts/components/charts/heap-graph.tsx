'use client'
import React from 'react'

import { usePprofOption } from '@/components/charts/option/use-pprof-option'
import { PprofType } from '@/components/charts/option/use-graph-data'
import { BasicGraph } from '@/components/charts/basic-graph'

export const HeapGraph: React.FC = () => {
  let [option, refreshKey] = usePprofOption({ pprofType: PprofType.heap })

  return <BasicGraph option={option} refreshKey={refreshKey} />
}
