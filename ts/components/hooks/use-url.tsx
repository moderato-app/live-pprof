'use client'

import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio/react'

import { graphPrefsState } from '@/components/state/pref-state'
import getUrls from 'get-urls'

export const useURL = (): string | Error => {
  const { inputURL } = useSnapshot(graphPrefsState)
  const [url, setUrl] = useState<string | Error>(Error('Initial'))

  useEffect(() => {
    let gen = generateUrl(inputURL)
    setUrl(gen)
  }, [inputURL, setUrl])

  return url
}

const generateUrl = (input: string): string | Error => {
  const port = Number(input)
  if (Number.isInteger(port)) {
    if (port >= 1 && port <= 65535) {
      return `http://localhost:${port}/debug/pprof`
    } else {
      return new Error(`Port ${port} is out of range: [1, 65535]`)
    }
  } else {
    const next = getUrls(input).values().next()
    if (!next.done) {
      return next.value
    }

    return new Error('Invalid URL')
  }
}
