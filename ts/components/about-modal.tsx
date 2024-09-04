'use client'

import { FC, useEffect } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'
import { AnchorIcon } from '@nextui-org/shared-icons'

import { uiState } from '@/components/state/ui-state'

export const AboutModal: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    uiState.openAboutModal = onOpen
    return () => {
      uiState.openAboutModal = () => {}
    }
  }, [])

  return (
    <Modal hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">About</ModalHeader>
            <ModalBody>
              <li>
                <Link
                  isExternal
                  showAnchorIcon
                  anchorIcon={<AnchorIcon />}
                  color={'foreground'}
                  href="https://stackoverflow.com/a/56882137"
                >
                  The charts display flat pprof data, not cumulative
                </Link>
              </li>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
