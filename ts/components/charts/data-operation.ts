'use client'
import { GraphData, Point } from '@/components/charts/data-structure'
import { GoMetricsResponse, Item } from '@/components/api/api_pb'
import { convertUnixNanoToDate } from '@/components/util/util'

const getKey = (item: Item): string => item.getFunc() + ' ' + item.getLine()

export function appendGraphData(graphData: GraphData, rsp: GoMetricsResponse, maxSamples?: number): GraphData {
  let date = convertUnixNanoToDate(rsp.getDate())

  let items = rsp.getItemsList().filter(item => item.getFlat() > 0)

  graphData.dates.push(date)

  const count = graphData.dates.length

  if (maxSamples && maxSamples > 0 && count > maxSamples) {
    const datesToDelete = graphData.dates.splice(0, count - maxSamples)
    datesToDelete.forEach(d =>
      Object.keys(graphData.lineTable).forEach(key => {
        const line = graphData.lineTable[key]
        line.points = line.points.filter(p => p.date !== d)
      })
    )
  }

  for (let key in graphData.lineTable) {
    graphData.lineTable[key].points.push({
      date: date,
      flat: undefined,
      cum: undefined,
    })
  }

  for (let item of items) {
    const key = getKey(item)
    let line = graphData.lineTable[key]
    if (!line) {
      const nullPoints = graphData.dates.map(
        (d): Point => ({
          date: d,
          flat: undefined,
          cum: undefined,
        })
      )
      line = {
        name: key,
        points: nullPoints,
      }
      graphData.lineTable[key] = line
    }
    const last = line.points[line.points.length - 1]
    line.points[line.points.length - 1] = { ...last, flat: item.getFlat(), cum: item.getCum() }
  }
  return { ...graphData }
}
