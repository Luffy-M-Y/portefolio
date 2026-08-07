import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, unknown>[]> {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!);
  }
  return _sql(strings, ...values) as Promise<Record<string, unknown>[]>;
}

export default sql;


export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      technologies TEXT[] NOT NULL,
      image_url TEXT,
      media TEXT[] DEFAULT '{}',
      github_url TEXT,
      demo_url TEXT,
      status VARCHAR(50) DEFAULT 'completed',
      type VARCHAR(50) DEFAULT 'personal',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS media TEXT[] DEFAULT '{}'`;
  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      domain VARCHAR(100) NOT NULL,
      name VARCHAR(100) NOT NULL,
      level VARCHAR(50) NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS timeline (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT,
      year VARCHAR(20),
      sort_order INT DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT
    )
  `;
}
