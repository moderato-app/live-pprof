import { MetricsClient, MockMetricsClient } from '@/components/api/ApiServiceClientPb'

export const metricClient = new MetricsClient('http://localhost:8080')
export const mockMetricClient = new MockMetricsClient('http://localhost:8080')
