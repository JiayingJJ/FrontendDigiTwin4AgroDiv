import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;
export const getGeoData = async () => {
    const response = await fetch(`${apiUrl}/geodata`, {
        method: "GET",
    })
    const data = await response.json();
    return data;
}

export const getGeoDataWithUserColumnId = async (id: string) => {
    const response = await fetch(`${apiUrl}/geodata/column/${id}`, {
        method: "GET",
    })
    const data = await response.json();
    return data;
}
export const getAllGeoDataWithTableId = async (table_id: string) => {
    const response = await fetch(`${apiUrl}/geodata/tables/${table_id}`, {
        method: "GET",
    })
    const data = await response.json();
    return data;
}

export const insertGeoData = async (tableId: string, columnId: string, properties: any, geometry_data: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata`, {
        method: "POST",
        body: JSON.stringify({ table_id: tableId, column_id: columnId, properties: properties, geometry_data: geometry_data, created_at: time, updated_at: time, data_status: "pending" })
    })
    const data = await response.json();
    console.log(data)
    return [data, response.status]
}

export const setGeoDataStatus = async (id: string, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata/setDataStatus`, {
        method: "PUT",
        body: JSON.stringify({ id: id, data_status: dataStatus, updated_at: time }),
    })
    const data = await response.json();
    return data;
}
export const deleteGeoDataWithId = async (id: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata/remove/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ deleted_at: time, id: id, data_status: "pending" }),
    })
    const data = await response.json();
    return [data, response.status]
}