import { getAllProjectsWithShared, getProjectWithCreatorId } from "./api/projects";
import { getTablesWithUserId, getUserTablesWithProjectId } from "./api/userTables";

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
    if (!isZeroTimeString(ts)) {
        date = new Date(ts).toLocaleString("de-DE", {
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

export const getSQLiteType = (type: string) => {
    switch (type) {
        case "integer":
            return "INTEGER NULL"
        case "real":
            return "REAL NULL"
        case "timestamp":
            return "TIMESTAMP"
        case "boolean":
            return "BOOLEAN"
        default:
            return "TEXT"
    }
}

export const getColumnNameForSQLite = (name: string) => {
    let columnName;
    columnName = name.toLowerCase();
    columnName = name.replaceAll(" ", "_")
    return columnName
}

export const getCreatedAndSharedInfo = async (userId: string) => {
    let allProjects: any = [];
    let allUserTables: any = [];
    // get projects with user as creator
    const projectData = await getProjectWithCreatorId(userId)
    projectData[0].map((d: any) => {
        if (!d.deleted_at.Valid) {
            allProjects.push(d);
        }
    })
    // get user_tables with user as creator
    const data = await getTablesWithUserId(userId)
    data.map((d: any) => {
        if (!d.deleted_at.Valid) {
            allUserTables.push(d);
        }
    });
    // get projects and user_tables with user as member
    const projectDataShared = await getAllProjectsWithShared(userId)
    await Promise.all(projectDataShared[0].map(async (d: any) => {
        // projects
        if (!d.deleted_at.Valid) {
            allProjects.push(d);
        }
        // user_tables
        const getUserTablesWithSharedProjects = await getUserTablesWithProjectId(d.id)
        getUserTablesWithSharedProjects.map((sharedUT: any) => {
            allUserTables.push(sharedUT);
        })
    }))
    return {
        "allProjects": allProjects,
        "allUserTables": allUserTables
    }
}