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
    selectedColumns: [],
    allColumnsName: [],
    addNewColumnsDataInDatasetTableView: boolean;
    getUpdateFromDatabase: boolean;
    editData: boolean;
    deleteData: boolean;
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
    selectedColumns: [],
    allColumnsName: [],
    addNewColumnsDataInDatasetTableView: false,
    getUpdateFromDatabase: false,
    editData: false,
    deleteData: false
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
            state.selectedColumns = [];
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
            state.selectedColumns = [];
            state.allColumnsName = [];
        },
        setSelectedColumns: (state, action) => {
            state.selectedColumns = action.payload;
        },
        manageSelectedColumns: (state, action) => {
            const index = state.selectedColumns.indexOf(action.payload);
            if (index !== -1) {
                state.selectedColumns.splice(index, 1);
            }
            else {
                state.selectedColumns.push(action.payload)
            }
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
        setGetUpdateFromDatabase: (state, action) => {
            state.getUpdateFromDatabase = action.payload;
        },
        clearForGetUpdate: (state, action) => {
            state.data = null;

        },
        setEditData: (state, action) => {
            state.editData = action.payload;
        },
        setDeleteData: (state, action) => {
            state.deleteData = action.payload;
        }
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