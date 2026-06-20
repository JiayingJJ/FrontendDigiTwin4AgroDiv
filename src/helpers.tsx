export const getCurrentTime = () => {
    const now = new Date();
    const isoString = now.toISOString();
    return isoString;
}
export const isZeroTimeString = (s: string) => {
    return s === "0001-01-01T00:00:00Z";
}
export const readableTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}