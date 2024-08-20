import { Checkbox } from '@nextui-org/checkbox'
import React from 'react'
import { useSnapshot } from 'valtio/react'

import { GraphPref } from '@/components/state/pref-state'

export type ChartPrefProps = {
  graphPrefProxy: GraphPref
}

export const ChartPref: React.FC<ChartPrefProps> = ({ graphPrefProxy }) => {
  const { total, line, smooth } = useSnapshot(graphPrefProxy)
  const setTotal = (total: boolean) => {
    graphPrefProxy.total = total
  }
  const setSmooth = (smooth: boolean) => {
    graphPrefProxy.smooth = smooth
  }
  const setLine = (line: boolean) => {
    graphPrefProxy.line = line
  }

  return (
    <div className={'flex flex-col gap-1'}>
      <Checkbox isSelected={total} size="sm" value="Total" onValueChange={setTotal}>
        Total
      </Checkbox>
      <Checkbox className="whitespace-nowrap" isSelected={line} size="sm" value="Line" onValueChange={setLine}>
        Line of Code
      </Checkbox>
      <Checkbox isSelected={smooth} size="sm" value="Smooth" onValueChange={setSmooth}>
        Smooth
      </Checkbox>
    </div>
  )
}
