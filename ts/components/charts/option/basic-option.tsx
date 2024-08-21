import { useTheme } from 'next-themes'
import { EChartsOption } from 'echarts-for-react/src/types'
import { FC } from 'react'

export type BasicProps = {
  labelFormatter?: (value: number) => string
}

export const useBasicOption: FC<BasicProps> = ({ labelFormatter }): EChartsOption => {
  const theme = useTheme()

  return basicOption(theme.resolvedTheme === 'dark', labelFormatter)
}

export const basicOption = (isDark: boolean, labelFormatter?: (value: number) => string): EChartsOption => {
  // noinspection JSUnusedGlobalSymbols
  return {
    animationDuration: 0,
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
        labelFormatter: labelFormatter,
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
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis',
      triggerOn: 'mousemove',
      // valueFormatter: function (value: number | string, _dataIndex: number): string | undefined {
      //   if (typeof value === 'number' && value) {
      //     return prettyBytes(value as number)
      //   } else {
      //     return undefined
      //   }
      // },
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
