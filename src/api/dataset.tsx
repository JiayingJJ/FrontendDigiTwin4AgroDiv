import { getCurrentTime } from "../helpers";

const apiUrl = import.meta.env.VITE_API_URL;

export const getTablesWithUserId = async (userInfo: any) => {
    const response = await fetch(`${apiUrl}/usertables/${userInfo.id}`, {
        method: "GET"
    })
    const data = await response.json();
    console.log(data)
    return data;
}

export const postColumns = async (tableId: string, userTableColumns: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/addColumn/${tableId}`, {
        method: "PUT",
        body: JSON.stringify({ columns_in_table: userTableColumns, updated_at: time }),
    })
    const data = await response.json();
    return data;
}
export const createTable = async (userInfo: any, tableName: string) => {
    const time = getCurrentTime()
    console.log(time)
    const response = await fetch(`${apiUrl}/usertable`, {
        method: "POST",
        body: JSON.stringify({ user_id: userInfo.id, table_name: tableName, created_at: time, updated_at: time }),
    })
    const data = await response.json();
    console.log(data)

    return [data, response.status]
}

export const fetchTableWithId = async (t: any) => {
    const response = await fetch(`${apiUrl}/usertable/${t}/columns`, {
        method: "GET"
    })
    const data = await response.json();
    console.log(data[0])
    if (data[0].ColumnsInTable.RawMessage === null) {
        return [data[0], 500]
    }
    else {
        return [data[0], response.status]
    }
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

export const deleteTableWithId = async (table_id: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/delete/${table_id}`, {
        method: "POST",
        body: JSON.stringify({ deleted_at: time, table_id: table_id }),
    })
    const data = await response.json();
    return data
}

export const setUserTableColumnDataStatus = async (id: string, tableId: string, dataStatus: string) => {
    const response = await fetch(`${apiUrl}/usertable/setDataStatus`, {
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
    console.log(data[0])
}
export const getGeoData = async () => {
    const response = await fetch(`${apiUrl}/geodata`, {
        method: "GET",
    })
    const data = await response.json();
    return data;
}
export const insertGeoData = async (properties: string, geometry_data: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata`, {
        method: "POST",
        body: JSON.stringify({properties: properties, geometry_data: geometry_data, created_at: time, updated_at: time, data_status: "pending"})
    })
    const data = await response.json();
    console.log(data)
}