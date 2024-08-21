'use client'
import { proxy, subscribe } from 'valtio'

import { PprofType } from '@/components/charts/option/use-graph-data'

const graphsPrefsLSKey = 'graph prefs v14'

export enum FlatOrCum {
  flat = 'flat',
  cum = 'cum',
}

export type GraphPref = {
  total: boolean
  flatOrCum: FlatOrCum
}

const newGraphPref = (): GraphPref => ({
  total: false,
  flatOrCum: FlatOrCum.flat,
})

export type GraphPrefs = {
  heap: GraphPref
  cpu: GraphPref
  allocs: GraphPref
  goroutine: GraphPref

  smooth: boolean
  mock: boolean
}

const newGraphPrefs = (): GraphPrefs => ({
  heap: newGraphPref(),
  cpu: newGraphPref(),
  allocs: newGraphPref(),
  goroutine: newGraphPref(),

  smooth: false,
  mock: false,
})

const IS_CLIENT = typeof window !== 'undefined'

export const graphPrefsState = proxy<GraphPrefs>(
  IS_CLIENT ? JSON.parse(localStorage.getItem(graphsPrefsLSKey) as string) || newGraphPrefs() : newGraphPrefs()
)

subscribe(graphPrefsState, () => {
  IS_CLIENT && localStorage.setItem(graphsPrefsLSKey, JSON.stringify(graphPrefsState))
})

export const dispatchGraphPrefProxy = (pt: PprofType): GraphPref => {
  switch (pt) {
    case PprofType.cpu:
      return graphPrefsState.cpu
    case PprofType.heap:
      return graphPrefsState.heap
    case PprofType.allocs:
      return graphPrefsState.allocs
    case PprofType.goroutine:
      return graphPrefsState.goroutine
  }
}
