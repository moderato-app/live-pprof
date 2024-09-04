'use client'
import { useEffect, useState } from 'react'
import grpcWeb from 'grpc-web'
import { useSnapshot } from 'valtio/react'
import dayjs from 'dayjs'
import { defer } from 'lodash'

import { GraphData, newGraphData } from '@/components/charts/data-structure'
import { useMetricsClient } from '@/components/client/metrics'
import * as api_pb from '@/components/api/api_pb'
import { GoMetricsRequest, GoMetricsResponse } from '@/components/api/api_pb'
import { appendGraphData } from '@/components/charts/data-operation'
import { recorderState, resetRecorder } from '@/components/state/recorder-state'
import { myEmitter } from '@/components/state/emitter'
import { useURL } from '@/components/hooks/use-url'
import { graphPrefsState } from '@/components/state/pref-state'

export enum PprofType {
  cpu = 'CPU',
  heap = 'Heap',
  allocs = 'Allocs',
  goroutine = 'Goroutine',
}

export type GraphDataProps = {
  pprofType: PprofType
}

export const useGraphData = ({ pprofType }: GraphDataProps): GraphData => {
  const [graphData, setGraphData] = useState<GraphData>(newGraphData())
  const client = useMetricsClient()
  const { url } = useURL()
  const { isRecording } = useSnapshot(recorderState)
  const { retainedSamples, sampleInterval } = useSnapshot(graphPrefsState)

  useEffect(() => {
    const clearData = () => {
      setGraphData(newGraphData())
      resetRecorder()
    }
    myEmitter.on('clearData', clearData)
    return () => myEmitter.on('clearData', clearData)
  }, [setGraphData])

  useEffect(() => {
    if (!isRecording) return
    if (typeof url !== 'string') {
      return
    }
    let u = url
    const streams: grpcWeb.ClientReadableStream<api_pb.GoMetricsResponse>[] = []
    const cbs: NodeJS.Timeout[] = []
    let t: NodeJS.Timeout
    let lastRequest = dayjs()

    const makeRequest = () => {
      const callback = (err: grpcWeb.RpcError, response: GoMetricsResponse) => {
        defer(() => {
          let waitForMs = sampleInterval
          // cpu request takes about 1 second to complete, so there is no need to wait for 1 second again,
          // but we need to wait if cpu request fails too fast
          if (pprofType === PprofType.cpu && dayjs().diff(lastRequest, 'millisecond') > sampleInterval) {
            waitForMs = 0
          }
          t = setTimeout(makeRequest, waitForMs)
          cbs.push(t)
        })

        // remove stream from the list
        const index = streams.indexOf(stream)
        if (index > -1) {
          streams.splice(index, 1)
        }

        if (err) {
          console.debug(`${pprofType} rpc err`, err)
        } else {
          console.debug(`${pprofType} rpc resp`, response)
          setGraphData(prevData => {
            return appendGraphData(prevData, response, retainedSamples)
          })
        }
      }

      let stream: grpcWeb.ClientReadableStream<api_pb.GoMetricsResponse>
      const meta = { deadline: dayjs().add(5, 'seconds').toDate().getTime().toString() }
      lastRequest = dayjs()
      const req = new GoMetricsRequest().setUrl(u)
      switch (pprofType) {
        case PprofType.cpu:
          stream = client.cPUMetrics(req, meta, callback)
          break
        case PprofType.heap:
          stream = client.heapMetrics(req, meta, callback)
          break
        case PprofType.allocs:
          stream = client.allocsMetrics(req, meta, callback)
          break
        case PprofType.goroutine:
          stream = client.goroutineMetrics(req, meta, callback)
          break
      }
      streams.push(stream)
      if (streams.length > 5) {
        console.warn('${metricsFunc} created too many concurrent streams. consider set a timeout for each stream')
      }
    }

    t = setTimeout(makeRequest, 0)

    return () => {
      clearTimeout(t)
      streams.forEach(p => p.cancel())
      cbs.forEach(t => clearTimeout(t))
    }
  }, [client, isRecording, url, sampleInterval, retainedSamples])

  return graphData
}
