'use client'
import { useEffect } from 'react'
import { useIsSSR } from '@react-aria/ssr'

import { uiState } from '@/components/state/ui-state'

export const useWindowListener = () => {
  const ssr = useIsSSR()

  const handleMouseMove = (event: MouseEvent) => {
    uiState.cursorPos = {
      x: event.clientX,
      y: event.clientY,
    }
  }

  useEffect(() => {
    if (ssr) return
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [ssr])

  return null
}
