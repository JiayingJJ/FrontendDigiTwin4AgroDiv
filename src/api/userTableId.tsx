import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;

export const removeDataFromUserTablesId = async (id: string, tableId: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertablesid/remove`, {
        method: "DELETE",
        body: JSON.stringify({ id: id, table_id: tableId, deleted_at: time }),
    })
    const data = await response.json();
    return [data, response.status];
}