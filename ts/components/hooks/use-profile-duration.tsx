"use client"

import { useSnapshot } from "valtio/react"
import { floor } from "lodash"

import { graphPrefsState } from "@/components/state/pref-state"

export const useProfileDuration = (): { seconds: number } => {
  const { sampleInterval } = useSnapshot(graphPrefsState)

  const sec = sampleInterval > 1000 ? floor(sampleInterval / 1000) : 1

  return { seconds: sec }
}
