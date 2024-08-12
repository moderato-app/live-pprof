import Line from 'react-charts/types/seriesTypes/Line'
import * as lo from 'lodash'

import { IncrementalMetricsStreamResponse } from '@/components/api/api_pb'
import { convertUnixNanoToDate } from '@/components/util/util'

export type Line = {
  label: string
  data: Point[]
}

export type Point = {
  primary: Date
  secondary: number
  radius: number
}

export const initLines: Line[] = [
  {
    label: `initLines`,
    data: [
      {
        primary: new Date(),
        secondary: 0,
        radius: 0,
      },
    ],
  },
]

export function appendData(lines: Line[], rsp: IncrementalMetricsStreamResponse): Line[] {
  if (lines === initLines) {
    lines = []
    console.log('clear initLines')
  }
  let grp = lo.keyBy(lines, line => line.label)

  let newLines: Line[] = []
  let items = lo.sortBy(rsp.getItemsList(), item => item.getFlat()).reverse()
  .slice(0, 6)

  let date = convertUnixNanoToDate(rsp.getDate())

  for (let item of items) {
    let line = grp[item.getFunc()]

    let point: Point = {
      primary: date,
      secondary: item.getFlat(),
      radius: 0,
    }

    if (!line) {
      line = {
        label: item.getFunc(),
        data: [],
      }
    }
    let newLine = { ...line }

    newLine.data.push(point)
    newLines.push(newLine)
  }
  let names = rsp.getItemsList().map(item => item.getFunc())
  const s = new Set(names)

  console.info(
    'rsp.getItemsList().length vs newLines.length vs s.size',
    rsp.getItemsList().length,
    newLines.length,
    s.size
  )

  const gp = lo.groupBy(items, line => line.getFunc() + line.getLine())
  for (let key in gp) {
    let value = gp[key]
    if (value.length > 1) {
      console.error('fuck')
    }
  }
  const filter = rsp.getItemsList().filter(item => !s.has(item.getFunc()))
  return newLines
}
