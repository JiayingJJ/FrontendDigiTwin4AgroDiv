import { getCurrentTime } from "../helpers";

const apiUrl = import.meta.env.VITE_API_URL;

export const updatePendingDataFromOPFS = async (info: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/api/update/data`, {
        method: "POST",
        body: JSON.stringify({ opfs_info: info }),
    })
    const data = await response.json();
    console.log(data)
    return data;
}


export const postColumns = async (tableId: string, userTableColumns: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/addColumn/${tableId}`, {
        method: "POST",
        body: JSON.stringify({ columns_in_table: userTableColumns, updated_at: time, data_status: "pending" }),
    })
    const data = await response.json();
    return data;
}

export const putNewColumns = async (tableId: string, newColumns: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/addColumn/${tableId}`, {
        method: "PUT",
        body: JSON.stringify({ columns_in_table: newColumns, updated_at: time }),
    })
    const data = await response.json();
    return data;
}

export const patchColumns = async (tableId: string, updatedColumns: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/updateColumn/${tableId}`, {
        method: "PUT",
        body: JSON.stringify({ columns_in_table: updatedColumns, updated_at: time }),
    })
    const data = await response.json();
    return data;
}

export const removeColumns = async (tableId: string, deletedColumns: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/removeColumn/${tableId}`, {
        method: "DELETE",
        body: JSON.stringify({ columns_in_table: deletedColumns, updated_at: time }),
    })
    const data = await response.json();
    return data;
}


export const addValueInColumns = async (table_id: string, columns: any) => {
    const response = await fetch(`${apiUrl}/usertable/columns/addValue`, {
        method: "POST",
        body: JSON.stringify({ table_id: table_id, columns: columns }),
    })
    const data = await response.json();
    console.log(data)
    console.log(response.status)
    return [response.status, data]
}

export const setUserTableColumnDataStatus = async (id: string, tableId: string, dataStatus: string) => {
    const response = await fetch(`${apiUrl}/usertable/column/setDataStatus`, {
        method: "PUT",
        body: JSON.stringify({ id: id, table_id: tableId, data_status: dataStatus }),
    })
    const data = await response.json();
    return data;
}

export const getColumnWithId = async (table_id: string, id: string) => {
    const response = await fetch(`${apiUrl}/usertable/${table_id}/column/${id}`, {
        method: "GET",
    })
    const data = await response.json();
    console.log(data)
    return data;
}
export const getAllColumnsWithTableId = async (table_id: string) => {
    const response = await fetch(`${apiUrl}/usertable/${table_id}/column`, {
        method: "GET",
    })
    const data = await response.json();
    console.log(data)
    return [data, response.status];
}