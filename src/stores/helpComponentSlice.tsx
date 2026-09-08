import { createSlice } from '@reduxjs/toolkit';

interface HelpComponentState {
    rendernHelpComponent: boolean;
    watchType: string | null;
    isRunning: boolean;
}

const initialState: HelpComponentState = {
    watchType: null,
    rendernHelpComponent: false,
    isRunning: false,
}

const helpComponentSlice = createSlice({
    name: 'helpComponent',
    initialState,
    reducers: {
        setWatchType: (state, action) => {
            state.watchType = action.payload;
        },
        setRendernHelpComponent: (state, action) => {
            state.rendernHelpComponent = action.payload;
        },
        setIsRunning: (state, action) => {
            state.isRunning = action.payload;
        },
    }
});

export const {

} = helpComponentSlice.actions;

export default helpComponentSlice.reducer;