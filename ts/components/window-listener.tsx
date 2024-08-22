'use client'
import { useEffect } from 'react'
import { useIsSSR } from '@react-aria/ssr'

import { uiState } from '@/components/state/ui-state'

export const useWindowListener = () => {
  if (useIsSSR()) {
    return null
  }

  const handleMouseMove = (event: MouseEvent) => {
    uiState.cursorPos = {
      x: event.clientX,
      y: event.clientY,
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return null
}
