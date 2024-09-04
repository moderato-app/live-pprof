'use client'

import { useLayoutEffect, useState } from 'react'

export const useIsDev = (): boolean => {
  const [isDev, setIsDev] = useState(false)

  useLayoutEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development')
  }, [])

  return isDev
}
