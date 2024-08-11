'use client'

import React from 'react'
import { AxisOptions, Chart } from 'react-charts'

import useDemoConfig from '@/components/useDemoConfig'

export default function StressTest() {
  const [
    { datumCount, activeSeriesIndex, liveData, showPoints, memoizeSeries },
    setState,
  ] = React.useState({
    activeSeriesIndex: -1,
    datumCount: 50,
    liveData: false,
    showPoints: true,
    memoizeSeries: false,
  })

  const { data, randomizeData } = useDemoConfig({
    series: 5,
    datums: datumCount,
    dataType: 'time',
  })

  const [primaryCursorValue, setPrimaryCursorValue] = React.useState()
  const [secondaryCursorValue, setSecondaryCursorValue] = React.useState()

  const primaryAxis = React.useMemo<
    AxisOptions<(typeof data)[number]['data'][number]>
  >(
    () => ({
      getValue: datum => datum.primary as unknown as Date,
      show: true,
    }),
    [true]
  )

  const secondaryAxes = React.useMemo<
    AxisOptions<(typeof data)[number]['data'][number]>[]
  >(
    () => [
      {
        getValue: datum => datum.secondary,
        showDatumElements: showPoints,
        show: true,
      },
    ],
    [showPoints]
  )

  return (
    <div className={'flex-col gap-2 w-full justify-center items-center h-full'}>
      <div className={'flex gap-2'}>
        <label>
          DatumCount Count:{' '}
          <input
            min="1"
            type="number"
            value={datumCount}
            onChange={e => {
              e.persist()
              setState(old => ({
                ...old,
                datumCount: parseInt(e.target.value),
              }))
            }}
          />
        </label>
        <label>
          Show Points:{' '}
          <input
            checked={showPoints}
            type="checkbox"
            onChange={e => {
              e.persist()
              setState(old => ({ ...old, showPoints: !!e.target.checked }))
            }}
          />
        </label>
        <label>
          Memoize Series:{' '}
          <input
            checked={memoizeSeries}
            type="checkbox"
            onChange={e => {
              e.persist()
              setState(old => ({ ...old, memoizeSeries: !!e.target.checked }))
            }}
          />
        </label>
        <label>
          Live Data:{' '}
          <input
            checked={liveData}
            type="checkbox"
            onChange={e => {
              e.persist()
              setState(old => ({ ...old, liveData: !!e.target.checked }))
            }}
          />
        </label>
        <button onClick={randomizeData}>Randomize Data</button>
      </div>
      {[...new Array(2)].map((d, i) => (
        <div key={i} className="w-full h-[50%]">
          <Chart
            key={i}
            options={{
              data,
              padding: { left: 10, top: 10, right: 10, bottom: 10 },
              primaryAxis,
              secondaryAxes,
              memoizeSeries,
              getSeriesStyle: series => ({
                opacity:
                  activeSeriesIndex > -1
                    ? series.index === activeSeriesIndex
                      ? 1
                      : 0.1
                    : 1,
              }),
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
              onFocusDatum: datum => {
                setState(old => ({
                  ...old,
                  activeSeriesIndex: -1,
                }))
              },
            }}
          />
        </div>
      ))}
    </div>
  )
}
