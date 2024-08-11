'use client'

import React, { useEffect, useState } from 'react'
import { Chart } from 'react-charts'
import { useTheme } from 'next-themes'

import { metricClient } from '@/components/client/metrics'
import { FullMetricsRequest, IncrementalMetricsRequest } from '@/components/api/api_pb'

const mockData: () => { label: string; data: { secondary: number; radius: number; primary: Date }[] }[] = () => {
  let startDate = new Date()

  startDate.setUTCHours(0)
  startDate.setUTCMinutes(0)
  startDate.setUTCSeconds(0)
  startDate.setUTCMilliseconds(0)

  return [...new Array(5)].map((_, lineNumber) => {
    const dataArray = [...new Array(50)].map((_, i) => {
      const x = new Date(startDate.getTime() + 1000 * i)
      const y = Math.random() * 500

      return {
        primary: x,
        secondary: y,
        radius: 0,
      }
    })

    return {
      label: `Line ${lineNumber}`,
      data: dataArray,
    }
  })
}

function mockAppendData(
  old: {
    label: string
    data: {
      secondary: number
      radius: number
      primary: Date
    }[]
  }[]
) {
  // get latest date
  const date = old
    .map(it => it.data[it.data.length - 1].primary)
    .sort()
    .reverse()[0]

  return old.map(line => {
    let last = line.data.findLast(_ => true)!

    const newDate = new Date(date.getTime() + 1000)
    const y = last.secondary + Math.random() * 40 - 20

    if (Math.random() < 0.5) {
      return {
        label: line.label,
        data: [
          ...line.data,
          {
            secondary: y,
            radius: 0,
            primary: newDate,
          },
        ],
      }
    } else {
      return {
        label: line.label,
        data: line.data,
      }
    }
  })
}

export default function MyChart() {
  const theme = useTheme()

  const [data, setData] = useState(mockData())

  const [primaryCursorValue, setPrimaryCursorValue] = React.useState()
  const [secondaryCursorValue, setSecondaryCursorValue] = React.useState()

  const [isDark, setIsDark] = useState(false)

  // Chart ignores options.dark and stays 'light' theme on initialization. This callback ensures Chart respects the theme later on.
  useEffect(() => {
    setTimeout(() => {
      setIsDark(theme.resolvedTheme == 'dark')
    })
  }, [theme])

  // useEffect(() => {
  //   const t = setInterval(() => {
  //     let newData = mockAppendData(data)
  //
  //     setData(newData)
  //   }, 1000)
  //
  //   return () => clearTimeout(t)
  // }, [data])

  useEffect(() => {
    const req = new FullMetricsRequest().setPerfid('abc')

    // metricServerClient.fullMetrics(req).then(r => console.debug('fullMetricsResponse', r.getTodo()))
    metricClient.fullMetrics(req, {}, function (err, response) {
      if (err) {
        console.error(err.code)
        console.error(err.message)
      } else {
        console.log('full resp:', response.getTodo())
        const req = new IncrementalMetricsRequest().setPerfid('abc')
        const stream = metricClient.incrementalMetrics(req)

        stream.on('data', function (message) {
          console.log('stream received data', message.getTodo())
        })
        stream.on('status', function (status) {
          console.log(status.code)
          console.log(status.details)
          console.log(status.metadata)
        })
        stream.on('end', function () {})
      }
    })
  }, [])

  return (
    <div className={'flex flex-col justify-around h-full'}>
      {[...new Array(2)].map((_, i) => (
        <div key={i} className="w-full h-[45%]">
          <Chart
            key={i}
            options={{
              data: data,
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
                  getValue: datum => datum.secondary,
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
