export const convertUnixNanoToDate = (unixNano: number): Date => {
  const milliseconds = Number(unixNano / 1_000_000) // Convert to milliseconds

  return new Date(milliseconds)
}

import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'

dayjs.extend(duration)

// Format milliseconds into "2days 8hours 11:20"
export const formatMillis = (millis: number): string => {
  const durationObj = dayjs.duration(millis)

  const minutes = durationObj.minutes().toString().padStart(2, '0')
  const seconds = durationObj.seconds().toString().padStart(2, '0')

  let duration = `${minutes}:${seconds}`

  if (durationObj.hours() > 0) {
    const unit = durationObj.hours() === 1 ? 'hour' : 'hours'
    duration = `${durationObj.hours()} ${unit} ${duration}`
  }
  if (durationObj.days() > 0) {
    const unit = durationObj.days() === 1 ? 'day' : 'days'
    duration = `${durationObj.days()} ${unit} ${duration}`
  }
  return duration
}

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
