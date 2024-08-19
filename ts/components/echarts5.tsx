'use client'
import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { DatasetComponentOption } from 'echarts/components'
import '@/components/dark.js'
import { connect, SeriesOption } from 'echarts'
import { useTheme } from 'next-themes'
import { ClientReadableStream } from 'grpc-web'
import prettyBytes from 'pretty-bytes'
import { Checkbox } from '@nextui-org/checkbox'
import _ from 'lodash'
import { useAtom } from 'jotai'

import {
  FullMetricsRequest,
  IncrementalMetricsRequest,
  IncrementalMetricsStreamResponse,
  Item,
} from '@/components/api/api_pb'
import { metricClient } from '@/components/client/metrics'
import { convertUnixNanoToDate } from '@/components/util/util'
import { freezeTooltipAtom, inuseSpacePrefAtom, showTooltipAtom } from '@/components/atom/shared-atom'

type Point = {
  date: Date
  flat: number | undefined
  cum: number | undefined
}

type Line = {
  name: string
  points: Point[]
}

export type LineTable = Record<string, Line>

export type GraphData = {
  lineTable: LineTable
  dates: Date[]
}

const getKey = (item: Item): string => item.getFunc() + ' ' + item.getLine()

export function appendGraphData(graphData: GraphData, rsp: IncrementalMetricsStreamResponse): GraphData {
  let date = convertUnixNanoToDate(rsp.getDate())

  let items = rsp.getItemsList().filter(item => item.getFlat() > 0)

  graphData.dates.push(date)
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

export const MyEcharts5: React.FC = () => {
  const theme = useTheme()
  const ref = useRef<any>()
  const [graphData, setGraphData] = useState<GraphData>({ lineTable: {}, dates: [] })
  const [freezeTooltip, setFreezeTooltip] = useAtom(freezeTooltipAtom)
  const [showTooltip, setShowTooltip] = useAtom(showTooltipAtom)
  const [inuseSpacePref, setInuseSpacePrefAtom] = useAtom(inuseSpacePrefAtom)
  const setTotal = (total: boolean) => setInuseSpacePrefAtom({ ...inuseSpacePref, total: total })
  const setSmooth = (smooth: boolean) => setInuseSpacePrefAtom({ ...inuseSpacePref, smooth: smooth })
  const setLine = (line: boolean) => setInuseSpacePrefAtom({ ...inuseSpacePref, line: line })

  useEffect(() => {
    if (ref.current) {
      const instance = ref.current.getEchartsInstance()
      instance.group = 'group1'
      connect('group1')
    }
  }, [])

  useEffect(() => {
    const req = new FullMetricsRequest().setPerfid('abc')
    let stream: ClientReadableStream<IncrementalMetricsStreamResponse> | undefined

    // metricServerClient.fullMetrics(req).then(r => console.debug('fullMetricsResponse', r.getTodo()))
    let fullMetricsRsp = metricClient.fullMetrics(req, {}, function (err, response) {
      if (err) {
        console.error(err.code)
        console.error(err.message)
      } else {
        console.log('full resp:', response.getTodo())
        const req = new IncrementalMetricsRequest().setPerfid('abc')

        stream = metricClient.incrementalMetrics(req)

        stream.on('data', function (message) {
          console.debug('stream received data', message)

          setGraphData(prevData => {
            return appendGraphData(prevData, message)
          })
        })
        stream.on('status', function (status) {
          console.log(status.code)
          console.log(status.details)
          console.log(status.metadata)
        })
        stream.on('end', function () {})
      }
    })

    return () => {
      fullMetricsRsp.cancel()
      stream?.cancel()
      console.log('stream cancelled')
    }
  }, [])

  return (
    <section
      className="h-full w-full"
      role="presentation"
      onClick={() => {
        setFreezeTooltip(false)
        setShowTooltip(false)
        setTimeout(() => setShowTooltip(true), 1000)
      }}
    >
      <div
        className="flex gap-10 items-center"
        role="presentation"
        onClick={event => {
          setFreezeTooltip(true)
          setShowTooltip(true)
          event.stopPropagation()
        }}
      >
        {/*@ts-ignore*/}
        <ReactECharts
          key={inuseSpacePref.total}
          // key={`${total}+${showTooltip}`}
          className="w-full"
          option={run(
            graphData,
            theme.resolvedTheme == 'dark',
            inuseSpacePref.total,
            inuseSpacePref.smooth,
            inuseSpacePref.line,
            freezeTooltip,
            showTooltip
          )}
          theme={theme.resolvedTheme == 'dark' ? 'dark' : ''}
        />
        <div className={'flex flex-col gap-1'}>
          <Checkbox isSelected={inuseSpacePref.total} size="sm" value="Total" onValueChange={setTotal}>
            Total
          </Checkbox>
          <Checkbox
            className="whitespace-nowrap"
            isSelected={inuseSpacePref.line}
            size="sm"
            value="Line"
            onValueChange={setLine}
          >
            Line of Code
          </Checkbox>
          <Checkbox isSelected={inuseSpacePref.smooth} size="sm" value="Smooth" onValueChange={setSmooth}>
            Smooth
          </Checkbox>
        </div>

        <div className="flex gap-3">
          {/*<Switch isSelected={total} size="sm" onValueChange={setTotal}>*/}
          {/*  Total*/}
          {/*</Switch>*/}
          {/*<Switch isSelected={line} size="sm" onValueChange={setLine}>*/}
          {/*  Line*/}
          {/*</Switch>*/}
          {/*<Switch isSelected={smooth} size="sm" onValueChange={setSmooth}>*/}
          {/*  Smooth*/}
          {/*</Switch>*/}

          {/*<Dropdown>*/}
          {/*  <DropdownTrigger>*/}
          {/*    <Button size={'sm'} variant="light">*/}
          {/*      ...*/}
          {/*    </Button>*/}
          {/*  </DropdownTrigger>*/}
          {/*  <DropdownMenu aria-label="Static Actions">*/}
          {/*    <DropdownItem key="smotth">*/}
          {/*      <Switch isSelected={smooth} size="sm" onValueChange={setSmooth}>*/}
          {/*        Smooth*/}
          {/*      </Switch>*/}
          {/*    </DropdownItem>*/}
          {/*  </DropdownMenu>*/}
          {/*</Dropdown>*/}
        </div>
      </div>
    </section>
  )
}

function run(
  graphData: GraphData,
  isDark: boolean,
  total: boolean,
  smooth: boolean,
  showLine: boolean,
  freezeTooltip: boolean,
  showTooltip: boolean
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

  return {
    animationDuration: 100,
    // legend: {
    //   type: 'plain',
    //   calculable: true,
    //   bottom: 0,
    // },
    dataset: dataset,
    title: {
      text: 'inuse_space',
    },
    tooltip: showTooltip
      ? {
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
              ` <span class="text-default-600 pb-1 font-mono cursor-pointer select-text">${params[0].axisValueLabel}</span>` +
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

            return output + '</div>'
          },

          valueFormatter: function (value: number | string, dataIndex: number): string | undefined {
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
          position: function (point: Array<number>, params: any | Array<any>, dom: HTMLElement, rect: any, size: any) {
            if (point[0] + dom.clientWidth + 20 < size.viewSize[0]) {
              // place tooltip at right bottom of the pointer
              return [point[0] + 20, point[1] + 30]
            } else {
              // if tooltip will be outside the graph, place it at left bottom of the pointer
              return [point[0] - dom.clientWidth - 20, point[1] + 30]
            }
          },
        }
      : {},
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
      {
        type: 'slider',
        show: true,
        showDataShadow: false,
        yAxisIndex: [0],
        left: '91%',
        start: 0,
        end: 100,
        labelFormatter: function (value: number) {
          return isNaN(value) ? '' : prettyBytes(value)
        },
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: 'time',
      nameLocation: 'middle',
    },
    yAxis: {
      // name: 'inuse_space',
      axisLabel: {
        formatter: function (value: number) {
          return prettyBytes(value)
        },
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
      // right: 0,
      left: 50,
    },
    series: seriesList,
  }
}