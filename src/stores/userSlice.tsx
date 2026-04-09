import { createSlice } from '@reduxjs/toolkit';

interface AlertInfoState {
    id: string | null;
    name: string | null;
    email: string | null;
}

const initialState: AlertInfoState = {
    id: null,
    name: null,
    email: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserId: (state, action) => {
            state.id = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    }
});

export const {
    setUserId,
    setName,
    setEmail
} = userSlice.actions;

export default userSlice.reducer;