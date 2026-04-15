const apiUrl = import.meta.env.VITE_API_URL;

export const getTablesWithUserId = async (userInfo: any) => {
    const response = await fetch(`${apiUrl}/usertables/${userInfo.id}`, {
        method: "GET"
    })
    const data = await response.json();
    console.log(data)
    return data;
}

export const postUserColumns = async (tableId: string, userTableColumns: any) => {
    const response = await fetch(`${apiUrl}/usertable/columns`, {
        method: "POST",
        body: JSON.stringify({ "table_id": tableId, "columns": userTableColumns }),
    })
    const data = await response.json();
    return data;
}

export const createTable = async (userInfo: any, tableName: string) => {
    const response = await fetch(`${apiUrl}/usertable`, {
        method: "POST",
        body: JSON.stringify({ user_id: userInfo.id, name: tableName }),
    })
    const data = await response.json();
    console.log(data)

    return [data, response.status]
}