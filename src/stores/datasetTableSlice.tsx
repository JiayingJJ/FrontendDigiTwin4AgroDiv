import { createSlice } from '@reduxjs/toolkit';

interface DatasetTableState {
    id: string | null;
    name: string | null;
    userId: string | null;
    tableColumns: [];
}

const initialState: DatasetTableState = {
    id: null,
    name: null,
    userId: null,
    tableColumns: [],
}

const datasetTableSlice = createSlice({
    name: 'datasetTable',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setTableColumns: (state, action) => {
            state.tableColumns = action.payload;
        }
    }
});

export const {
    setId,
    setName,
    setUserId
} = datasetTableSlice.actions;

export default datasetTableSlice.reducer;