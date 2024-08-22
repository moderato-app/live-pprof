'use client'
import { useCallback } from 'react'
import { useSnapshot } from 'valtio/react'

import { PprofType } from '@/components/hooks/use-graph-data'
import {
  dispatchGraphPrefDescription,
  dispatchGraphPrefIconName,
  dispatchGraphPrefLeftOffsetLarge,
  dispatchGraphPrefProxy,
  GraphPref,
} from '@/components/state/pref-state'

export const useGraphPrefSnap: (pprofType: PprofType) => {
  prefSnap: GraphPref
  toggleEnabled: () => void
  iconName: string
  description: string
  pprofType: PprofType
  leftOffsetLarge: boolean
} = (pprofType: PprofType) => {
  const proxy = dispatchGraphPrefProxy(pprofType)
  const snap = useSnapshot(proxy)

  const toggleEnabled = useCallback(() => {
    proxy.enabled = !proxy.enabled
  }, [])

  const iconName = dispatchGraphPrefIconName(pprofType)
  const description = dispatchGraphPrefDescription(pprofType)
  const leftOffsetLarge = dispatchGraphPrefLeftOffsetLarge(pprofType)
  return {
    prefSnap: snap,
    toggleEnabled: toggleEnabled,
    iconName: iconName,
    description: description,
    pprofType: pprofType,
    leftOffsetLarge: leftOffsetLarge,
  }
}
