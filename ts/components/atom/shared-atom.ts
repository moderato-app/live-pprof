import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useState } from 'react'

export const freezeTooltipAtom = atom(false)
export const showTooltipAtom = atom(true)

export const inuseSpacePrefAtom = atomWithStorage('inuseSpacePref', {
  total: false,
  line: false,
  smooth: false,
})
