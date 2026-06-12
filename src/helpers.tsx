export const getCurrentTime = () => {
    const now = new Date();
    const isoString = now.toISOString();
    return isoString;
}
export const isZeroTimeString = (s: string) => {
        return s === "0001-01-01T00:00:00Z";
    }