'use client'
import React, { useEffect, useRef, useState } from 'react'
import { connect, registerTheme } from 'echarts'
import { useTheme } from 'next-themes'
import grpcWeb from 'grpc-web'
import ReactECharts from 'echarts-for-react'
import { useSnapshot } from 'valtio/react'

import * as api_pb from '@/components/api/api_pb'
import { GoMetricsRequest, GoMetricsResponse } from '@/components/api/api_pb'
import { mockMetricClient } from '@/components/client/metrics'
import darkTheme from '@/components/charts/dark-theme'
import { GraphData } from '@/components/charts/data-structure'
import { appendGraphData } from '@/components/charts/data-operation'
import { op } from '@/components/charts/archive'
import { graphPrefsState } from '@/components/state/pref-state'
import { uiState } from '@/components/state/ui-state'

registerTheme('dark', darkTheme())

interface CPUGraphProps {
  [key: string]: any
}

export const CPUGraph: React.FC<CPUGraphProps> = props => {
  const theme = useTheme()
  const ref = useRef<any>()
  const [graphData, setGraphData] = useState<GraphData>({ lineTable: {}, dates: [] })
  const uiSnap = useSnapshot(uiState)
  const { inuseSpace, smooth } = useSnapshot(graphPrefsState)

  useEffect(() => {
    if (ref.current) {
      const instance = ref.current.getEchartsInstance()
      instance.group = 'group1'
      connect('group1')
    }
  }, [ref])

  useEffect(() => {
    const req = new GoMetricsRequest().setUrl('http://localhost:2379/debug/pprof')
    const streams: grpcWeb.ClientReadableStream<api_pb.GoMetricsResponse>[] = []
    const t = setInterval(() => {
      let stream = mockMetricClient.cPUMetrics(req, null, (err: grpcWeb.RpcError, response: GoMetricsResponse) => {
        // remove stream from the list
        const index = streams.indexOf(stream)
        if (index > -1) {
          streams.splice(index, 1)
        }

        if (err) {
          console.debug('cPUMetrics err', err)
        } else {
          console.debug('cPUMetrics resp', response)
          setGraphData(prevData => {
            return appendGraphData(prevData, response)
          })
        }
      })
      streams.push(stream)
    }, 1000)

    if (streams.length > 5) {
      console.warn('tooa many concurrent streams. consider set a timeout for each stream')
    }

    return () => {
      clearTimeout(t)
      streams.forEach(p => p.cancel())
    }
  }, [])

  useEffect(() => {
    const chart = ref.current?.getEchartsInstance()
    if (chart) {
      chart.getZr().on('dblclick', () => {
        console.info('dblclick')
        uiState.freezeTooltip = false
        window.document.querySelectorAll('.tooltip').forEach(el => {
          el.parentNode?.childNodes.forEach(c => c.remove())
        })
        chart.dispatchAction({
          type: 'dataZoom',
          start: 0,
          end: 100,
        })
      })
    }
    if (chart) {
      chart.getZr().on('click', () => {
        console.info('click')
        uiState.freezeTooltip = true
      })
    }
  }, [ref])

  return (
    <section
      className="w-full h-[50%]"
      role="presentation"
      onClick={event => {
        uiState.freezeTooltip = true
        event.stopPropagation()
      }}
    >
      <ReactECharts
        key={`${inuseSpace.total}`}
        ref={ref}
        className="p-1 border-2 border-dotted border-default-400 rounded-xl"
        option={op(
          'CPU',
          graphData,
          theme.resolvedTheme == 'dark',
          inuseSpace.total,
          smooth,
          false,
          uiSnap.freezeTooltip
        )}
        style={{ height: '100%', width: '100%' }}
        theme={theme.resolvedTheme == 'dark' ? 'dark' : ''}
      />
    </section>
  )
}
