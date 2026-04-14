import { createSlice } from '@reduxjs/toolkit';

interface DatasetTableState {
    id: string | null;
    name: string | null;
    userId: string | null;
    tables: [];
    tableColumns: [];
    createColumns: boolean;
    updatedTables: boolean;
}

const initialState: DatasetTableState = {
    id: null,
    name: null,
    userId: null,
    tables: [],
    tableColumns: [],
    createColumns: false,
    updatedTables: false,
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
        setTables: (state, action) => {
            state.tables = action.payload;
        },
        setTableColumns: (state, action) => {
            state.tableColumns = action.payload;
        },
        setCreateColumns: (state, action) => {
            state.createColumns = action.payload;
        },
        setUpdatedTables: (state, action) => {
            state.updatedTables = action.payload;
        }
    }
});

export const {
    setId,
    setName,
    setUserId,
    setTables,
    setTableColumns,
    setCreateColumns,
    setUpdatedTables
} = datasetTableSlice.actions;

export default datasetTableSlice.reducer;