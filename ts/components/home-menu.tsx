'use client'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown'
import { Button } from '@nextui-org/button'
import { Icon } from '@iconify/react'
import React from 'react'

import { PprofType } from '@/components/hooks/use-graph-data'
import { useGraphPrefSnap } from '@/components/hooks/use-graph-pref-snap'
import { myEmitter } from '@/components/state/emitter'

const iconSize = 20

export const HomeMenu = () => {
  const [cpu, heap, allocs, goroutine] = [
    useGraphPrefSnap(PprofType.cpu),
    useGraphPrefSnap(PprofType.heap),
    useGraphPrefSnap(PprofType.allocs),
    useGraphPrefSnap(PprofType.goroutine),
  ]

  return (
    <Dropdown backdrop="opaque" closeOnSelect={false}>
      <DropdownTrigger>
        <Button isIconOnly variant="light">
          <Icon icon="charm:menu-meatball" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownSection showDivider title="">
          {[cpu, heap, allocs, goroutine].map((snap, index) => (
            <DropdownItem
              key={index}
              className="w-full"
              description={snap.description}
              endContent={
                <Icon
                  className={'transition-opacity duration-200 text-default-500'}
                  height={iconSize}
                  icon="mingcute:check-fill"
                  opacity={snap.prefSnap.enabled ? 1 : 0}
                  width={iconSize}
                />
              }
              startContent={<Icon height={iconSize} icon={snap.iconName} width={iconSize} />}
              onPress={snap.toggleEnabled}
            >
              {snap.pprofType}
            </DropdownItem>
          ))}
        </DropdownSection>
        <DropdownSection title="">
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            description="Remove data of all graphs"
            startContent={<Icon color={'danger'} height={iconSize} icon="heroicons:trash" width={iconSize} />}
            onPress={() => myEmitter.emit('clearData', undefined)}
          >
            Clean Data
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
