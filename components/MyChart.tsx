'use client'

import React, { useCallback, useState } from 'react'
import { Chart } from 'react-charts'
import { useTheme } from 'next-themes'

import useDemoConfig from '@/components/useDemoConfig'

export default function MyChart() {
  const theme = useTheme()
  const [{ datumCount, activeSeriesIndex, liveData, showPoints, memoizeSeries }, setState] = React.useState({
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

  const [isDark, setIsDark] = useState(false)

  // Chart ignores options.dark and stays 'light' theme on initialization. This callback ensures Chart respects the theme later on.
  useCallback(() => {
    return setTimeout(() => {
      setIsDark(theme.resolvedTheme == 'dark')
    })
  }, [theme])()

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
      <div className={'flex flex-col justify-around h-full'}>
        {[...new Array(2)].map((_, i) => (
          <div key={i} className="w-full h-[45%]">
            <Chart
              key={i}
              options={{
                data,
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
                    showDatumElements: showPoints,
                    show: true,
                  },
                ],
                memoizeSeries,
                getSeriesStyle: series => ({
                  opacity: activeSeriesIndex > -1 ? (series.index === activeSeriesIndex ? 1 : 0.1) : 1,
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
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
