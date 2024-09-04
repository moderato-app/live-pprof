'use client'

import { Input } from '@nextui-org/input'
import React, { useEffect, useState } from 'react'
import { useIsSSR } from '@react-aria/ssr'
import { useSnapshot } from 'valtio/react'

import { graphPrefsState } from '@/components/state/pref-state'

export const RetainedSamples = () => {
  const { retainedSamples } = useSnapshot(graphPrefsState)

  let [input, setInput] = useState(`${retainedSamples}`)

  useEffect(() => {
    if (!isInvalid()) {
      graphPrefsState.retainedSamples = Number(input)
    }
  }, [input])

  const isInvalid = () => Number.isNaN(Number(input)) || Number(input) < 1

  if (useIsSSR()) {
    return null
  }

  return (
    <Input
      className="max-w-[150px]"
      color={isInvalid() ? 'danger' : 'default'}
      defaultValue={'120'}
      isInvalid={isInvalid()}
      label="Retained Samples"
      size={'sm'}
      type={'number'}
      value={`${input}`}
      variant="flat"
      onValueChange={setInput}
    />
  )
}
