'use client'
import { Checkbox } from '@nextui-org/checkbox'
import React from 'react'
import { useSnapshot } from 'valtio/react'

import { dispatchGraphPrefProxy } from '@/components/state/pref-state'
import { PprofType } from '@/components/charts/option/use-graph-data'

export type ChartPrefProps = {
  pprofType: PprofType
}

export const ChartPref: React.FC<ChartPrefProps> = ({ pprofType }) => {
  const { total } = useSnapshot(dispatchGraphPrefProxy(pprofType))
  const setTotal = (total: boolean) => {
    dispatchGraphPrefProxy(pprofType).total = total
  }

  return (
    <div className={'flex gap-1'}>
      {/*<FlatCumTabs graphPrefProxy={graphPrefProxy} />*/}
      <Checkbox isSelected={total} size="sm" value="Total" onValueChange={setTotal}>
        Total
      </Checkbox>
    </div>
  )
}
