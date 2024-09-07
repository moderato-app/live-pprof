"use client"

import React, { useCallback } from "react"
import { useSnapshot } from "valtio/react"
import { Tooltip } from "@nextui-org/tooltip"
import { Button } from "@nextui-org/button"
import { Icon } from "@iconify/react"

import { recorderState } from "@/components/state/recorder-state"
import { useURL } from "@/components/hooks/use-url"

export const RecorderButton = () => {
  const { isRecording } = useSnapshot(recorderState)
  const { url } = useURL()
  const tooltipInfo = isRecording ? "Stop" : "Start"

  const start = useCallback(() => {
    recorderState.isRecording = true
  }, [])

  const stop = useCallback(() => {
    recorderState.isRecording = false
  }, [])

  return (
    <Tooltip className="bg-default-200" closeDelay={0} content={tooltipInfo} delay={500}>
      {isRecording ? (
        <Button isIconOnly aria-label={tooltipInfo} className="" variant={"light"} onClick={stop}>
          <div className="flex relative">
            <Icon className="w-6 h-6 text-default-500 dark:text-default-foreground" icon="solar:stop-bold" />
            <Icon
              className="absolute animate-[ping_3s_infinite] w-6 h-6 text-default-500 dark:text-default-foreground"
              icon="solar:stop-bold"
            />
          </div>
        </Button>
      ) : (
        <Button
          isIconOnly
          aria-label={tooltipInfo}
          className="text-default-500 dark:text-default-foreground"
          isDisabled={url instanceof Error}
          variant={"light"}
          onClick={start}
        >
          <Icon className="w-6 h-6" icon="solar:play-bold" />
        </Button>
      )}
    </Tooltip>
  )
}
