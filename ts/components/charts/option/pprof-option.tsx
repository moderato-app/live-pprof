import prettyBytes from 'pretty-bytes'
import { useSnapshot } from 'valtio/react'
import { EChartsOption } from 'echarts-for-react/src/types'
import { FC, useMemo } from 'react'
import { DatasetComponentOption } from 'echarts/components'
import { SeriesOption } from 'echarts'
import _ from 'lodash'

import { GraphPref, graphPrefsState } from '@/components/state/pref-state'
import { useBasicOption } from '@/components/charts/option/basic-option'
import { GraphData } from '@/components/charts/data-structure'
import prettyTime from '@/components/util/prettyTime'

export type PprofType = 'CPU' | 'Memory'

type PprofProps = {
  name: string
  graphData: GraphData
  graphPrefProxy: GraphPref
  pprofType: PprofType
}

export const usePprofOption: FC<PprofProps> = ({ name, graphData, graphPrefProxy, pprofType }): EChartsOption => {
  const fmt = labelFormatter(pprofType)
  const bo = useBasicOption({ labelFormatter: fmt }) as EChartsOption
  const { total } = useSnapshot(graphPrefProxy)
  const { smooth } = useSnapshot(graphPrefsState)

  const dataset: DatasetComponentOption[] = useMemo(
    () =>
      Object.keys(graphData.lineTable).map(key => ({
        id: key,
        source: graphData.lineTable[key].points,
      })),
    [graphData]
  )

  const seriesList: SeriesOption[] = useMemo(
    () =>
      Object.keys(graphData.lineTable)
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
            y: 'flat',
            itemName: 'date',
            tooltip: ['flat'],
          },
        })),
    [graphData, smooth, total]
  )

  return {
    ...bo,
    title: {
      text: name,
    },
    dataset: dataset,
    series: seriesList,
    xAxis: {
      type: 'time',
      nameLocation: 'middle',
    },
    yAxis: {
      axisLabel: {
        formatter: fmt,
      },
    },
    tooltip: {
      ...bo.tooltip,
      formatter: tooltipFormatter,
    },
  }
}

const tooltipFormatter = (params: any[]): string => {
  params = _.uniqBy(params, p => p.seriesId)
  let output =
    `<div class="tooltip"> <span class="text-default-600 pb-1 font-mono cursor-pointer select-text">${params[0].axisValueLabel}</span>` +
    '<br/>'

  output += '<div class="w-full cursor-pointer select-text">'

  params.forEach(p => {
    const value = p.value.flat
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
  
                  <div class="font-bold text-default-600">${prettyBytes(value)}</div>
                </div>
              </div">              
            </div>`
    }
  })

  return output + '</div></div>'
}

const labelFormatter = (pprofType: PprofType): ((value: number) => string) => {
  if (pprofType === 'Memory') {
    return (value: number) => (isNaN(value) ? '' : prettyBytes(value))
  } else if (pprofType === 'CPU') {
    return (value: number) => (isNaN(value) ? '' : prettyTime(value / 1e6))
  } else {
    throw new Error('Invalid pprof type', pprofType)
  }
}
