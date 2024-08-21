'use client'
import React, { FC } from 'react'

import { PprofType } from '@/components/charts/option/use-graph-data'
import { BasicGraph } from '@/components/charts/basic-graph'
import { usePprofOption } from '@/components/charts/option/use-pprof-option'

type PprofGraphProps = {
  pprofType: PprofType
}

export const PprofGraph: FC<PprofGraphProps> = ({ pprofType }) => {
  let [option, refreshKey] = usePprofOption({ pprofType: pprofType })

  return <BasicGraph option={option} refreshKey={refreshKey} />
}
