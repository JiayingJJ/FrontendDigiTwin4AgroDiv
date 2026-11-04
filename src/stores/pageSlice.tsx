import { createSlice } from '@reduxjs/toolkit';

interface PageState {
    pageName: string | null;
    getUpdate: boolean;
}

const initialState: PageState = {
    pageName: 'dashboard',
    getUpdate: false,
}

const pageSlice = createSlice({
    name: 'pageInfo',
    initialState,
    reducers: {
        setPageName: (state, action) => {
            state.pageName = action.payload;
        },
        setGetUpdate: (state, action) =>{
            state.getUpdate = action.payload;
        }
    }
});

export const {
    setPageName,
} = pageSlice.actions;

export default pageSlice.reducer;