'use client'
import { proxy, subscribe } from 'valtio'

const graphsPrefsLSKey = 'graph prefs v13'

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
  memory: GraphPref
  cpu: GraphPref

  smooth: boolean
  mock: boolean
}

const newGraphPrefs = (): GraphPrefs => ({
  memory: newGraphPref(),
  cpu: newGraphPref(),
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
