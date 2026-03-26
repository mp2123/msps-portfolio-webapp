declare module "pg" {
  export interface PoolConfig {
    connectionString?: string;
    ssl?: boolean | { rejectUnauthorized?: boolean };
  }

  export class Pool {
    constructor(config?: PoolConfig);

    query<T = unknown>(text: string, params?: unknown[]): Promise<{ rows: T[] }>;
    end(): Promise<void>;
  }
}
