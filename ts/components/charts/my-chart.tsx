'use client'
import React, { useEffect, useRef, useState } from 'react'
import { connect, registerTheme } from 'echarts'
import { useTheme } from 'next-themes'
import { useAtom } from 'jotai'
import grpcWeb from 'grpc-web'
import ReactECharts from 'echarts-for-react'

import * as api_pb from '@/components/api/api_pb'
import { GoMetricsRequest, GoMetricsResponse } from '@/components/api/api_pb'
import { metricClient } from '@/components/client/metrics'
import { freezeTooltipAtom, inuseSpacePrefAtom } from '@/components/atom/shared-atom'
import darkTheme from '@/components/charts/dark-theme'
import { GraphData } from '@/components/charts/data-structure'
import { appendGraphData } from '@/components/charts/data-operation'
import { op } from '@/components/charts/archive'
import { ChartPref } from '@/components/charts/chart-pref'

registerTheme('dark', darkTheme())

export const MyEcharts: React.FC = () => {
  const theme = useTheme()
  const ref = useRef<any>()
  const [graphData, setGraphData] = useState<GraphData>({ lineTable: {}, dates: [] })
  const [freezeTooltip, setFreezeTooltip] = useAtom(freezeTooltipAtom)

  useEffect(() => {
    if (ref.current) {
      const instance = ref.current.getEchartsInstance()
      instance.group = 'group1'
      connect('group1')
    }
  }, [])

  useEffect(() => {
    const req = new GoMetricsRequest().setUrl('http://localhost:2379/debug/pprof')
    const streams: grpcWeb.ClientReadableStream<api_pb.GoMetricsResponse>[] = []
    const t = setInterval(() => {
      let stream = metricClient.inuseSpaceMetrics(req, null, (err: grpcWeb.RpcError, response: GoMetricsResponse) => {
        // remove stream from the list
        const index = streams.indexOf(stream)
        if (index > -1) {
          streams.splice(index, 1)
        }

        if (err) {
          console.log('inuseSpaceMetrics err', err)
        } else {
          console.log('inuseSpaceMetrics resp', response)
          setGraphData(prevData => {
            return appendGraphData(prevData, response)
          })
        }
      })
      streams.push(stream)
    }, 1000)

    if (streams.length > 5) {
      console.warn('too many concurrent streams. consider set a timeout for each stream')
    }

    return () => {
      clearTimeout(t)
      streams.forEach(p => p.cancel())
    }
  }, [])
  const [pref, setPref] = useAtom(inuseSpacePrefAtom)

  return (
    <section
      className="h-full w-full"
      role="presentation"
      onClick={() => {
        setFreezeTooltip(false)
        console.log('ref.current', ref.current)
        const ins = ref.current?.getEchartsInstance()
        if (ins) {
          let tooltip = window.document.getElementById('tooltip')
          if (tooltip) {
            tooltip.remove()
          }
        }
      }}
    >
      {/*<EChartComponent*/}
      {/*  key={`abc`}*/}
      {/*  freezeTooltip={freezeTooltip}*/}
      {/*  graphData={graphData}*/}
      {/*  pref={inuseSpacePrefAtom}*/}
      {/*  showTooltip={showTooltip}*/}
      {/*  theme={theme.resolvedTheme == 'dark' ? 'dark' : ''}*/}
      {/*/>*/}
      <div
        className="flex gap-10 items-center"
        role="presentation"
        onClick={event => {
          setFreezeTooltip(true)
          event.stopPropagation()
        }}
      >
        <ReactECharts
          ref={ref}
          key={`${pref.total}`}
          // key={`${total}+${showTooltip}`}
          className="w-full"
          option={op(graphData, theme.resolvedTheme == 'dark', pref.total, pref.smooth, pref.line, freezeTooltip)}
          theme={theme.resolvedTheme == 'dark' ? 'dark' : ''}
        />
        <ChartPref pref={inuseSpacePrefAtom} />
      </div>
    </section>
  )
}
