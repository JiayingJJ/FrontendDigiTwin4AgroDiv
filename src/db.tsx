import type {
  User,
  WorkerAction,
  WorkerPayload,
  WorkerRequest,
  WorkerResponse,
  QueryResult,
} from './types';
import DbWorker from './worker.tsx?worker'
export class DBBridge {
  private worker:  Worker | null = null;
  private pending: Map<number, {
    resolve: (value: unknown)  => void;
    reject:  (reason: Error)   => void;
  }> = new Map();
  private nextId = 1;

  // ─── Worker starten ─────────────────────────────────────────────────────────
  start(): void {
    this.worker = new DbWorker();

    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, result, error } = event.data;
      const pending = this.pending.get(id);

      if (!pending) return;
      this.pending.delete(id);

      if (error) {
        pending.reject(new Error(error));
      } else {
        pending.resolve(result);
      }
    };

    this.worker.onerror = (e: ErrorEvent) => {
      console.error('❌ Worker Fehler:', e.message);
    };
  }

  // ─── Nachricht an Worker schicken ───────────────────────────────────────────
  private send<T>(action: WorkerAction, payload: WorkerPayload = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker nicht gestartet – rufe start() auf'));
        return;
      }

      const id = this.nextId++;
      this.pending.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
      });

      const request: WorkerRequest = { id, action, payload };
      this.worker.postMessage(request);
    });
  }

  // ─── Öffentliche API ────────────────────────────────────────────────────────
  init(): Promise<{ ok: boolean }> {
    return this.send('init');
  }

  sync(users: User[]): Promise<{ ok: boolean; count: number }> {
     const normalized = users.map(u => ({
    id:    (u as any).ID    ?? u.id,
    name:  (u as any).Name  ?? u.name,
    email: (u as any).Email ?? u.email,
  }));

  return this.send('sync', { users: normalized });
  }

  query<T = Record<string, unknown>>(
    sql:    string,
    params: unknown[] = []
  ): Promise<QueryResult<T>> {
    return this.send('query', { sql, params });
  }

  execute(sql: string): Promise<{ ok: boolean }> {
    return this.send('execute', { sql });
  }

  close(): Promise<{ ok: boolean }> {
    return this.send('close');
  }

  export(): Promise<Uint8Array> {
    return this.send('export');
}
}