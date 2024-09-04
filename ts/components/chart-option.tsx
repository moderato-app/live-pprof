'use client'
import { Checkbox } from '@nextui-org/checkbox'
import { Select, SelectItem } from '@nextui-org/select'
import React from 'react'
import { useSnapshot } from 'valtio/react'
import clsx from 'clsx'
import { Tooltip } from '@nextui-org/tooltip'
import { useIsSSR } from '@react-aria/ssr'
import { Divider } from '@nextui-org/divider'

import { dispatchGraphPrefProxy } from '@/components/state/pref-state'
import { PprofType } from '@/components/hooks/use-graph-data'

export type ChartPrefProps = {
  pprofType: PprofType
  className?: string
}

type topNOpt = {
  key: string
  num: number
}

const topNOptions: topNOpt[] = [
  { key: '5', num: 5 },
  { key: '10', num: 10 },
  { key: '20', num: 20 },
  {
    key: '50',
    num: 50,
  },
  { key: '100', num: 100 },
  { key: '999', num: 999 },
]

export const ChartOption: React.FC<ChartPrefProps> = ({ pprofType, className }) => {
  const { total, topN } = useSnapshot(dispatchGraphPrefProxy(pprofType))

  if (useIsSSR()) {
    return null
  }

  const setTotal = (total: boolean) => {
    dispatchGraphPrefProxy(pprofType).total = total
  }
  const setTopN = (t: number) => {
    dispatchGraphPrefProxy(pprofType).topN = t
  }

  return (
    <div className={clsx('flex gap-3 items-center', className)}>
      <Checkbox className="" isSelected={total} size="sm" value="Total" onValueChange={setTotal}>
        Total
      </Checkbox>
      <Divider className="h-4 bg-default-300" orientation={'vertical'} />
      <Tooltip
        className="bg-default-200"
        closeDelay={0}
        content={`Keep only the top N values at any time`}
        delay={500}
        placement={'right-start'}
      >
        <Select
          className="w-28 items-center"
          classNames={{
            trigger: 'min-h-0 h-6',
          }}
          defaultSelectedKeys={[`20`]}
          items={topNOptions}
          label={<p className="text-nowrap text-sm font-light text-foreground">Top</p>}
          labelPlacement={'outside-left'}
          selectedKeys={[`${topN}`]}
          selectionMode="single"
          size={'sm'}
          onSelectionChange={keys => {
            if (keys.anchorKey) {
              if (!isNaN(Number(keys.anchorKey))) {
                setTopN(Number(keys.anchorKey))
              }
            }
          }}
        >
          {opt => (
            <SelectItem key={opt.key} textValue={`${opt.num}`}>
              {opt.num}
            </SelectItem>
          )}
        </Select>
      </Tooltip>
    </div>
  )
}
