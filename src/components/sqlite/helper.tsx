import { getAllProjectsWithShared, getProjectWithCreatorId } from "../../api/projects";
import { getTablesWithUserId, getUserTablesWithProjectId } from "../../api/userTables";

// Einzelne Datei löschen
export const deleteFileFromOPFS = async (filename: string) => {
    const root = await navigator.storage.getDirectory();
    await root.removeEntry(filename);
    console.log(`"${filename}" gelöscht`);
}
// Verzeichnis löschen
export const deleteFolderFromOPFS = async (foldername: string) => {
    const root = await navigator.storage.getDirectory();
    await root.removeEntry(foldername, { recursive: true });
    console.log(`Ordner "${foldername}" gelöscht`);
}
// OPFS löschen
export const clearAllOPFS = async () => {
    const root = await navigator.storage.getDirectory();

    for await (const [name, handle] of root.entries()) {
        await root.removeEntry(name, { recursive: true });
        console.log(`"${name}" gelöscht`);
    }

    console.log('OPFS komplett geleert!');
}

// OPFS herunterladen
export const downloadFromOPFS = async (filename: string) => {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(filename);
    const file = await fileHandle.getFile();

    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
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