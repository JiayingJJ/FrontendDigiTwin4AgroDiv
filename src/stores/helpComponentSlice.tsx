import { createSlice } from '@reduxjs/toolkit';

interface HelpComponetState {
   watchType: string|null;
}

const initialState: HelpComponetState = {
   watchType: null,
}

const helpComponetSlice = createSlice({
    name: 'helpComponet',
    initialState,
    reducers: {
        setWatchType: (state, action) => {
            state.watchType = action.payload;
        },
    }
});

export const {
   
} = helpComponetSlice.actions;

export default helpComponetSlice.reducer;