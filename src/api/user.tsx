import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchUserWithEmail = async (valueEmail: string) => {
    const response = await fetch(`${apiUrl}/user/email/${valueEmail}`, {
        method: "GET",
    })
    const data = await response.json();
    return [data, response.status];
}
export const fetchUserWithId = async (id: string) => {
    const response = await fetch(`${apiUrl}/user/id/${id}`, {
        method: "GET",
    })
    const data = await response.json();
    return [data, response.status];
}
export const PostUser = async (valueName: string, valueEmail: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/user`, {
        method: "POST",
        body: JSON.stringify({ name: valueName, email: valueEmail, created_at: time, updated_at: time, data_status: "pending" }),
    })
    const data = await response.json();
    return [data, response.status];
}

export const setUserDataStatus = async (user_id: string, dataStatus: string) => {
    const time = getCurrentTime()
    const response = await fetch(`${apiUrl}/user/setDataStatus`, {
        method: "PUT",
        body: JSON.stringify({ id: user_id, data_status: dataStatus, updated_at: time }),
    })
    const data = await response.json();
    return data;
}