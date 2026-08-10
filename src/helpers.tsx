export const getCurrentTime = () => {
    const now = new Date();
    const isoString = now.toISOString();
    return isoString;
}
export const isZeroTimeString = (s: string) => {
    return s === "0001-01-01T00:00:00Z";
}
export const readableTimestamp = (ts: string) => {
    let date;
    if(!isZeroTimeString(ts)) {
         date=new Date(ts).toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    }
    return date
}
export const looksLikeIsoZ = (s: string) => {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(s);
}
export const deepEqual = (a: any, b: any) => {
    return JSON.stringify(a) === JSON.stringify(b);
}