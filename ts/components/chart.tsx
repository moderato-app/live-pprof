'use client'

import React, { useEffect, useState } from 'react'
import { Chart } from 'react-charts'
import { useTheme } from 'next-themes'
import { ClientReadableStream } from 'grpc-web'
import prettyBytes from 'pretty-bytes'

import { metricClient } from '@/components/client/metrics'
import {
  FullMetricsRequest,
  IncrementalMetricsRequest,
  IncrementalMetricsStreamResponse,
} from '@/components/api/api_pb'
import { appendData, initLines, Line } from '@/components/chat-data'

export default function MyChart() {
  const [lines, setLines] = useState<Line[]>(initLines)

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

          setLines(prevData => {
            return appendData(prevData, message)
          })
        })
        stream.on('status', function (status) {
          console.debug(status.code)
          console.debug(status.details)
          console.debug(status.metadata)
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

  return <div className={'flex flex-col justify-around h-full'}>{lines ? <Charts lines={lines} /> : null}</div>
}

interface Props {
  lines: Line[]
}

export const Charts: React.FC<Props> = ({ lines }) => {
  const theme = useTheme()

  const [primaryCursorValue, setPrimaryCursorValue] = React.useState()
  const [secondaryCursorValue, setSecondaryCursorValue] = React.useState()

  const [isDark, setIsDark] = useState(false)

  // Chart ignores options.dark and stays 'light' theme on initialization. This callback ensures Chart respects the theme later on.
  useEffect(() => {
    setTimeout(() => {
      setIsDark(theme.resolvedTheme == 'dark')
    })
  }, [theme])

  return (
    <div className={'flex flex-col justify-around h-full'}>
      {[...new Array(2)].map((_, i) => (
        <div key={i} className="w-full h-[45%]">
          <Chart
            key={i}
            options={{
              data: lines,
              // to avoid visual clutter
              initialWidth: 0,
              initialHeight: 0,
              dark: isDark,
              padding: 10,
              primaryAxis: {
                getValue: datum => datum.primary as unknown as Date,
                show: true,
              },
              secondaryAxes: [
                {
                  getValue: datum => datum.secondary as number,
                  formatters: {
                    scale: (value?: number) => `${prettyBytes(value ?? 0)}`,
                  },
                  showDatumElements: true,
                  show: true,
                },
              ],
              memoizeSeries: false,
              primaryCursor: {
                value: primaryCursorValue,
                onChange: value => {
                  setPrimaryCursorValue(value)
                },
              },
              secondaryCursor: {
                value: secondaryCursorValue,
                onChange: value => {
                  setSecondaryCursorValue(value)
                },
              },
            }}
          />
        </div>
      ))}
    </div>
  )
}
