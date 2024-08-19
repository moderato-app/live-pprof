import { Checkbox } from '@nextui-org/checkbox'
import React from 'react'
import { WritableAtom } from 'jotai/vanilla/atom'
import { useAtom } from 'jotai/index'

import { Pref } from '@/components/atom/shared-atom'

export type ChartPrefProps = {
  pref: WritableAtom<Pref, any, void>
}

export const ChartPref: React.FC<ChartPrefProps> = ({ pref }) => {
  const [inuseSpacePref, setInuseSpacePrefAtom] = useAtom(pref)

  const setTotal = (total: boolean) => setInuseSpacePrefAtom({ ...inuseSpacePref, total: total })
  const setSmooth = (smooth: boolean) => setInuseSpacePrefAtom({ ...inuseSpacePref, smooth: smooth })
  const setLine = (line: boolean) => setInuseSpacePrefAtom({ ...inuseSpacePref, line: line })

  return (
    <div className={'flex flex-col gap-1'}>
      <Checkbox isSelected={inuseSpacePref.total} size="sm" value="Total" onValueChange={setTotal}>
        Total
      </Checkbox>
      <Checkbox
        className="whitespace-nowrap"
        isSelected={inuseSpacePref.line}
        size="sm"
        value="Line"
        onValueChange={setLine}
      >
        Line of Code
      </Checkbox>
      <Checkbox isSelected={inuseSpacePref.smooth} size="sm" value="Smooth" onValueChange={setSmooth}>
        Smooth
      </Checkbox>
    </div>
  )
}
