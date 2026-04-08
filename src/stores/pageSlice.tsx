import { createSlice } from '@reduxjs/toolkit';

interface PageState {
    pageName: string | null;
}

const initialState: PageState = {
    pageName: 'dashboard',
}

const pageSlice = createSlice({
    name: 'pageInfo',
    initialState,
    reducers: {
        setPageName: (state, action) => {
            state.pageName = action.payload;
        }
    }
});

export const {
    setPageName,
} = pageSlice.actions;

export default pageSlice.reducer;