'use client'
import { Button } from '@nextui-org/button'
import { Icon } from '@iconify/react'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox'
import { Divider } from '@nextui-org/divider'
import { useDisclosure } from '@nextui-org/modal'
import { useSnapshot } from 'valtio/react'

import { PprofType } from '@/components/hooks/use-graph-data'
import { useGraphPrefSnap } from '@/components/hooks/use-graph-pref-snap'
import { myEmitter } from '@/components/state/emitter'
import { RetainedSamples } from '@/components/retained-samples'
import { SmoothSwitch } from '@/components/smooth-switch'
import { uiState } from '@/components/state/ui-state'
import { SampleInterval } from '@/components/sample-interval'

const iconSize = 20

export const HomeMenu = () => {
  const [cpu, heap, allocs, goroutine] = [
    useGraphPrefSnap(PprofType.cpu),
    useGraphPrefSnap(PprofType.heap),
    useGraphPrefSnap(PprofType.allocs),
    useGraphPrefSnap(PprofType.goroutine),
  ]

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const { openAboutModal } = useSnapshot(uiState)
  return (
    <Popover
      shouldCloseOnBlur
      showArrow
      triggerScaleOnOpen
      backdrop={'opaque'}
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger>
        <Button isIconOnly variant="light" onClick={onOpen}>
          <Icon icon="charm:menu-meatball" />
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Static Actions">
        <div className="flex flex-col mt-2 w-full">
          <div className="grid grid-cols-3 gap-2">
            <RetainedSamples />
            <SampleInterval />
            <SmoothSwitch />
          </div>
        </div>
        <Divider className="my-2" />
        <Listbox>
          <ListboxSection showDivider>
            {[cpu, heap, allocs, goroutine].map((snap, index) => (
              <ListboxItem
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
                onClick={snap.toggleEnabled}
              >
                {snap.pprofType}
              </ListboxItem>
            ))}
          </ListboxSection>
          <ListboxSection>
            <ListboxItem
              key="clear data"
              showDivider
              className="text-danger"
              color="danger"
              description="Clear data from all charts"
              startContent={<Icon color={'danger'} height={iconSize} icon="heroicons:trash" width={iconSize} />}
              onClick={() => myEmitter.emit('clearData', undefined)}
            >
              Clear Data
            </ListboxItem>
          </ListboxSection>
          <ListboxSection>
            <ListboxItem
              key="about"
              color="default"
              description=""
              startContent={<Icon height={iconSize} icon="octicon:info-16" width={iconSize} />}
              onClick={() => {
                onClose()
                openAboutModal()
              }}
            >
              About
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      </PopoverContent>
    </Popover>
  )
}
