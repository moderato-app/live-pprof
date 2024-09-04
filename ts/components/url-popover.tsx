/* eslint-disable jsx-a11y/no-autofocus */
'use client'

import { Input } from '@nextui-org/input'
import React, { useMemo } from 'react'
import { useIsSSR } from '@react-aria/ssr'
import { Chip } from '@nextui-org/chip'

import { useURL } from '@/components/hooks/use-url'
import { UrlDetect } from '@/components/url-detect'
import { Link } from '@nextui-org/link'
import { Icon } from '@iconify/react'
import { Tooltip } from '@nextui-org/tooltip'

export const UrlPopover = () => {
  const { url, input, setInput } = useURL()

  const isInvalid = useMemo(() => {
    return url instanceof Error
  }, [url])

  if (useIsSSR()) {
    return null
  }

  const placeholder = '8300, localhost:8300 or http://localhost:8300/debug/pprof'
  return (
    <div className="flex flex-col justify-start items-start  max-w-[80vw] max-h-[80vh]">
      {/* to provide auto inferred width for <Input> */}
      <div className="text-nowrap z-10 opacity-0 select-none h-[1px]">{placeholder}6chars6chars</div>
      <Input
        fullWidth
        isClearable
        autoFocus={true}
        className={'w-full max-w-full'}
        color={isInvalid ? 'danger' : 'success'}
        errorMessage={url instanceof Error ? url.message : undefined}
        isInvalid={isInvalid}
        placeholder={placeholder}
        type="url"
        value={input}
        variant="bordered"
        onValueChange={setInput}
      />
      {typeof url === 'string' && (
        <div className="flex">
          <Chip className={'text-default-500'} size={'sm'} variant={'light'}>
            {url}
          </Chip>
          <Tooltip className="bg-default-200" closeDelay={0} content={`open ${url}`} delay={500}>
            <Link
              isExternal
              href={url}
              showAnchorIcon
              className={'text-default-500'}
              anchorIcon={<Icon icon="solar:round-arrow-right-bold" />}
            ></Link>
          </Tooltip>
        </div>
      )}
      {typeof url === 'string' && <UrlDetect url={url} />}
    </div>
  )
}
