import { createSlice } from '@reduxjs/toolkit';

interface AlertInfoState {
    showAlert: boolean;
    alertTitle: string | null;
    alertMessage: string | null;
    alertStatus: 'error' | 'success' | 'warning' | 'info'
}

const initialState: AlertInfoState = {
    showAlert: false,
    alertTitle: null,
    alertMessage: null,
    alertStatus: 'success'
}

const alertInfoSlice = createSlice({
    name: 'alertInfo',
    initialState,
    reducers: {
        setShowAlert: (state, action) => {
            state.showAlert = action.payload;
        },
        setAlertTitle: (state, action) => {
            state.alertTitle = action.payload;
        },
        setAlertMessage: (state, action) => {
            state.alertMessage = action.payload;
        },
        setAlertStatus: (state, action) => {
            state.alertStatus = action.payload;
        }
    }
});

export const {
    setShowAlert,
    setAlertTitle,
    setAlertMessage,
    setAlertStatus
} = alertInfoSlice.actions;

export default alertInfoSlice.reducer;