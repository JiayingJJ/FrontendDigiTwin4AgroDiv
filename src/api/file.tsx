import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;

export const uploadImage = async (fileName: string, file: File, userId: string) => {
    const response = await fetch(`${apiUrl}/api/update/${userId}/${encodeURIComponent(fileName)}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
        body: file,
    })
    const data = await response.json();
    return [response.status, data];
}