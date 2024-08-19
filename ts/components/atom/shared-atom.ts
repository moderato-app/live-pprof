import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const freezeTooltipAtom = atom(false)
export const showTooltipAtom = atom(true)

export type Pref = {
  total: boolean
  line: boolean
  smooth: boolean
  sliderRange: { xStart: number; xEnd: number; yStart: number; yEnd: number }
}

export const inuseSpacePrefAtom = atomWithStorage<Pref>('inuseSpacePref-v2', {
  total: false,
  line: false,
  smooth: false,
  sliderRange: { xStart: 0, xEnd: 100, yStart: 0, yEnd: 100 },
})
