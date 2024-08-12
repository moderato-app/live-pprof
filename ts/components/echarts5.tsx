'use client'
import React, { useEffect, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import { DatasetComponentOption } from 'echarts/components'
import '@/components/dark.js'
import { SeriesOption } from 'echarts'
import { useTheme } from 'next-themes'

import js from './life-expectancy-table.json'

export const MyEcharts5: React.FC = () => {
  const theme = useTheme()
  const ref = useRef<any>()

  useEffect(() => {
    if (ref.current) {
      const instance = ref.current.getEchartsInstance()
      instance.group = 'group1'
      echarts.connect('group1')
    }
  }, [])

  return (
    // @ts-ignore
    <ReactECharts option={run(js, theme.resolvedTheme == 'dark')} theme={theme.resolvedTheme == 'dark' ? 'dark' : ''} />
  )
}

function run(_rawData: any, isDark: boolean) {
  const countries = [
    'Australia',
    'Canada',
    'China',
    'Cuba',
    'Finland',
    'France',
    'Germany',
    'Iceland',
    'India',
    'Japan',
    'North Korea',
    'South Korea',
    'New Zealand',
    'Norway',
    'Poland',
    'Russia',
    'Turkey',
    'United Kingdom',
    'United States',
  ]
  // const countries = ['Finland', 'France', 'Germany', 'Iceland', 'Norway', 'Poland', 'Russia', 'United Kingdom']
  const datasetWithFilters: DatasetComponentOption[] = []
  const seriesList: SeriesOption[] = []
  for (let country of countries) {
    const datasetId = 'dataset_' + country
    datasetWithFilters.push({
      id: datasetId,
      fromDatasetId: 'dataset_raw',
      transform: {
        type: 'filter',
        config: {
          and: [
            { dimension: 'Year', gte: 1950 },
            { dimension: 'Country', '=': country },
          ],
        },
      },
    })
    seriesList.push({
      type: 'line',
      datasetId: datasetId,
      showSymbol: false,
      name: country,
      endLabel: {
        // show: true,
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
      },
      encode: {
        x: 'Year',
        y: 'Income',
        label: ['Country', 'Income'],
        itemName: 'Year',
        tooltip: ['Income'],
      },
    })
  }

  return {
    animationDuration: 500,
    legend: {
      type: 'plain',
      calculable: true,
      bottom: 0,
    },
    dataset: [
      {
        id: 'dataset_raw',
        source: _rawData,
      },
      ...datasetWithFilters,
    ],
    title: {
      text: 'Income of Germany and France since 1950',
    },
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis',
      backgroundColor: isDark ? '#2e2e2e' : 'white',
      borderColor: isDark ? '#2e2e2e' : 'white',
      textStyle: isDark
        ? {
            color: '#e3e3e3',
          }
        : null,
      position: function (point: Array<number>, params: any | Array<any>, dom: HTMLElement, rect: any, size: any) {
        if (point[0] + dom.clientWidth + 20 < size.viewSize[0]) {
          // place tooltip at right bottom of the pointer
          return [point[0] + 20, point[1] + 30]
        } else {
          // if tooltip will be outside the graph, place it at left bottom of the pointer
          return [point[0] - dom.clientWidth - 20, point[1] + 30]
        }
      },
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle',
    },
    yAxis: {
      name: 'Income',
    },
    grid: {
      right: 0,
      left: 50,
    },
    series: seriesList,
  }
}
