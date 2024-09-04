'use client'
import prettyBytes from 'pretty-bytes'
import { useSnapshot } from 'valtio/react'
import { EChartsOption } from 'echarts-for-react/src/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DatasetComponentOption } from 'echarts/components'
import { SeriesOption } from 'echarts'
import _ from 'lodash'

import { uiState } from '@/components/state/ui-state'
import { dispatchGraphPrefProxy, FlatOrCum, graphPrefsState } from '@/components/state/pref-state'
import { useBasicOption } from '@/components/hooks/use-basic-option'
import prettyTime from '@/components/util/prettyTime'
import { PprofType, useGraphData } from '@/components/hooks/use-graph-data'
import { myEmitter } from '@/components/state/emitter'

type PprofProps = {
  pprofType: PprofType
}

export const usePprofOption = ({ pprofType }: PprofProps): [option: EChartsOption, refreshKey: string] => {
  const { total, flatOrCum } = useSnapshot(dispatchGraphPrefProxy(pprofType))
  const { smooth } = useSnapshot(graphPrefsState)

  const labelFmt = useCallback(labelFormatter(pprofType), [pprofType])
  const tooltipFmt = useCallback(tooltipFormatter(flatOrCum, labelFmt), [flatOrCum, labelFmt])

  const bo = useBasicOption({ labelFormatter: labelFmt }) as EChartsOption

  const graphData = useGraphData({ pprofType: pprofType })

  const [clearCount, setClearCount] = useState(0)

  useEffect(() => {
    const incr = () => setClearCount(count => count + 1)
    myEmitter.on('clearData', incr)
    return () => myEmitter.on('clearData', incr)
  }, [])

  const dataset: DatasetComponentOption[] = useMemo(() => {
    return Object.keys(graphData.lineTable).map(key => ({
      id: key,
      source: graphData.lineTable[key].points,
    }))
  }, [graphData])

  const keys = useMemo(() => Object.keys(graphData.lineTable), [graphData])

  const seriesList: SeriesOption[] = useMemo(
    () =>
      keys
        .filter(key => total || key !== 'total ')
        .map(key => ({
          type: 'line',
          datasetId: key,
          showSymbol: false,
          name: key,
          smooth: smooth,
          labelLayout: {
            moveOverlap: 'shiftY',
          },
          emphasis: {
            focus: 'series',
          },
          encode: {
            x: 'date',
            y: flatOrCum.toLowerCase(),
            itemName: 'date',
            tooltip: [flatOrCum.toLowerCase()],
          },
        })),
    [keys, smooth, total, flatOrCum]
  )

  const refreshKey = `${total}+${flatOrCum}+${clearCount}`
  const option = {
    ...bo,
    title: {
      text: pprofType,
    },
    dataset: dataset,
    series: seriesList,
    xAxis: {
      type: 'time',
      nameLocation: 'middle',
    },
    yAxis: {
      axisLabel: {
        formatter: labelFmt,
      },
    },
    tooltip: {
      ...bo.tooltip,
      formatter: tooltipFmt,
    },
  }

  return [option, refreshKey]
}

const tooltipFormatter = (foc: FlatOrCum, labelFmt: (value: number) => string): ((params: any[]) => string) => {
  return (params: any[]) => {
    uiState.hoveringDate = params[0]?.data?.date

    params = _.sortBy(
      _.uniqBy(
        params.filter(it => it.value[foc.toLowerCase()] !== undefined),
        it => it.seriesId
      ),
      it => -it.value[foc.toLowerCase()]
    )
    const tooLong = params.length > 20

    if (!params[0]) {
      return ''
    }
    let output = `
<div class="tooltip"> 
  <div class="flex justify-between text-default-600 pb-1 font-mono cursor-pointer select-text">
    <span>${params[0].axisValueLabel}</span>
    <span class="font-semibold">flat</span>
  </div>
  <div class="w-full cursor-pointer select-text">
`
    params.slice(0, 20).forEach(p => {
      const value = p.value[foc.toLowerCase()]
      const splits = p.seriesName.split(' ')
      const func = splits[0]
      if (value) {
        output += `<div class="flex flex-col gap-0.5">
              <div class="flex flex-col">
                <div class="flex items-center justify-between gap-8">
                  <div class="flex gap-0.5">
                    <div class="translate-y-0.5">${p.marker}</div>
                    <span class="text-default-600 text-center">${func}</span>
                  </div>
  
                  <div class="font-bold text-default-600">${labelFmt(value)}</div>
                </div>
              </div">              
            </div>`
      }
    })
    if (tooLong) output += `<div>…showing 20 of ${params.length}…</div>`

    return output + '</div></div>'
  }
}

const labelFormatter = (pprofType: PprofType): ((value: number) => string) => {
  switch (pprofType) {
    case PprofType.cpu:
      return (value: number) => (isNaN(value) ? '' : prettyTime(value / 1e6))
    case PprofType.allocs:
    case PprofType.heap:
      return (value: number) => (isNaN(value) ? '' : prettyBytes(value))
    case PprofType.goroutine:
      return (value: number) => (isNaN(value) ? '' : `${value}`)
  }
}
