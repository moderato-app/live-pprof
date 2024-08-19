import ReactECharts from 'echarts-for-react'
import React, { useMemo } from 'react'
import _ from 'lodash'
import prettyBytes from 'pretty-bytes'
import { WritableAtom } from 'jotai/vanilla/atom'
import { useAtom } from 'jotai/index'

import { generateDataset, generateSeriesList } from '@/components/charts/option'
import { GraphData } from '@/components/charts/data-structure'
import { Pref } from '@/components/atom/shared-atom'

export type ChartProps = {
  graphData: GraphData
  theme: '' | 'dark'
  pref: WritableAtom<Pref, any, void>

  freezeTooltip: boolean
  showTooltip: boolean
}

export const EChartComponent: React.FC<ChartProps> = props => {
  const options = useChartOptions(props)
  const [pref, setPref] = useAtom(props.pref)

  const dataZoomHandler = (event: any) => {
    setPref({ ...pref, sliderRange: [event.start, event.end, pref.sliderRange.yStart, pref.sliderRange.yEnd] })
  }

  return (
    <ReactECharts
      className="w-full"
      option={options}
      theme={props.theme === 'dark' ? 'dark' : ''}
      onEvents={{ dataZoom: dataZoomHandler }}
    />
  )
}

export const useChartOptions = (props: ChartProps) => {
  const { graphData, theme, freezeTooltip, showTooltip } = props
  const [pref] = useAtom(props.pref)

  const dataset = useMemo(() => generateDataset(graphData), [])
  const seriesList = useMemo(
    () => generateSeriesList(Object.keys(graphData.lineTable), pref.total, pref.smooth),
    [graphData.lineTable, pref]
  )

  const tooltip = useMemo(() => {
    if (!showTooltip) return {}
    return {
      order: 'valueDesc',
      trigger: 'axis',
      alwaysShowContent: freezeTooltip,
      enterable: true,
      triggerOn: freezeTooltip ? 'click' : 'mousemove|click',
      formatter: function (params: any[]) {
        params = _.uniqBy(params, p => p.seriesId)
        let output =
          ` <span class="text-default-600 pb-1 font-mono cursor-pointer select-text">${params[0].axisValueLabel}</span>` +
          '<br/>'
        output += '<div class="w-full cursor-pointer select-text">'
        params.forEach(p => {
          const value = p.value.flat
          const splits = p.seriesName.split(' ')
          const func = splits[0]
          const line = splits[1]
          const lineHtml =
            pref.line && p.seriesName !== 'total '
              ? `<div class="flex items-center">
                  <div class="opacity-0">${p.marker}</div>
                  <span class="text-default-500">${line}</span>
                </div>`
              : ''
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
                ${lineHtml}
              </div">              
            </div>`
          }
        })
        return output + '</div>'
      },
      valueFormatter: function (value: number | string, _dataIndex: number): string | undefined {
        if (typeof value === 'number' && value) {
          return prettyBytes(value as number)
        } else {
          return undefined
        }
      },
      backgroundColor: theme === 'dark' ? '#2e2e2e' : 'white',
      borderColor: theme === 'dark' ? '#2e2e2e' : 'white',
      textStyle: theme === 'dark' ? { color: '#e3e3e3' } : undefined,
      position: function (point: number[], _params: any | any[], dom: HTMLElement, _rect: any, size: any) {
        if (point[0] + dom.clientWidth + 20 < size.viewSize[0]) {
          return [point[0] + 20, point[1] + 30]
        } else {
          return [point[0] - dom.clientWidth - 20, point[1] + 30]
        }
      },
    }
  }, [showTooltip, freezeTooltip, theme, pref])

  return {
    animationDuration: 100,
    dataset: dataset,
    title: {
      text: 'inuse_space',
    },
    tooltip: tooltip,
    dataZoom: [
      { type: 'slider', show: true, xAxisIndex: [0] },
      // { type: 'slider', show: true, xAxisIndex: [0], start: pref.sliderRange.xStart, end: pref.sliderRange.xEnd },
      {
        type: 'slider',
        show: true,
        yAxisIndex: [0],
        // start: pref.sliderRange.yStart,
        // end: pref.sliderRange.yEnd,
        labelFormatter: (value: number) => (isNaN(value) ? '' : prettyBytes(value)),
      },
      { type: 'inside', xAxisIndex: [0] },
      // { type: 'inside', xAxisIndex: [0], start: pref.sliderRange.xStart, end: pref.sliderRange.xEnd },
    ],
    xAxis: { type: 'time', nameLocation: 'middle' },
    yAxis: { axisLabel: { formatter: (value: number) => prettyBytes(value) } },
    toolbox: { feature: { saveAsImage: { pixelRatio: 2 } } },
    grid: { right: 50, left: 50 },
    series: seriesList,
  }
}
