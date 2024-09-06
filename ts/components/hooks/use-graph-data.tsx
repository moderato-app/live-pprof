"use client"
import { useEffect, useState } from "react"
import grpcWeb from "grpc-web"
import { useSnapshot } from "valtio/react"
import dayjs from "dayjs"
import { defer } from "lodash"

import { GraphData, newGraphData } from "@/components/charts/data-structure"
import { useMetricsClient } from "@/components/client/metrics"
import * as api_pb from "@/components/api/api_pb"
import { GoMetricsRequest, GoMetricsResponse } from "@/components/api/api_pb"
import { appendGraphData } from "@/components/charts/data-operation"
import { recorderState, resetRecorder } from "@/components/state/recorder-state"
import { myEmitter } from "@/components/state/emitter"
import { useURL } from "@/components/hooks/use-url"
import { dispatchGraphPrefProxy, graphPrefsState } from "@/components/state/pref-state"
import { useProfileDuration } from "@/components/hooks/use-profile-duration"

export enum PprofType {
  cpu = "CPU",
  heap = "Heap",
  allocs = "Allocs",
  goroutine = "Goroutine"
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
  const { topN } = useSnapshot(dispatchGraphPrefProxy(pprofType))
  const { seconds } = useProfileDuration()

  // use this to trigger the useEffect to make a new request
  const [nextReqSignal, setNextReqSignal] = useState(1)

  useEffect(() => {
    const clearData = () => {
      setGraphData(newGraphData())
      resetRecorder()
    }
    myEmitter.on("clearData", clearData)
    return () => myEmitter.on("clearData", clearData)
  }, [setGraphData])

  useEffect(() => {
    if (!isRecording) return
    if (typeof url !== "string") {
      return
    }

    const streams: grpcWeb.ClientReadableStream<api_pb.GoMetricsResponse>[] = []
    let t: NodeJS.Timeout
    let lastRequest = dayjs()

    const makeRequest = () => {
      const callback = (err: grpcWeb.RpcError, response: GoMetricsResponse) => {
        defer(() => {
          let waitForMs = sampleInterval
          // since cpu request takes about sampleInterval ms to complete,
          // there is no need to wait for sampleInterval ms again.
          // Still we need to wait if cpu request fails too fast
          if (pprofType === PprofType.cpu && dayjs().diff(lastRequest, "millisecond") > sampleInterval) {
            waitForMs = 0
          }
          // prepare fot next request
          t = setTimeout(() => {
            setNextReqSignal(v => v + 1)
          }, waitForMs)
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
            return appendGraphData(prevData, response, topN, retainedSamples)
          })
        }
      }

      let stream: grpcWeb.ClientReadableStream<api_pb.GoMetricsResponse>
      const meta = {
        deadline: dayjs()
          .add(seconds + 5, "seconds")
          .toDate()
          .getTime()
          .toString()
      }
      lastRequest = dayjs()
      const req = new GoMetricsRequest().setUrl(url)
      switch (pprofType) {
        case PprofType.cpu:
          req.setProfileSeconds(seconds)
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
        console.warn(`${pprofType} created too many concurrent streams. Consider setting a timeout for each stream`)
      }
    }

    t = setTimeout(makeRequest, 0)

    return () => {
      clearTimeout(t)
      streams.forEach(p => p.cancel())
    }
  }, [client, isRecording, url, sampleInterval, retainedSamples, topN, nextReqSignal, seconds])

  return graphData
}
