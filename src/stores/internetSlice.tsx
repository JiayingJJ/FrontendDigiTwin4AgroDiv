import { createSlice } from '@reduxjs/toolkit';

interface InternetState {
    isOnLine: boolean;
}

const initialState: InternetState = {
    isOnLine: true,
}

const internetSlice = createSlice({
    name: 'internet',
    initialState,
    reducers: {
        setIsOnLine: (state, action) => {
            state.isOnLine = action.payload;
        }
    }
});

export const {
    setIsOnLine,
} = internetSlice.actions;

export default internetSlice.reducer;