'use client'
import { proxy } from 'valtio'

type UI = {
  freezeTooltip: boolean
  hoveringDate?: Date
}

const newUI = (): UI => ({
  freezeTooltip: false,
})

export const uiState = proxy<UI>(newUI())
