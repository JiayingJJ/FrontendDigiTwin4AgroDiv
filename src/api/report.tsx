import { getCurrentTime } from "../helpers";
const apiUrl = import.meta.env.VITE_API_URL;

export const getReport = async (user_table_id: string) => {
    const response = await fetch(`${apiUrl}/report/${user_table_id}`, {
        method: "GET",
    })
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "daten.csv";
    link.click();
    URL.revokeObjectURL(url);
}