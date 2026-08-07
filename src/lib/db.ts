import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
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
}
