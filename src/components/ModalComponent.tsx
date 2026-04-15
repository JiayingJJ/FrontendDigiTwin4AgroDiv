import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
type Props = {
    clickOnSaveBtn: () => void;
    clickOnCancelBtn: () => void;
}
const ModalComponent = ({ clickOnSaveBtn, clickOnCancelBtn }: Props) => {
    const dispatch = useDispatch()
    const showModal = useSelector((state: any) => state.modalInfo.showModal)
    const modalHeader = useSelector((state: any) => state.modalInfo.modalHeader)
    const modalBody = useSelector((state: any) => state.modalInfo.modalBody)
    const saveBtnInfo = useSelector((state: any) => state.modalInfo.saveBtnInfo)

    return (

        <Modal closeOnOverlayClick={false} isOpen={showModal} onClose={() => dispatch({ type: 'modalInfo/setShowModal', payload: false })}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{modalHeader}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {modalBody}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={() => {
                        clickOnSaveBtn()
                        dispatch({ type: 'modalInfo/setShowModal', payload: false })
                    }}>
                        {saveBtnInfo}
                    </Button>
                    <Button onClick={() => {
                        clickOnCancelBtn()
                        dispatch({ type: 'modalInfo/setShowModal', payload: false })
                    }}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ModalComponent;