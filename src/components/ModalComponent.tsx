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
import { deleteProjectWithId, getProjectWithCreatorId } from '../api/projects';
import { deleteTableWithId, getTablesWithUserId } from '../api/userTables';
const ModalComponent = () => {
    const dispatch = useDispatch()
    const showModal = useSelector((state: any) => state.modalInfo.showModal)
    const modalHeader = useSelector((state: any) => state.modalInfo.modalHeader)
    const modalBody = useSelector((state: any) => state.modalInfo.modalBody)
    const saveBtnInfo = useSelector((state: any) => state.modalInfo.saveBtnInfo)
    const modalType = useSelector((state: any) => state.modalInfo.modalType)
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const userInfo = useSelector((state: any) => state.user)

    const clickOnCancelBtn = () => {
    }

    const clickOnSaveBtn = async () => {
        switch (modalType) {
            case "createColumns":
                dispatch({ type: 'datasetTable/clearUserTableColumns', payload: [] })
                dispatch({ type: 'datasetTable/setAddingColumns', payload: false })
                dispatch({ type: 'datasetTable/setEditTable', payload: false })
                break;
            case "deleteProject":
                const dataDelete = await deleteProjectWithId(selectedProject.id);
                const projectsWithCreatorId = await getProjectWithCreatorId(userInfo.id)
                if (projectsWithCreatorId[1] !== 200) {

                } else {
                    const notDelete = projectsWithCreatorId[0].filter((d: any) => {
                        if (!d.deleted_at.Valid) {
                            return d;
                        }
                    })
                    dispatch({ type: 'projects/setAllProjects', payload: notDelete })
                }
                break;
            case "deleteTable":
                const dataTableDelete = await deleteTableWithId(selectedTableId)
                const data = await getTablesWithUserId(userInfo)
                const filterData = data.filter((d) => {
                    if (!d.deleted_at.Valid) {
                        return d;
                    }
                });
                dispatch({ type: 'datasetTable/setTables', payload: filterData })
        }
    }
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