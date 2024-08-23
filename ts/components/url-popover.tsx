'use client'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Chip } from '@nextui-org/chip'

import { URLInputBox } from '@/components/url-input-box'

export default function UrlPopover() {
  const content = (
    <PopoverContent className="p-2 bg-foreground-100">
      <URLInputBox />
    </PopoverContent>
  )

  return (
    <div className="flex flex-wrap gap-4">
      <Popover showArrow backdrop={'blur'} offset={10} placement="bottom">
        <PopoverTrigger>
          <Chip className="cursor-pointer">URL</Chip>
        </PopoverTrigger>
        {content}
      </Popover>
    </div>
  )
}
