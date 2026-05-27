import { createSlice } from '@reduxjs/toolkit';

interface UserState {
    isAuthenticated: boolean;
    id: string | null;
    name: string | null;
    email: string | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    id: null,
    name: null,
    email: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
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
    setIsAuthenticated,
    setUserId,
    setName,
    setEmail
} = userSlice.actions;

export default userSlice.reducer;