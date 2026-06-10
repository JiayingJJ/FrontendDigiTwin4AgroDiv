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