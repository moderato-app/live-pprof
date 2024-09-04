'use client'

import { useSnapshot } from 'valtio/react'
import { useMemo } from 'react'
import { useIsSSR } from '@react-aria/ssr'

import { GeneralClient, MetricsClient, MockMetricsClient } from '@/components/api/ApiServiceClientPb'
import { graphPrefsState } from '@/components/state/pref-state'
import { useIsDev } from '@/components/hooks/use-is-dev'

const blackHole = 'http://240.0.0.0:8300'

export const useBackendURL = (): string => {
  const isDev = useIsDev()
  const isSSR = useIsSSR()
  if (isSSR) {
    // black hole
    return blackHole
  }

  if (isDev) {
    return process.env.NEXT_PUBLIC_BACKEND_URL!
  } else {
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
  }
}

export const useMetricsClient = (): MetricsClient => {
  const { mock } = useSnapshot(graphPrefsState)
  const url = useBackendURL()
  return useMemo(() => (mock ? new MockMetricsClient(url) : new MetricsClient(url)), [mock, url])
}

export const useGeneralClient = (): GeneralClient => {
  const url = useBackendURL()
  return useMemo(() => new GeneralClient(url), [url])
}
