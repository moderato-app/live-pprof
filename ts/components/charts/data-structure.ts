export type Point = {
  date: Date
  flat: number | undefined
  cum: number | undefined
}

export type Line = {
  name: string
  points: Point[]
}

export type LineTable = Record<string, Line>

export type GraphData = {
  lineTable: LineTable
  dates: Date[]
}
