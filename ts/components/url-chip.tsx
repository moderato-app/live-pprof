'use client'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Chip } from '@nextui-org/chip'

import { UrlInputPopover } from '@/components/url-input-popover'
import { useURL } from '@/components/hooks/use-url'

export default function UrlChip() {
  const { url } = useURL()

  return (
    <div className="flex flex-wrap gap-4">
      <Popover backdrop={'blur'} offset={10} placement="bottom">
        <PopoverTrigger>
          {url instanceof Error ? (
            <Chip className="cursor-pointer " color={'warning'} variant={'light'}>
              {url.message}
            </Chip>
          ) : (
            <Chip className="cursor-pointer bg-foreground-100">{url}</Chip>
          )}
        </PopoverTrigger>
        <PopoverContent className="p-2 bg-foreground-100 ">
          <UrlInputPopover />
        </PopoverContent>
      </Popover>
    </div>
  )
}
