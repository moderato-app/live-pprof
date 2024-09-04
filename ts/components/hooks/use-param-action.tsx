'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { generateUrl, useURL } from '@/components/hooks/use-url'
import { recorderState } from '@/components/state/recorder-state'

// useParamAction parses url params and converts them into actions.
// These parameters are added to the URL when the backend opens it in the browser.
export const useParamAction = (): void => {
  const sp = useSearchParams()
  const router = useRouter()
  const { setInput } = useURL()

  const pprofURL = sp.get('pprof-url')

  useEffect(() => {
    router.push(window.location.pathname)
    let t: NodeJS.Timeout
    if (pprofURL) {
      console.info('param: pprof-url', pprofURL)
      setInput(pprofURL)
      if (typeof generateUrl(pprofURL) === 'string') {
        // it's a valid url
        t = setTimeout(() => {
          console.info('start recording')
          recorderState.isRecording = true
        })
      }
    }
    return () => clearTimeout(t)
  }, [router, setInput])
}
