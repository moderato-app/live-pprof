'use client'

import { useEffect, useState } from 'react'

export const useIsDev = (): boolean => {
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development')
  }, [])

  return isDev
}
