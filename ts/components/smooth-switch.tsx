'use client'

import { FC } from 'react'
import { Switch, SwitchProps } from '@nextui-org/switch'
import { useSnapshot } from 'valtio/react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { useIsSSR } from '@react-aria/ssr'
import { Tooltip } from '@nextui-org/tooltip'

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
    <Tooltip closeDelay={0} content={`Smooth Chart Lines`} delay={500}>
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
    </Tooltip>
  )
}
