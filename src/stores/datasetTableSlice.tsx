import { createSlice } from '@reduxjs/toolkit';

interface DatasetTableState {
    selectedTableId: string | null;
    selectedTableName: string | null;
    userId: string | null;
    tables: [];
    tableColumns: [];
    createColumns: boolean;
    updatedTables: boolean;
}

const initialState: DatasetTableState = {
    selectedTableId: null,
    selectedTableName: null,
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
        setSelectedTableId: (state, action) => {
            state.selectedTableId = action.payload;
        },
        setSelectedTableName: (state, action) => {
            state.selectedTableName = action.payload;
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
    setSelectedTableId,
    setSelectedTableName,
    setUserId,
    setTables,
    setTableColumns,
    setCreateColumns,
    setUpdatedTables
} = datasetTableSlice.actions;

export default datasetTableSlice.reducer;