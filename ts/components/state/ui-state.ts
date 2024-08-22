'use client'
import { proxy } from 'valtio'

type UI = {
  hoveringDate?: Date
  cursorPos: { x: number; y: number }
}

const newUI = (): UI => ({
  cursorPos: { x: 0, y: 0 },
})

export const uiState = proxy<UI>(newUI())

export enum CursorQuadrant {
  First,
  Second,
  Third,
  Fourth,
}

export const getCursorQuadrant = (x: number, y: number): CursorQuadrant => {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2

  if (x >= cx && y <= cy) {
    return CursorQuadrant.First
  } else if (x < cx && y <= cy) {
    return CursorQuadrant.Second
  } else if (x < cx && y > cy) {
    return CursorQuadrant.Third
  } else {
    return CursorQuadrant.Fourth
  }
}
