import { useSnapshot } from 'valtio/react'
import { useMemo } from 'react'

import { GeneralClient, MetricsClient, MockMetricsClient } from '@/components/api/ApiServiceClientPb'
import { graphPrefsState } from '@/components/state/pref-state'

export const useMetricsClient = (): MetricsClient => {
  const { mock } = useSnapshot(graphPrefsState)

  return useMemo(
    () => (mock ? new MockMetricsClient('http://localhost:8080') : new MetricsClient('http://localhost:8080')),
    [mock]
  )
}

export const useGeneralClient = (): GeneralClient => {
  return useMemo(() => new GeneralClient('http://localhost:8080'), [])
}
