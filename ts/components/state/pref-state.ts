'use client'
import { proxy, subscribe } from 'valtio'

const graphsPrefsLSKey = 'graph prefs v3'

export type GraphPref = {
  total: boolean
  line: boolean
  smooth: boolean
}

const newGraphPref = (): GraphPref => ({
  total: false,
  line: false,
  smooth: false,
})

export type GraphPrefs = {
  inuseSpace: GraphPref
}

const newGraphPrefs = (): GraphPrefs => ({
  inuseSpace: newGraphPref(),
})

const IS_CLIENT = typeof window !== 'undefined'

export const graphPrefsState = proxy<GraphPrefs>(
  IS_CLIENT ? JSON.parse(localStorage.getItem(graphsPrefsLSKey) as string) || newGraphPrefs() : newGraphPrefs()
)

subscribe(graphPrefsState, () => {
  IS_CLIENT && localStorage.setItem(graphsPrefsLSKey, JSON.stringify(graphPrefsState))
})
