'use client'
import React from 'react'
import { useSnapshot } from 'valtio/react'
import { Tab, Tabs } from '@nextui-org/tabs'

import { FlatOrCum, GraphPref } from '@/components/state/pref-state'

export type FlatCumTabsProps = {
  graphPrefProxy: GraphPref
}

export const FlatCumTabs: React.FC<FlatCumTabsProps> = ({ graphPrefProxy }) => {
  const { flatOrCum } = useSnapshot(graphPrefProxy)

  const select = (key: React.Key) => {
    graphPrefProxy.flatOrCum = key as FlatOrCum
  }

  return (
    <Tabs
      aria-label="Options"
      disabledKeys={[FlatOrCum.cum]}
      selectedKey={flatOrCum}
      size={'sm'}
      variant={'light'}
      onSelectionChange={select}
    >
      <Tab key={FlatOrCum.flat} title={FlatOrCum.flat.toUpperCase()} />
      <Tab key={FlatOrCum.cum} title={FlatOrCum.cum.toUpperCase()} />
    </Tabs>
  )
}
