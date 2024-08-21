'use client'
import { proxy } from 'valtio'

type UI = {
  freezeTooltip: boolean
  hoveringDate?: Date
  cursorPos: { x: number; y: number }
}

const newUI = (): UI => ({
  freezeTooltip: false,
  cursorPos: { x: 0, y: 0 },
})

export const uiState = proxy<UI>(newUI())
