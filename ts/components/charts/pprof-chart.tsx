'use client'
import React, { FC } from 'react'

import { PprofType } from '@/components/hooks/use-graph-data'
import { BasicGraph } from '@/components/charts/basic-graph'
import { usePprofOption } from '@/components/hooks/use-pprof-option'

type PprofGraphProps = {
  pprofType: PprofType
  className?: string
}

export const PprofGraph: FC<PprofGraphProps> = ({ pprofType, className }) => {
  let [option, refreshKey] = usePprofOption({ pprofType: pprofType })

  return <BasicGraph className={className} option={option} refreshKey={refreshKey} />
}
