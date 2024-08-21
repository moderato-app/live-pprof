'use client'
import { useTheme } from 'next-themes'
import { EChartsOption } from 'echarts-for-react/src/types'
import { FC, useMemo } from 'react'

import { CursorQuadrant, useCursorQuadrant } from '@/components/charts/option/use-cursor-quadrant'

export type BasicProps = {
  labelFormatter?: (value: number) => string
}

export const useBasicOption: FC<BasicProps> = ({ labelFormatter }): EChartsOption => {
  const theme = useTheme()
  const cq = useCursorQuadrant()
  console.info('cq', cq)
  return useMemo(() => basicOption(theme.resolvedTheme === 'dark', labelFormatter, cq), [cq, theme])
}

export const basicOption = (
  isDark: boolean,
  labelFormatter: ((value: number) => string) | undefined,
  cq: CursorQuadrant
): EChartsOption => {
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
      backgroundColor: isDark ? '#2e2e2e' : 'white',
      borderColor: isDark ? '#2e2e2e' : 'white',
      textStyle: isDark
        ? {
            color: '#e3e3e3',
          }
        : null,
      position: function (point: Array<number>, _params: any | Array<any>, dom: HTMLElement, _rect: any, _size: any) {
        switch (cq) {
          case CursorQuadrant.First:
            // place tooltip at left bottom of the pointer
            return [point[0] - dom.clientWidth - 20, point[1] + 30]
          case CursorQuadrant.Second:
            // place tooltip at right bottom of the pointer
            return [point[0] + 20, point[1] + 30]
          case CursorQuadrant.Third:
            // place tooltip at right top of the pointer
            return [point[0] + 20, point[1] - 30 - dom.clientHeight]
          case CursorQuadrant.Fourth:
            // place tooltip at left top of the pointer
            return [point[0] - dom.clientWidth - 20, point[1] - 30 - dom.clientHeight]
        }
      },
    },
  }
}
