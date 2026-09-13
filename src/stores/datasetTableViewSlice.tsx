import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// console.log(JSON.parse(JSON.stringify(state.userInputColumnValues)))

interface DatasetTableViewState {
    tables: [],
    renderTable: boolean,
    columns: [],
    data: any,
    tableName: string | null,
    tableID: string | null,
    selectedTable: [] | null,
    redernSelectColumn: boolean,
    selecedColumns: [],
    allColumnsName: [],
    addNewColumnsDataInDatasetTableView: boolean;
}

const initialState: DatasetTableViewState = {
    tables: [],
    renderTable: false,
    columns: [],
    data: null,
    tableName: null,
    tableID: null,
    selectedTable: null,
    redernSelectColumn: false,
    selecedColumns: [],
    allColumnsName: [],
    addNewColumnsDataInDatasetTableView: false
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
        setTableID: (state, action) => {
            state.tableID = action.payload;
        },
        setSelectedTable: (state, action) => {
            state.selectedTable = action.payload;
        },
        setRedernSelectColumn: (state, action) => {
            state.redernSelectColumn = action.payload;
        },
        clearDatasetTableView: (state, action) => {
            state.tables = [];
            state.renderTable = false;
            state.columns = [];
            state.data = null;
            state.tableName = null;
            state.tableID = null;
            state.selectedTable = null;
            state.redernSelectColumn = false;
            state.selecedColumns = [],
                state.allColumnsName = []
        },
        clearTableInfo: (state, action) => {
            state.columns = [];
            state.data = null;
            state.tableName = null;
            state.renderTable = false;
            state.tableID = null;
            state.selectedTable = null;
            state.redernSelectColumn = false;
            state.selecedColumns = [],
                state.allColumnsName = []
        },
        setSelecedColumns: (state, action) => {
            state.selecedColumns = action.payload;
        },
        addSelectedColumns: (state, action) => {
            state.selecedColumns.push(action.payload)
        },
        setAllColumnsName: (state, action) => {
            state.allColumnsName = action.payload;
        },
        addAllColumnsName: (state, action) => {
            state.allColumnsName.push(action.payload)
        },
        setAddNewColumnsDataInDatasetTableView: (state, action) => {
            state.addNewColumnsDataInDatasetTableView = action.payload;
        },

    }
});

export const {
    setTables,
    setRenderTable,
    setColumns,
    setData,
    setTableName,
    setTableID
} = datasetTableViewSlice.actions;

export default datasetTableViewSlice.reducer;