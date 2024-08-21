import { Checkbox } from '@nextui-org/checkbox'
import React from 'react'
import { useSnapshot } from 'valtio/react'

import { GraphPref } from '@/components/state/pref-state'

export type ChartPrefProps = {
  graphPrefProxy: GraphPref
}

export const ChartPref: React.FC<ChartPrefProps> = ({ graphPrefProxy }) => {
  const { total } = useSnapshot(graphPrefProxy)
  const setTotal = (total: boolean) => {
    graphPrefProxy.total = total
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
