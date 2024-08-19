import { GraphData } from '@/components/charts/data-structure'

export const generateDataset = (graphData: GraphData) => {
  return Object.keys(graphData.lineTable).map(key => ({
    id: key,
    source: graphData.lineTable[key].points,
  }))
}

export const generateSeriesList = (seriesIds: string[], total: boolean, smooth: boolean) => {
  return seriesIds
    .filter(id => total || id !== 'total ')
    .map(id => ({
      type: 'line',
      datasetId: id,
      showSymbol: false,
      name: id,
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
}
