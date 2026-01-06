import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export async function initializePool() {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    user: import.meta.env.VITE_DB_USER || 'root',
    password: import.meta.env.VITE_DB_PASSWORD || '',
    database: import.meta.env.VITE_DB_NAME || 'alumni_connect',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function getConnection() {
  const pool = await initializePool();
  return pool.getConnection();
}

export async function query<T = any>(sql: string, values?: any[]): Promise<T[]> {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results as T[];
  } finally {
    connection.release();
  }
}

export async function execute(sql: string, values?: any[]) {
  const connection = await getConnection();
  try {
    const [result] = await connection.execute(sql, values);
    return result;
  } finally {
    connection.release();
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
