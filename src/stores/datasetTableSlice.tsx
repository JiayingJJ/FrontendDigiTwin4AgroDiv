import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export interface ColumnType {
    id: string;
    name: string;
    type: string;
    position: number;
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
    addingColumns: false
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
        clearUserTableColumns: (state, action: PayloadAction<ColumnType>) => {
            console.log(action.payload)
            state.userTableColumns = [];
        },
        addUserTableColumns: (state, action: PayloadAction<ColumnType>) => {
            console.log(action.payload)
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
        }

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
    clearUserTableColumns
} = datasetTableSlice.actions;

export default datasetTableSlice.reducer;