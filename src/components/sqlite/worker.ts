import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import * as Comlink from "comlink";
import type { GeoData, UserTable } from "./types";
import { getColumnNameForSQLite, getCurrentTime, getSQLiteType } from "../../helpers";
export interface Task {
    id: number;
    text: string;
}
// export interface User {
//     id: string;
//     name: string;
//     email: string;
// }

export class Database {
    private db: any = null;

    async initDb(userId: string) {
        // console.log('crossOriginIsolated:', self.crossOriginIsolated)
        if (!self.crossOriginIsolated) {
            throw new Error('Worker is not cross-origin isolated! OPFS not available.')
        }
        const sqlite3 = await sqlite3InitModule();
        // console.log("Running SQLite3 version", sqlite3.version.libVersion);
        if (!sqlite3.oo1.OpfsDb) {
            throw new Error("OPFS is not available...")
        }
        this.db = new sqlite3.oo1.OpfsDb(`/mydb/${userId}.sqlite3`);
        // console.log(
        //     "OPFS is available, created persisted database at",
        //     this.db.filename
        // );

        this.db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id    TEXT PRIMARY KEY,
      name  TEXT,
      email TEXT,
      created_at TEXT,
      updated_at TEXT,
      deleted_at TEXT,
      data_status TEXT
    )
  `);
        this.db.exec(`
    CREATE TABLE IF NOT EXISTS user_tables (
      id    TEXT PRIMARY KEY,
      user_id  TEXT,
      project_id  TEXT,
      table_name TEXT,
      columns_in_table TEXT,
      created_at TEXT,
      updated_at TEXT,
      deleted_at TEXT,
      data_status TEXT
    )
  `);

        this.db.exec(`
    CREATE TABLE IF NOT EXISTS geo_data (
    id TEXT PRIMARY KEY,
    user_id  TEXT,
    properties TEXT,
    project_ids TEXT,
    color TEXT,
    geometry_data TEXT,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    data_status TEXT
);
  `);
        this.db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id    TEXT PRIMARY KEY,
      name  TEXT,
      creator_id TEXT,
      members TEXT,
      geo_ids TEXT,
      description TEXT,
      created_at TEXT,
      updated_at TEXT,
      deleted_at TEXT,
      data_status TEXT
    )
  `);
    }

    query(sql: string, params: any[] = []): any[] {
        // console.log(sql)
        // console.log(params)
        if (!this.db) throw new Error("Database not initialized");
        const results: any[] = [];
        this.db.exec({
            sql,
            bind: params,
            rowMode: "object",
            callback: (row: any) => results.push(row),
        });
        return results;
    }

    insertUser(data: any): void {
        if (!this.db) throw new Error("Database not initialized");
        this.db.exec({
            sql: "INSERT OR IGNORE INTO users (id, name, email, created_at, updated_at, deleted_at, data_status) VALUES (?, ?, ?, ?, ?, ?, ?)", bind: [data.ID, data.Name, data.Email, data.CreatedAt, data.UpdatedAt,
            data.DeletedAt.Time,
            typeof data.DataStatus === "string" ? data.DataStatus : data.DataStatus.String]
        });
    }

    getUserWithEmail(email: string): User | null {
        const rows = this.query("SELECT * FROM users WHERE email = ?", [email]) as User[];
        return rows[0] ?? null;
    }
    // user_tables
    insertUserTables(data: any, userTableIdData: any): void {
        if (!this.db) throw new Error("Database not initialized");
        this.db.exec({
            sql: `INSERT INTO user_tables
                (id, user_id, table_name, columns_in_table, project_id, created_at, updated_at, deleted_at, data_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
                ON CONFLICT(id) DO UPDATE SET
                    table_name      = excluded.table_name,
                    project_id      = excluded.project_id,
                    columns_in_table = excluded.columns_in_table,
                    updated_at      = excluded.updated_at,
                    deleted_at      = excluded.deleted_at,
                    data_status     = excluded.data_status`,
            bind: [
                data.ID,
                data.UserID,
                data.TableName,
                JSON.stringify(data.ColumnsInTable.RawMessage),
                data.ProjectID,
                data.CreatedAt,
                data.UpdatedAt,
                data.DeletedAt.Time,
                typeof data.DataStatus === "string" ? data.DataStatus : data.DataStatus.String
            ]
        });
        this.initUserTableId(data, userTableIdData)
    }

    initUserTableId(data: any, userTableIdData: any) {
        let columnNames: any[] = ["id", "user_id", "created_at", "updated_at", "deleted_at", "data_status"];
        let columns: any[] = ["id", "user_id", "created_at", "updated_at", "deleted_at", "data_status"];
        const tableName = "user_table_" + data.ID.replaceAll("-", "")
        data.ColumnsInTable.RawMessage.map((c: any) => {
            columnNames.push(getColumnNameForSQLite(c.name.toLowerCase()))
            columns.push(`  ${getColumnNameForSQLite(c.name.toLowerCase())} ${getSQLiteType(c.type)}`);
        })
        const createSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (
                            ${columns.join(",\n")}
                            );`;

        this.db.exec(createSQL)
        const placeholders = columnNames.map(() => "?").join(", ");
        const insertSQL = `INSERT OR IGNORE INTO ${tableName} (
                            ${columnNames.join(",\n")}
                            ) VALUES (${placeholders});`;
        const dataUserTable = userTableIdData.filter((i: any) => i.name === tableName)
        dataUserTable[0].result.map((data: any) => {
            let value: any = [];
            columnNames.map((c: any) => {
                value.push(data[c])
            })
            this.db.exec({
                sql: insertSQL,
                bind: value
            });
        })
    }
    insertUserTableId(data: any) {
        console.log(data)

    }
    getUserTablesWithUserId(userId: string): UserTable[] | null {
        const rows = this.query("SELECT * FROM user_tables WHERE user_id = ?", [userId]) as UserTable[];
        return rows ?? null;
    }

    getUserTablesWithDataStatus(status: string): UserTable[] | null {
        const rows = this.query("SELECT * FROM user_tables WHERE data_status = ?", [status]) as UserTable[];
        return rows ?? null;
    }
    updateUserTableColumns(tableId: string, userTableColumns: any): void {
        const time = getCurrentTime()
        if (!this.db) throw new Error("Database not initialized");
        this.db.exec({
            sql: "UPDATE user_tables SET columns_in_table = ?, updated_at = ?, data_status= ? WHERE id = ?",
            bind: [JSON.stringify(userTableColumns), time, "pending", tableId],
        });
    }
    // projects
    insertProjects(data: any): void {
        if (!this.db) throw new Error("Database not initialized");
        console.log(data)
        this.db.exec({
            sql: "INSERT OR IGNORE INTO projects (id, name, creator_id, members, geo_ids, description, created_at, updated_at, deleted_at, data_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            bind: [data.ID, data.Name, data.CreatorID, JSON.stringify(data.Members.RawMessage), JSON.stringify(data.GeoIds.RawMessage), typeof data.Description === "string" ? data.Description : data.Description.String, data.CreatedAt, data.UpdatedAt,
            data.DeletedAt.Time,
            typeof data.DataStatus === "string" ? data.DataStatus : data.DataStatus.String]
        });
    }
    // geo_data
    insertGeoData(data: any): void {
        if (!this.db) throw new Error("Database not initialized");
        this.db.exec({
            sql: `INSERT OR IGNORE INTO geo_data
        (id, user_id, properties, color, project_ids, geometry_data, created_at, updated_at, deleted_at, data_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            bind: [
                data.ID,
                data.UserID,
                JSON.stringify(data.Properties.RawMessage),
                data.Color.String,
                JSON.stringify(data.ProjectIds.RawMessage),
                JSON.stringify(data.GeometryData.RawMessage),
                data.CreatedAt,
                data.UpdatedAt,
                data.DeletedAt.Time,
                data.DataStatus.String
            ]
        });

    }
    getGeoDataWithDataStatus(status: string): GeoData[] | null {
        const rows = this.query("SELECT * FROM geo_data WHERE data_status = ?", [status]) as GeoData[];
        return rows ?? null;
    }

    // ── Read ─────────────────────────────────────────────────────────────────
    getTasks(): Task[] {
        return this.query("SELECT * FROM tasks ORDER BY id DESC") as Task[];
    }

    getTask(id: number): Task | null {
        const rows = this.query("SELECT * FROM tasks WHERE id = ?", [id]) as Task[];
        return rows[0] ?? null;
    }

    // ── Update ────────────────────────────────────────────────────────────────
    updateTask(id: number, text: string): void {
        if (!this.db) throw new Error("Database not initialized");
        this.db.exec({
            sql: "UPDATE tasks SET text = ? WHERE id = ?",
            bind: [text, id],
        });
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    deleteTask(id: number): void {
        if (!this.db) throw new Error("Database not initialized");
        this.db.exec({ sql: "DELETE FROM tasks WHERE id = ?", bind: [id] });
    }
}

Comlink.expose(new Database());