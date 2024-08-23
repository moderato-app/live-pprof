'use client'

import { Input } from '@nextui-org/input'
import React, { useMemo } from 'react'

import { useURL } from '@/components/hooks/use-url'
import { UrlDetect } from '@/components/url-detect'

export const UrlInputPopover = () => {
  const { url, input, setInput } = useURL()

  const isInvalid = useMemo(() => {
    return url instanceof Error
  }, [url])

  const placeholder = '8080, localhost:8080 or http://localhost:8080/debug/pprof'
  return (
    <div className="flex flex-col justify-start items-start">
      {/* to provide auto inferred width for <Input> */}
      <div className="text-nowrap z-10 opacity-0 select-none h-[1px]">{placeholder}6chars6chars</div>

      <Input
        fullWidth
        isClearable
        className={'w-full max-w-full'}
        color={isInvalid ? 'danger' : 'success'}
        errorMessage={url instanceof Error ? url.message : undefined}
        isInvalid={isInvalid}
        placeholder={placeholder}
        type="email"
        value={input}
        variant="bordered"
        onValueChange={setInput}
      />
      {typeof url === 'string' && <UrlDetect url={url} />}
      <div className="text-nowrap z-10 opacity-0 select-none h-[1px]">{placeholder}6chars</div>
    </div>
  )
}
