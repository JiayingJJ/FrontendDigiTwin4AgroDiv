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
export const PostUser = async (valueName: string,valueEmail: string) => {
    const response = await fetch(`${apiUrl}/user`, {
            method: "POST",
            body: JSON.stringify({ name: valueName, email: valueEmail }),
        })
    const data = await response.json();
    return [data, response.status];
}