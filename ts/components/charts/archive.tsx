import { DatasetComponentOption } from 'echarts/components'
import { SeriesOption } from 'echarts'
import _ from 'lodash'
import prettyBytes from 'pretty-bytes'

import { GraphData } from '@/components/charts/data-structure'

export function op(
  name: string,
  graphData: GraphData,
  isDark: boolean,
  total: boolean,
  smooth: boolean,
  showLine: boolean,
  freezeTooltip: boolean
) {
  const dataset: DatasetComponentOption[] = Object.keys(graphData.lineTable).map(key => ({
    id: key,
    source: graphData.lineTable[key].points,
  }))

  const seriesList: SeriesOption[] = Object.keys(graphData.lineTable)
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
    }))

  // noinspection JSUnusedGlobalSymbols
  return {
    animationDuration: 0,
    // legend: {
    //   type: 'plain',
    //   calculable: true,
    //   bottom: 0,
    // },
    dataset: dataset,
    title: {
      text: name,
    },
    xAxis: {
      type: 'time',
      nameLocation: 'middle',
    },
    yAxis: {
      axisLabel: {
        formatter: function (value: number) {
          return prettyBytes(value)
        },
      },
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
      },
      {
        type: 'slider',
        show: true,
        showDataShadow: false,
        yAxisIndex: [0],
        labelFormatter: function (value: number) {
          return isNaN(value) ? '' : prettyBytes(value)
        },
      },
      {
        type: 'inside',
        xAxisIndex: [0],
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: {},
        restore: {},
      },
    },
    grid: {
      right: 50,
      left: 50,
    },
    series: seriesList,
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis',
      alwaysShowContent: freezeTooltip,
      // hideDelay: 10_000,
      enterable: true,
      // triggerOn: 'click',
      triggerOn: freezeTooltip ? 'click' : 'mousemove|click',
      // https://github.com/apache/echarts/issues/9763#issuecomment-1446643093
      // remove items that have null flat value
      formatter: function (params: any[]) {
        params = _.uniqBy(params, p => p.seriesId)
        let output =
          `<div class="tooltip"> <span class="text-default-600 pb-1 font-mono cursor-pointer select-text">${params[0].axisValueLabel}</span>` +
          '<br/>'

        output += '<div class="w-full cursor-pointer select-text">'

        params.forEach(p => {
          const value = p.value.flat
          const splits = p.seriesName.split(' ')
          const func = splits[0]
          const line = splits[1]
          const lineHtml =
            showLine && p.seriesName != 'total '
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

        return output + '</div></div>'
      },

      valueFormatter: function (value: number | string, _dataIndex: number): string | undefined {
        if (typeof value === 'number' && value) {
          return prettyBytes(value as number)
        } else {
          return undefined
        }
      },
      backgroundColor: isDark ? '#2e2e2e' : 'white',
      borderColor: isDark ? '#2e2e2e' : 'white',
      textStyle: isDark
        ? {
            color: '#e3e3e3',
          }
        : null,
      position: function (point: Array<number>, _params: any | Array<any>, dom: HTMLElement, _rect: any, size: any) {
        if (point[0] < size.viewSize[0] / 2) {
          // place tooltip at right bottom of the pointer
          return [point[0] + 20, point[1] + 30]
        } else {
          return [point[0] - dom.clientWidth - 20, point[1] + 30]
        }
        // if (point[0] + dom.clientWidth + 20 < size.viewSize[0]) {
        //   // place tooltip at right bottom of the pointer
        //   return [point[0] + 20, point[1] + 30]
        // } else {
        //   // if tooltip will be outside the graph, place it at left bottom of the pointer
        //   return [point[0] - dom.clientWidth - 20, point[1] + 30]
        // }
      },
    },
  }
}
