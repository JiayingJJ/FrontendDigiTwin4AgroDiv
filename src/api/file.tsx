import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;

export const uploadImage = async (fileName: string, file: File, userId: string) => {
    const response = await fetch(`${apiUrl}/api/upload/${userId}/${encodeURIComponent(fileName)}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
        body: file,
    })
    const data = await response.json();
    return [response.status, data];
}

export const downloadImage = async (fileName: string) => {
    const response = await fetch(`${apiUrl}/api/download`, {
        method: "POST",
        body: JSON.stringify({ file_name: fileName }),
    })
    const blob = await response.blob();
    // const url = window.URL.createObjectURL(blob);
    return blob
}