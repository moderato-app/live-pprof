'use client'
import { proxy } from 'valtio'

type UI = {
  freezeTooltip: boolean
}

const newUI = (): UI => ({
  freezeTooltip: false,
})

export const uiState = proxy<UI>(newUI())
