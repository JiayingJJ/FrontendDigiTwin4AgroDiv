import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;
export const getGeoData = async () => {
    const response = await fetch(`${apiUrl}/geodata`, {
        method: "GET",
    })
    const data = await response.json();
    return data;
}

export const insertGeoData = async (userId: string, properties: any, projectId: string | null, geometry_data: any, color: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, properties: properties, project_id: projectId, geometry_data: geometry_data, color: color, created_at: time, updated_at: time, data_status: "pending" })
    })
    const data = await response.json();
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
export const getGeoDataWithUserId = async (user_id: string) => {
    const response = await fetch(`${apiUrl}/geodata/user/${user_id}`, {
        method: "GET",
    })
    const data = await response.json();
    return data;
}

export const updateGeoDataProperties = async (id: string, properties: any, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata/update/properties`, {
        method: "PUT",
        body: JSON.stringify({ id: id, data_status: dataStatus, updated_at: time, properties: properties }),
    })
    const data = await response.json();
    return [data, response.status];
}

export const updateGeoDataColor = async (id: string, color: string, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata/update/color`, {
        method: "PUT",
        body: JSON.stringify({ id: id, data_status: dataStatus, updated_at: time, color: color }),
    })
    const data = await response.json();
    return [data, response.status];
}

export const removeColumnInGeoDataProperties = async (columnId: string, geoDataId: string, tableId: string) => {
    const time = getCurrentTime();

    const response = await fetch(`${apiUrl}/geodata/properties/remove`, {
        method: "PUT",
        body: JSON.stringify({ column_id: columnId, geo_data_id: geoDataId, table_id: tableId, data_status: "pending", updated_at: time }),
    })
    console.log(response)
    const data = await response.json();
    return [data, response.status];
}
export const getGeoDataWithId = async (geoId: string) => {
    const response = await fetch(`${apiUrl}/geodata/${geoId}`, {
        method: "GET",
    })
    const data = await response.json();
    return data;
}
export const updateProjectIdInGeoData = async (id: string, projectIds: any, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata/update/projectids`, {
        method: "PUT",
        body: JSON.stringify({ id: id, data_status: dataStatus, updated_at: time, project_ids: projectIds }),
    })
    const data = await response.json();
    return [data, response.status];
}

export const removeProjectIdInGeoData = async (projectId: string, geoId: string, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/geodata/remove/projectid`, {
        method: "PUT",
        body: JSON.stringify({ project_id: projectId, geo_id: geoId, data_status: dataStatus, updated_at: time }),
    })
    const data = await response.json();
    return [data, response.status];
}
export const getOwnedAndSharedGeoDataWithUserId = async (user_id: string) => {
    const response = await fetch(`${apiUrl}/geodata/user/all/${user_id}`, {
        method: "GET",
    })
    const data = await response.json();
    return data;
}