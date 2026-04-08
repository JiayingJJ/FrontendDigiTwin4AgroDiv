import { createSlice } from '@reduxjs/toolkit';

interface AlertInfoState {
    name: string | null;
    email: string | null;
}

const initialState: AlertInfoState = {
    name: null,
    email: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    }
});

export const {
    setName,
    setEmail
} = userSlice.actions;

export default userSlice.reducer;