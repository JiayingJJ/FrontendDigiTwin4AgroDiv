import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export interface ColumnType {
    id: number;
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
    createColumns: boolean;
    updatedTables: boolean;
    userTableColumns: ColumnType[];
    userTableColumnIndex: number;
}

const initialState: DatasetTableState = {
    selectedTableId: null,
    selectedTableName: null,
    userId: null,
    tables: [],
    tableColumns: [],
    createColumns: false,
    updatedTables: false,
    userTableColumns: [],
    userTableColumnIndex: 0
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
    setUpdatedTables,
    addUserTableColumns,
    setUserTableColumnIndex,
    updateUserTableColumns,
    removeUserTableColumn
} = datasetTableSlice.actions;

export default datasetTableSlice.reducer;