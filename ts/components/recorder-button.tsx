'use client'

import React, { useCallback } from 'react'
import { useSnapshot } from 'valtio/react'
import { Tooltip } from '@nextui-org/tooltip'
import { Button } from '@nextui-org/button'
import { Icon } from '@iconify/react'

import { recorderState } from '@/components/state/recorder-state'

export const RecorderButton = () => {
  const { isRecording } = useSnapshot(recorderState)
  const tooltipInfo = isRecording ? 'Stop' : 'Start'

  const start = useCallback(() => {
    recorderState.isRecording = true
  }, [])

  const stop = useCallback(() => {
    recorderState.isRecording = false
  }, [])

  return (
    <Tooltip closeDelay={0} content={tooltipInfo} delay={500}>
      {isRecording ? (
        <Button
          isIconOnly
          aria-label={tooltipInfo}
          className="text-default-600 dark:text-default-foreground"
          variant={'light'}
          onPress={stop}
        >
          <Icon className="w-6 h-6" icon="solar:stop-bold" />
        </Button>
      ) : (
        <Button
          isIconOnly
          aria-label={tooltipInfo}
          className="text-default-600 dark:text-default-foreground"
          variant={'light'}
          onPress={start}
        >
          <Icon className="w-6 h-6" icon="solar:play-bold" />
        </Button>
      )}
    </Tooltip>
  )
}
