'use client'

import React, { FC, useEffect } from 'react'
import { useSnapshot } from 'valtio/react'
import dayjs from 'dayjs'

import { recorderState } from '@/components/state/recorder-state'
import { formatMillis } from '@/components/util/util'

export const RecorderTime: FC = () => {
  const { isRecording, currentMillis, totalMillis } = useSnapshot(recorderState)

  useEffect(() => {
    let t: NodeJS.Timeout
    if (isRecording) {
      recorderState.lastStarted = dayjs()
      t = setInterval(() => {
        recorderState.currentMillis = dayjs().diff(recorderState.lastStarted, 'milliseconds')
      }, 1000)
    } else {
      recorderState.totalMillis += recorderState.currentMillis
      recorderState.currentMillis = 0
    }
    return () => t && clearInterval(t)
  }, [isRecording])

  const millis = currentMillis + totalMillis

  if (millis == 0 && !isRecording) return null

  return <div className={'font-mono'}>{formatMillis(millis)}</div>
}
