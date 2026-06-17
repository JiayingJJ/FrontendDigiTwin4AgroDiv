export type WorkerAction = 'init' | 'sync' | 'query' | 'execute' | 'close' | 'export' | 'INIT_DB' |'INIT_DB_RESPONSE';

export type WorkerMessage = {
    type: WorkerAction;
}

export interface User {
  id:    string;
  name:  string;
  email: string;
}

export interface WorkerRequest {
  id:      number;
  action:  WorkerAction;
  payload: WorkerPayload;
}

export type WorkerPayload =
  | Record<string, never>                        // init, close
  | { users: User[] }                            // sync
  | { sql: string; params?: unknown[] }          // query, execute

export interface WorkerResponse {
  id:      number;
  result?: unknown;
  error?:  string;
}

// Query Ergebnis
export type QueryResult<T = Record<string, unknown>> = T[];

export interface UserTable {
    ID: string;
    UserID: string;
    TableName: string;
    ColumnsInTable: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string;
    DataStatus: string;
}
export interface GeoData {
    ID: string;
    TableID: string;
    ColumnID: string;
    Properties: string;
    GeometryData: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string;
    DataStatus: string;
}
export interface DatabaseForm {
  user_tables: UserTable[],
  geo_data: GeoData[]
}