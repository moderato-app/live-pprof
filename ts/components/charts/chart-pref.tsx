'use client'
import { Checkbox } from '@nextui-org/checkbox'
import React from 'react'
import { useSnapshot } from 'valtio/react'
import clsx from 'clsx'

import { dispatchGraphPrefProxy } from '@/components/state/pref-state'
import { PprofType } from '@/components/charts/option/use-graph-data'

export type ChartPrefProps = {
  pprofType: PprofType
  className?: string
}

export const ChartPref: React.FC<ChartPrefProps> = ({ pprofType, className }) => {
  const { total } = useSnapshot(dispatchGraphPrefProxy(pprofType))
  const setTotal = (total: boolean) => {
    dispatchGraphPrefProxy(pprofType).total = total
  }

  return (
    <div className={clsx('flex gap-1', className)}>
      {/*<FlatCumTabs graphPrefProxy={graphPrefProxy} />*/}
      <Checkbox isSelected={total} size="sm" value="Total" onValueChange={setTotal}>
        Total
      </Checkbox>
    </div>
  )
}
