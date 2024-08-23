'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSnapshot } from 'valtio/react'
import getUrls from 'get-urls'

import { graphPrefsState } from '@/components/state/pref-state'

export const useURL = (): { url: string | Error; input: string; setInput: (input: string) => void } => {
  const { inputURL } = useSnapshot(graphPrefsState)
  const [url, setUrl] = useState<string | Error>(Error('Initial'))
  const setInput = useCallback((input: string) => {
    graphPrefsState.inputURL = input
  }, [])
  useEffect(() => {
    let gen = generateUrl(inputURL)
    setUrl(gen)
  }, [inputURL, setUrl])

  return { url: url, input: inputURL, setInput: setInput }
}

const generateUrl = (input: string): string | Error => {
  const port = Number(input)
  if (input === '') {
    return new Error('Please input the URL of pprof endpoint')
  } else if (Number.isInteger(port)) {
    if (port >= 1 && port <= 65535) {
      return `http://localhost:${port}/debug/pprof`
    } else {
      return new Error(`Port ${port} is out of range: [1, 65535]`)
    }
  } else {
    const urls = getUrls(input)
    const next = urls.values().next()
    if (!next.done) {
      let v = next.value
      // workaround for getUrls as it may return an URL without the scheme prefix
      // noinspection HttpUrlsUsage
      if (!v.startsWith('http://') && !v.startsWith('https://')) {
        // noinspection HttpUrlsUsage
        v = `http://${v}`
      }
      return v
    }

    return new Error('Invalid URL')
  }
}
