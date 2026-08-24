import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// console.log(JSON.parse(JSON.stringify(state.userInputColumnValues)))
export interface ColumnType {
    id: string;
    name: string;
    type: string;
    position: number;
    hint: string;
    additional_info: [];
}
interface DatasetTableState {
    selectedTableId: string | null;
    selectedTableName: string | null;
    userId: string | null;
    tables: [];
    tableColumns: [];
    createColumnsButton: boolean;
    updatedTables: boolean;
    userTableColumns: ColumnType[];
    userTableColumnIndex: number;
    addNewDataset: boolean;
    addingColumns: boolean;
    userInputColumnValues: [];
    editTable: boolean;
    editedColumns: [];
    newColumns: [];
    removedColumns: [];
    hasChanged: boolean;
    isChangingColumns: [];
    projectId: string|null;
    selectedTable: []|null;
}

const initialState: DatasetTableState = {
    selectedTableId: null,
    selectedTableName: null,
    userId: null,
    tables: [],
    tableColumns: [],
    createColumnsButton: false,
    updatedTables: false,
    userTableColumns: [],
    userTableColumnIndex: 0,
    addNewDataset: false,
    addingColumns: false,
    userInputColumnValues: [],
    editTable: false,
    editedColumns: [],
    newColumns: [],
    removedColumns: [],
    hasChanged: false,
    isChangingColumns: [],
    projectId: null,
    selectedTable: null,
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
        setCreateColumnsButton: (state, action) => {
            state.createColumnsButton = action.payload;
        },
        setUpdatedTables: (state, action) => {
            state.updatedTables = action.payload;
        },
        setUserTableColumns: (state, action) => {
            state.userTableColumns = action.payload;
        },
        clearUserTableColumns: (state, action: PayloadAction<ColumnType>) => {
            state.userTableColumns = [];
        },
        addUserTableColumns: (state, action: PayloadAction<ColumnType>) => {
            state.userTableColumns.push(action.payload);
        },
        updateUserTableColumns: (state, action: PayloadAction<ColumnType>) => {
            const index = state.userTableColumns.findIndex(
                col => col.id === action.payload.id
            );
            if (index !== -1) {
                state.userTableColumns[index] = action.payload;
            }

            console.log(JSON.parse(JSON.stringify(state.userTableColumns)))
        },
        removeUserTableColumn: (state, action: PayloadAction<number>) => {
            state.userTableColumns = state.userTableColumns.filter(
                col => {
                    if (col.id !== action.payload) {
                        console.log(JSON.parse(JSON.stringify(col)))
                    }
                    return col.id !== action.payload
                }
            );
        },
        setUserTableColumnIndex: (state, action) => {
            state.userTableColumnIndex = action.payload;
        },
        setAddNewDataset: (state, action) => {
            state.addNewDataset = action.payload;
        },
        setAddingColumns: (state, action) => {
            state.addingColumns = action.payload;
        },
        setUserInputColumnValues: (state, action) => {
            JSON.parse(JSON.stringify(action.payload)).map((p: ColumnType) => {
                const data = { id: p.id, name: p.name, value: null }
                state.userInputColumnValues.push(data)
            })
        },
        updateUserInputColumnValues: (state, action) => {
            state.userInputColumnValues.filter((c: any) => {
                if (c.id === action.payload.id) {
                    c.value = action.payload.value
                }
            })
        },
        clearUserInputColumnValues: (state, action) => {
            console.log(action.payload)
            state.userInputColumnValues = [];
        },
        setEditTable: (state, action) => {
            state.editTable = action.payload;
        },
        setEditedColumns: (state, action) => {
            state.editedColumns = action.payload;
        },
        setNewColumns: (state, action) => {
            state.newColumns = action.payload;
        },
        removeNewColumn: (state, action) => {
            state.newColumns = state.newColumns.filter(
                col => {
                    if (col.id !== action.payload) {
                        console.log(JSON.parse(JSON.stringify(col)))
                    }
                    return col.id !== action.payload
                }
            );
        },
        setRemovedColumns: (state, action) => {
            state.removedColumns = action.payload;
        },
        setHasChanged: (state, action) => {
            state.hasChanged = action.payload;
        },
        setIsChangingColumns: (state, action) => {
            state.isChangingColumns = []
        },
        addIsChangingColumns: (state, action) => {
            console.log(state.isChangingColumns.includes(action.payload))
            if (!state.isChangingColumns.includes(action.payload)) {
                state.isChangingColumns.push(action.payload);
            }
        },
        removeIsChangingColumns: (state, action) => {
            state.isChangingColumns = state.isChangingColumns.filter(
                col => {
                    if (col !== action.payload) {
                        console.log(JSON.parse(JSON.stringify(col)))
                    }
                    return col !== action.payload
                }
            );
        },
        clearInfoFromADatabase: (state, action) => {
            state.tableColumns = [];
            state.userTableColumns = [];
            state.editTable = false;
            state.isChangingColumns = [];
            state.newColumns = [];
            state.editedColumns = [];
            state.removedColumns = [];
            state.projectId = null;
            state.selectedTableId = null;
            state.selectedTable=null;
            state.createColumnsButton=false;
        },
        updateInfoFromADatabase: (state, action) => {
            state.tableColumns = [];
            state.userTableColumns = [];
            state.editTable = false;
            state.isChangingColumns = [];
            state.newColumns = [];
            state.editedColumns = [];
            state.removedColumns = [];
            state.projectId = null;
            state.selectedTable=null;
            state.createColumnsButton=false;
        },
        setProjectId: (state, action) => {
            state.projectId = action.payload
        },
        setSelectedTable: (state, action) => {
            state.selectedTable = action.payload
        },
    }
});

export const {
    setSelectedTableId,
    setSelectedTableName,
    setUserId,
    setTables,
    setTableColumns,
    setCreateColumnsButton,
    setUpdatedTables,
    addUserTableColumns,
    setUserTableColumnIndex,
    updateUserTableColumns,
    removeUserTableColumn,
    setAddNewDataset,
    setAddingColumns,
    clearUserTableColumns,
    setUserInputColumnValues,
    updateUserInputColumnValues,
    clearUserInputColumnValues,
    setEditTable,
    setUserTableColumns,
    setEditedColumns,
    setNewColumns,
    setRemovedColumns,
    setHasChanged,
    addIsChangingColumns,
    removeIsChangingColumns,
    setIsChangingColumns,
    clearInfoFromADatabase,
    setProjectId,
    setSelectedTable
} = datasetTableSlice.actions;

export default datasetTableSlice.reducer;