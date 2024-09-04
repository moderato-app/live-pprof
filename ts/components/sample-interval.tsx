'use client'

import { Input } from '@nextui-org/input'
import React, { useEffect, useState } from 'react'
import { useIsSSR } from '@react-aria/ssr'
import { useSnapshot } from 'valtio/react'

import { graphPrefsState } from '@/components/state/pref-state'

export const SampleInterval = () => {
  const { sampleInterval } = useSnapshot(graphPrefsState)

  let [input, setInput] = useState(`${sampleInterval}`)

  useEffect(() => {
    if (!isInvalid()) {
      graphPrefsState.sampleInterval = Number(input)
    }
  }, [input])

  const isInvalid = () => Number.isNaN(Number(input)) || Number(input) < 100

  if (useIsSSR()) {
    return null
  }

  return (
    <Input
      className="max-w-[150px]"
      color={isInvalid() ? 'danger' : 'default'}
      defaultValue={'1000'}
      endContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-default-400 text-small flex">ms</span>
        </div>
      }
      isInvalid={isInvalid()}
      label="Sample Interval"
      size={'sm'}
      type={'number'}
      value={`${input}`}
      variant="flat"
      onValueChange={setInput}
    />
  )
}
