'use client'
import React from 'react'
import ReactECharts, { EChartsOption } from 'echarts-for-react'
import dayjs from 'dayjs'

export const MyEcharts4: React.FC = () => {
  // @ts-ignore
  return <ReactECharts option={option} />
}

const dataCount = 100
const data = generateData(dataCount)
let option: EChartsOption = {
  animationDuration: 500,
  title: {
    text: 'inuse_space',
  },
  tooltip: {
    order: 'valueDesc',
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  toolbox: {
    feature: {
      saveAsImage: {
        pixelRatio: 2,
      },
    },
  },
  grid: {
    bottom: 90,
  },
  dataZoom: [
    {
      type: 'inside',
    },
    {
      type: 'slider',
    },
  ],
  xAxis: {
    data: data.categoryData,
    silent: false,
    splitLine: {
      show: false,
    },
    splitArea: {
      show: false,
    },
  },
  yAxis: {
    splitArea: {
      show: false,
    },
  },
  series: [
    {
      showSymbol: false,
      type: 'line',
      data: data.valueData,
      // Set `large` for large data amount
      large: true,
    },
  ],
}

function generateData(count: number) {
  let baseValue = Math.random() * 1000
  let dj = dayjs()
  let smallBaseValue = 0

  function next(idx: number) {
    smallBaseValue = idx % 30 === 0 ? Math.random() * 700 : smallBaseValue + Math.random() * 500 - 250
    baseValue += Math.random() * 20 - 10
    return Math.max(0, Math.round(baseValue + smallBaseValue) + 3000)
  }

  const categoryData = []
  const valueData = []
  for (let i = 0; i < count; i++) {
    let str = ''
    if (dj.isSame(dayjs(), 'day')) {
      // if today
      str = dayjs(dj).format('HH:mm:ss')
    } else {
      str = dayjs(dj).format('YYYY MM-DD\nHH:mm:ss')
    }

    categoryData.push(str)
    valueData.push(next(i).toFixed(2))
    dj = dj.add(1, 'second')
  }
  return {
    categoryData: categoryData,
    valueData: valueData,
  }
}
