import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;

export const getTablesWithUserId = async (userId: any) => {
    const response = await fetch(`${apiUrl}/usertables/user/${userId}`, {
        method: "GET"
    })
    const data = await response.json();
    return data;
}

export const fetchTableWithId = async (t: any) => {
    const response = await fetch(`${apiUrl}/usertable/${t}/columns`, {
        method: "GET"
    })
    const data = await response.json();
    // if (data[0].columns_in_table.RawMessage === null) {
    //     return [data[0], 500]
    // }
    // else {
        return [data, response.status]
    // }
}

export const createTable = async (userInfo: any, tableName: string, projectId: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable`, {
        method: "POST",
        body: JSON.stringify({ user_id: userInfo.id, table_name: tableName, project_id: projectId, created_at: time, updated_at: time, data_status: "pending" }),
    })
    const data = await response.json();
    return [data, response.status]
}

export const deleteTableWithId = async (table_id: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/${table_id}`, {
        method: "DELETE",
        body: JSON.stringify({ deleted_at: time, table_id: table_id, data_status: "pending" }),
    })
    const data = await response.json();
    return data
}

export const setUserTableProjectId = async (id: string, projectId: string, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/table/project`, {
        method: "PUT",
        body: JSON.stringify({ id: id, project_id: projectId, data_status: dataStatus, updated_at: time }),
    })
    const data = await response.json();
    return data;
}

export const setUserTableDataStatus = async (id: string, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/table/setDataStatus`, {
        method: "PUT",
        body: JSON.stringify({ id: id, data_status: dataStatus, updated_at: time }),
    })
    const data = await response.json();
    return data;
}
export const getUserTablesWithProjectId = async (projectId: any) => {
    const response = await fetch(`${apiUrl}/usertables/project/${projectId}`, {
        method: "GET"
    })
    const data = await response.json();
    return data;
}
export const setUserTableProjectAsNull = async (id: string, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/usertable/table/project/setnull`, {
        method: "DELETE",
        body: JSON.stringify({ id: id, data_status: dataStatus, updated_at: time }),
    })
    const data = await response.json();
    return data;
}