'use client'
import { useEffect, useState } from 'react'
import grpcWeb from 'grpc-web'
import { useSnapshot } from 'valtio/react'

import { GraphData, newGraphData } from '@/components/charts/data-structure'
import { useMetricsClient } from '@/components/client/metrics'
import * as api_pb from '@/components/api/api_pb'
import { GoMetricsRequest, GoMetricsResponse } from '@/components/api/api_pb'
import { appendGraphData } from '@/components/charts/data-operation'
import { recorderState } from '@/components/state/recorder-state'
import { myEmitter } from '@/components/state/emitter'

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
  const { basicURL, isRecording } = useSnapshot(recorderState)

  useEffect(() => {
    const clearData = () => {
      setGraphData(newGraphData())
    }
    myEmitter.on('clearData', clearData)
    return () => myEmitter.on('clearData', clearData)
  }, [setGraphData])

  useEffect(() => {
    if (!isRecording) return
    const req = new GoMetricsRequest().setUrl(basicURL)
    const streams: grpcWeb.ClientReadableStream<api_pb.GoMetricsResponse>[] = []
    const t = setInterval(() => {
      const callback = (err: grpcWeb.RpcError, response: GoMetricsResponse) => {
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
            return appendGraphData(prevData, response)
          })
        }
      }

      let stream: grpcWeb.ClientReadableStream<api_pb.GoMetricsResponse>
      switch (pprofType) {
        case PprofType.cpu:
          stream = client.cPUMetrics(req, null, callback)
          break
        case PprofType.heap:
          stream = client.heapMetrics(req, null, callback)
          break
        case PprofType.allocs:
          stream = client.allocsMetrics(req, null, callback)
          break
        case PprofType.goroutine:
          stream = client.goroutineMetrics(req, null, callback)
          break
      }
      streams.push(stream)
    }, 1000)

    if (streams.length > 5) {
      console.warn('${metricsFunc} created too many concurrent streams. consider set a timeout for each stream')
    }

    return () => {
      clearTimeout(t)
      streams.forEach(p => p.cancel())
    }
  }, [client, isRecording, basicURL])

  return graphData
}
