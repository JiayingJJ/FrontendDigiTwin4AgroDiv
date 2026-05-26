import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// console.log(JSON.parse(JSON.stringify(state.userInputColumnValues)))

interface DatasetTableViewState {
    tables: [],
    renderTable: boolean,
    columns: [],
    data: any,
    tableName: string | null,
}

const initialState: DatasetTableViewState = {
    tables: [],
    renderTable: false,
    columns: [],
    data: null,
    tableName: null
}

const datasetTableViewSlice = createSlice({
    name: 'datasetTableView',
    initialState,
    reducers: {
        setTables: (state, action) => {
            state.tables = action.payload;
        },
        setRenderTable: (state, action) => {
            state.renderTable = action.payload;
        },
        setColumns: (state, action) => {
            state.columns = action.payload;

        },
        setData: (state, action) => {
            state.data = action.payload;

        },
        setTableName: (state, action) => {
            state.tableName = action.payload;

        },
    }
});

export const {
    setTables,
    setRenderTable,
    setColumns,
    setData,
    setTableName
} = datasetTableViewSlice.actions;

export default datasetTableViewSlice.reducer;