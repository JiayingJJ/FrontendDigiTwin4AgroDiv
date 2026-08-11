import { createSlice } from '@reduxjs/toolkit';

interface ModalInfoState {
    showModal: boolean;
    modalHeader: string | null;
    modalBody: string | null;
    saveBtnInfo: string | null;
    modalType: string | null;
}

const initialState: ModalInfoState = {
    showModal: false,
    modalHeader: null,
    modalBody: null,
    saveBtnInfo: null,
    modalType: null,
}

const modalInfoSlice = createSlice({
    name: 'modalInfo',
    initialState,
    reducers: {
        setShowModal: (state, action) => {
            state.showModal = action.payload;
        },
        setModalHeader: (state, action) => {
            state.modalHeader = action.payload;
        },
        setModalBody: (state, action) => {
            state.modalBody = action.payload;
        },
        setSaveBtnInfo: (state, action) => {
            state.saveBtnInfo = action.payload;
        },
        setModalType: (state, action) => {
            state.modalType = action.payload;
        },
    }
});

export const {
    setShowModal,
    setModalHeader,
    setModalBody,
    setSaveBtnInfo,
    setModalType
} = modalInfoSlice.actions;

export default modalInfoSlice.reducer;