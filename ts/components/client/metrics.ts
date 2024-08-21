import { useSnapshot } from 'valtio/react'

import { MetricsClient, MockMetricsClient } from '@/components/api/ApiServiceClientPb'
import { graphPrefsState } from '@/components/state/pref-state'

export const metricClient = new MetricsClient('http://localhost:8080')
export const mockMetricClient = new MockMetricsClient('http://localhost:8080')

export const useMetricsClient = (): MetricsClient => {
  const { mock } = useSnapshot(graphPrefsState)

  return mock ? mockMetricClient : metricClient
}
