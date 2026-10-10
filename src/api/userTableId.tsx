import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;

export const removeDataFromUserTablesId = async (id: string, tableId: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertablesid/remove`, {
        method: "DELETE",
        body: JSON.stringify({ id: id, table_id: tableId, deleted_at: time, data_status: "pending"}),
    })
    const data = await response.json();
    return [data, response.status];
}

export const updateGeoDataIdInUserTableId = async (table_id: string, geo_data_id: string, column_id: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/${table_id}/column/geodata`, {
        method: "POST",
        body: JSON.stringify({ table_id: table_id, geo_data_id: geo_data_id, column_id: column_id, updated_at: time, data_status: "pending" }),
    })
    const data = await response.json();
    return [data, response.status]
}