'use client'
import { proxy, subscribe } from 'valtio'

const graphsPrefsLSKey = 'graph prefs v11'

export type GraphPref = {
  total: boolean
}

const newGraphPref = (): GraphPref => ({
  total: false,
})

export type GraphPrefs = {
  memory: GraphPref
  cpu: GraphPref
  smooth: boolean
}

const newGraphPrefs = (): GraphPrefs => ({
  memory: newGraphPref(),
  cpu: newGraphPref(),
  smooth: false,
})

const IS_CLIENT = typeof window !== 'undefined'

export const graphPrefsState = proxy<GraphPrefs>(
  IS_CLIENT ? JSON.parse(localStorage.getItem(graphsPrefsLSKey) as string) || newGraphPrefs() : newGraphPrefs()
)

subscribe(graphPrefsState, () => {
  IS_CLIENT && localStorage.setItem(graphsPrefsLSKey, JSON.stringify(graphPrefsState))
})
