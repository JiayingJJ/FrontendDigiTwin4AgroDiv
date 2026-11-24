export type WorkerAction = 'init' | 'sync' | 'query' | 'execute' | 'close' | 'export' | 'INIT_DB' | 'INIT_DB_RESPONSE';

export type WorkerMessage = {
  type: WorkerAction;
}

export interface WorkerRequest {
  id: number;
  action: WorkerAction;
  payload: WorkerPayload;
}

export type WorkerPayload =
  | Record<string, never>                        // init, close
  | { users: User[] }                            // sync
  | { sql: string; params?: unknown[] }          // query, execute

export interface WorkerResponse {
  id: number;
  result?: unknown;
  error?: string;
}

// Query Ergebnis
export type QueryResult<T = Record<string, unknown>> = T[];
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  data_status: string;
}

export interface UserTable {
  ID: string;
  UserID: string;
  TableName: string;
  ProjectID: string;
  ColumnsInTable: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  DataStatus: string;
}
export interface ProjectsParams {
  ID: string;
  Name: string;
  CreatorID: string;
  Members: string;
  GeoIds: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  DataStatus: string;
}export interface GeoData {
  ID: string;
  UserID: string;
  ProjectIds: string;
  Properties: string;
  Color: string;
  GeometryData: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  DataStatus: string;
}
export interface DatabaseForm {
  user_tables: UserTable[],
  geo_data: GeoData[],
  projects: ProjectsParams[],
}