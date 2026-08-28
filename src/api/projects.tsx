import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;

export const getAllProjects = async () => {
    const response = await fetch(`${apiUrl}/projects`, {
        method: "GET",
    })
    const data = await response.json();
    return [data, response.status];
}
export const createProject = async (name: string, creatorId: string, members: any, projectDescription: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/projects/project`, {
        method: "POST",
        body: JSON.stringify({ name: name, creator_id: creatorId, members: members, description: projectDescription, created_at: time, updated_at: time, data_status: "pending" }),
    })
    const data = await response.json();
    return [data, response.status];
}

export const deleteProjectWithId = async (id: any) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/projects/remove/project/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ deleted_at: time, data_status: "pending" }),
    })
    const data = await response.json();
    return data
}
export const getProjectWithId = async (id: string) => {
    const response = await fetch(`${apiUrl}/projects/project/${id}`, {
        method: "GET",
    })
    const data = await response.json();
    return [data, response.status];
}
export const getProjectWithCreatorId = async (creator_id: string) => {
    const response = await fetch(`${apiUrl}/projects/${creator_id}`, {
        method: "GET",
    })
    const data = await response.json();
    return [data, response.status];
}
export const setProjectDataStatus = async (id: string, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/projects/project/setDataStatus`, {
        method: "PUT",
        body: JSON.stringify({ id: id, data_status: dataStatus, updated_at: time }),
    })
    const data = await response.json();
    return data;
}

export const updateProjectMembers = async (id: string, members: any, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/projects/project/members`, {
        method: "PUT",
        body: JSON.stringify({ id: id, data_status: dataStatus, updated_at: time, members: members }),
    })
    const data = await response.json();
    return [data, response.status];
}

export const removeProjectMemberWithUserId = async (projectId: string, memberId: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/projects/project/remove/member`, {
        method: "PUT",
        body: JSON.stringify({ project_id: projectId, member_id: memberId, data_status: "pending", updated_at: time }),
    })
    const data = await response.json();
    return [data, response.status];
}

export const getAllProjectsWithShared = async (user_id: string) => {
    const response = await fetch(`${apiUrl}/projects/all/${user_id}`, {
        method: "GET",
    })
    const data = await response.json();
    return [data, response.status];
}

export const updateProjectInfo = async (projectId: string, name: string, projectDescription: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/projects/project/update/info`, {
        method: "POST",
        body: JSON.stringify({ id: projectId, name: name, description: projectDescription, updated_at: time, data_status: "pending" }),
    })
    const data = await response.json();
    return [data, response.status];
}