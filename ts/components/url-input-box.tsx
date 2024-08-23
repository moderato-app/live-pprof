'use client'

import { Input } from '@nextui-org/input'
import React, { useMemo, useState } from 'react'

export const URLInputBox = () => {
  const [value, setValue] = useState('junior2nextui.org')

  const validateEmail = (value: string): boolean => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(value)

  const isInvalid = useMemo(() => {
    if (value === '') return false

    return !validateEmail(value)
  }, [value])

  return (
    <Input
      className="max-w-xs"
      color={isInvalid ? 'danger' : 'success'}
      errorMessage="Please enter a valid email"
      isInvalid={isInvalid}
      placeholder="e.g., 8080, localhost:8080 or http://localhost:8080/debug/pprof"
      type="email"
      value={value}
      variant="bordered"
      onValueChange={setValue}
    />
  )
}
