'use client'
import { proxy } from 'valtio'
import dayjs, { Dayjs } from 'dayjs'

export type RecordingError = {
  date: Date
  msg: string
}

export type Recorder = {
  basicURL: string
  totalMillis: number

  isRecording: boolean
  lastStarted: Dayjs
  currentMillis: number

  errors: RecordingError[]
}

const newRecorder = (): Recorder => ({
  basicURL: 'http://localhost:8080/debug/pprof',
  totalMillis: 0,

  isRecording: false,
  lastStarted: dayjs(),
  currentMillis: 0,
  errors: [],
})

export const recorderState = proxy<Recorder>(newRecorder())
