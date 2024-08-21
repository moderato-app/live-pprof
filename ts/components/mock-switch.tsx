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

export const MockSwitch: FC<ThemeSwitchProps> = ({ className, classNames }) => {
  const { mock } = useSnapshot(graphPrefsState)
  const ssr = useIsSSR()
  if (ssr) {
    return null
  }

  return (
    <Tooltip closeDelay={0} content={`Use Mock Data`} delay={500}>
      <Switch
        className={clsx('', className, classNames?.base)}
        color="secondary"
        isSelected={mock}
        size={'sm'}
        startContent={<Icon className="" icon="ph:mask-happy-fill" />}
        onValueChange={v => {
          graphPrefsState.mock = v
        }}
      />
    </Tooltip>
  )
}
