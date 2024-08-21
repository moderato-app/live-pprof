import prettyBytes from 'pretty-bytes'
import { useSnapshot } from 'valtio/react'
import { EChartsOption } from 'echarts-for-react/src/types'
import { FC, useCallback, useMemo } from 'react'
import { DatasetComponentOption } from 'echarts/components'
import { SeriesOption } from 'echarts'
import _ from 'lodash'

import { uiState } from '@/components/state/ui-state'
import { FlatOrCum, GraphPref, graphPrefsState } from '@/components/state/pref-state'
import { useBasicOption } from '@/components/charts/option/basic-option'
import { GraphData } from '@/components/charts/data-structure'
import prettyTime from '@/components/util/prettyTime'

export type PprofType = 'CPU' | 'Heap'

type PprofProps = {
  name: string
  graphData: GraphData
  graphPrefProxy: GraphPref
  pprofType: PprofType
}

export const usePprofOption: FC<PprofProps> = ({ name, graphData, graphPrefProxy, pprofType }): EChartsOption => {
  const { total, flatOrCum } = useSnapshot(graphPrefProxy)
  const { smooth } = useSnapshot(graphPrefsState)

  const labelFmt = useCallback(labelFormatter(pprofType), [pprofType])
  const tooltipFmt = useCallback(tooltipFormatter(flatOrCum, labelFmt), [flatOrCum, labelFmt])

  const bo = useBasicOption({ labelFormatter: labelFmt }) as EChartsOption

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
            y: flatOrCum.toLowerCase(),
            itemName: 'date',
            tooltip: [flatOrCum.toLowerCase()],
          },
        })),
    [graphData, smooth, total, flatOrCum]
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
        formatter: labelFmt,
      },
    },
    tooltip: {
      ...bo.tooltip,
      formatter: tooltipFmt,
    },
  }
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
    if (!params[0]) {
      return ''
    }
    let output =
      `<div class="tooltip"> <span class="text-default-600 pb-1 font-mono cursor-pointer select-text">${params[0].axisValueLabel}</span>` +
      '<br/>'

    output += '<div class="w-full cursor-pointer select-text">'

    params.forEach(p => {
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

    return output + '</div></div>'
  }
}

const labelFormatter = (pprofType: PprofType): ((value: number) => string) => {
  if (pprofType === 'Heap') {
    return (value: number) => (isNaN(value) ? '' : prettyBytes(value))
  } else if (pprofType === 'CPU') {
    return (value: number) => (isNaN(value) ? '' : prettyTime(value / 1e6))
  } else {
    throw new Error('Invalid pprof type', pprofType)
  }
}
