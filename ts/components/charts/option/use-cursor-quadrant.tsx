'use client'
import { useSnapshot } from 'valtio/react'

import { uiState } from '@/components/state/ui-state'

export enum CursorQuadrant {
  First,
  Second,
  Third,
  Fourth,
}

export const useCursorQuadrant = (): CursorQuadrant => {
  const { cursorPos } = useSnapshot(uiState)
  return getCursorQuadrant(cursorPos.x, cursorPos.y)
}

const getCursorQuadrant = (x: number, y: number): CursorQuadrant => {
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
