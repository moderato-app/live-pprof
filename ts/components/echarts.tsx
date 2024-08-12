'use client'
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { EChartsOption } from 'echarts-for-react/src/types'

export const MyEcharts: React.FC = () => {
  const options: EChartsOption = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
      {
        data: [
          1820, 932, 1901, 934, 3290, 130, 130, 1820, 932, 1901, 934, 3290, 130, 130, 1820, 932, 1901, 934, 3290, 130,
          130, 1820, 932, 1901, 934, 3290, 130, 130, 1820, 932, 1901, 934, 3290, 130, 130,
        ],
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  }

  // @ts-ignore
  return <ReactECharts option={options} />
}


// export const MyEcharts2: React.FC = () => {
// const option:EChartsOption = {
//   title: {
//     text: echarts.format.addCommas(dataCount) + ' Data',
//     left: 10
//   },
//   toolbox: {
//     feature: {
//       dataZoom: {
//         yAxisIndex: false
//       },
//       saveAsImage: {
//         pixelRatio: 2
//       }
//     }
//   },
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'shadow'
//     }
//   },
//   grid: {
//     bottom: 90
//   },
//   dataZoom: [
//     {
//       type: 'inside'
//     },
//     {
//       type: 'slider'
//     }
//   ],
//   xAxis: {
//     data: data.categoryData,
//     silent: false,
//     splitLine: {
//       show: false
//     },
//     splitArea: {
//       show: false
//     }
//   },
//   yAxis: {
//     splitArea: {
//       show: false
//     }
//   },
//   series: [
//     {
//       type: 'bar',
//       data: data.valueData,
//       // Set `large` for large data amount
//       large: true
//     }
//   ]
// };
//
//   // @ts-ignore
//   return <ReactECharts option={options} />
// }
