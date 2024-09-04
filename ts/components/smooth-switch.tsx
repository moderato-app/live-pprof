'use client'

import { FC } from 'react'
import { Switch, SwitchProps } from '@nextui-org/switch'
import { useSnapshot } from 'valtio/react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { useIsSSR } from '@react-aria/ssr'

import { graphPrefsState } from '@/components/state/pref-state'
import { CurveIcon } from '@/components/icons'

export interface ThemeSwitchProps {
  className?: string
  classNames?: SwitchProps['classNames']
}

export const SmoothSwitch: FC<ThemeSwitchProps> = ({ className, classNames }) => {
  const { smooth } = useSnapshot(graphPrefsState)
  const ssr = useIsSSR()
  if (ssr) {
    return null
  }

  return (
    <div className="flex flex-col gap-0.5 pl-3 py-1 bg-default-100 rounded-lg">
      <p className="text-xs text-default-600">Smooth Chart Lines</p>
      <Switch
        className={clsx('', className, classNames?.base)}
        color="success"
        endContent={<Icon className="w-14 h-14" icon="mynaui:chart-line" />}
        isSelected={smooth}
        size={'sm'}
        startContent={<CurveIcon size={12} />}
        onValueChange={v => {
          graphPrefsState.smooth = v
        }}
      />
    </div>
  )
}
