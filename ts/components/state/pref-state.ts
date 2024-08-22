'use client'
import { proxy, subscribe } from 'valtio'

import { PprofType } from '@/components/hooks/use-graph-data'

const graphsPrefsLSKey = 'graph prefs v19'

export enum FlatOrCum {
  flat = 'flat',
  cum = 'cum',
}

export type GraphPref = {
  total: boolean
  flatOrCum: FlatOrCum
  enabled: boolean
}

const newGraphPref = (): GraphPref => ({
  total: false,
  flatOrCum: FlatOrCum.flat,
  enabled: true,
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

export const dispatchGraphPrefIconName = (pt: PprofType): string => {
  switch (pt) {
    case PprofType.cpu:
      // noinspection SpellCheckingInspection
      return 'majesticons:cpu-line'
    case PprofType.heap:
      return 'fa-solid:memory'
    case PprofType.allocs:
      return 'fluent-emoji-high-contrast:new-button'
    case PprofType.goroutine:
      // noinspection SpellCheckingInspection
      return 'nonicons:go-16'
  }
}

export const dispatchGraphPrefDescription = (pt: PprofType): string => {
  switch (pt) {
    case PprofType.cpu:
      return 'cpu samples: /debug/pprof/profile?seconds=N'
    case PprofType.heap:
      return 'inuse_space: /debug/pprof/heap'
    case PprofType.allocs:
      return 'alloc_space: /debug/pprof/allocs'
    case PprofType.goroutine:
      return 'goroutine: /debug/pprof/goroutine'
  }
}

export const dispatchGraphPrefLeftOffsetLarge = (pt: PprofType): boolean => {
  switch (pt) {
    case PprofType.cpu:
    case PprofType.heap:
    case PprofType.allocs:
      return false
    case PprofType.goroutine:
      return true
  }
}
