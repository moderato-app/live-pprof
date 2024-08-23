'use client'

import React, { FC } from 'react'
import { Chip } from '@nextui-org/chip'

interface UrlDetectProps {
  url: string
}

export const UrlDetect: FC<UrlDetectProps> = ({ url }) => {
  return (
    <div className={'flex gap-1'}>
      <Chip className={'text-default-500'} variant={'light'}>
        {url}
      </Chip>
      <div />
    </div>
  )
}
