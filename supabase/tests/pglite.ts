import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

/**
 * Minimal stand-ins for the parts of a Supabase database the migrations rely
 * on: the API roles, auth.users + auth.uid(), and the storage tables. This lets
 * the real migration files run in WebAssembly Postgres, with no Docker needed.
 */
const supabaseStub = /* sql */ `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant anon, authenticated, service_role to postgres;

  create schema auth;
  create table auth.users (
    id uuid primary key default gen_random_uuid(),
    email text,
    raw_user_meta_data jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
  );
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;

  create schema storage;
  create table storage.buckets (
    id text primary key, name text not null, public boolean default false,
    file_size_limit bigint, allowed_mime_types text[]
  );
  create table storage.objects (
    id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets (id),
    name text, owner uuid
  );
  alter table storage.objects enable row level security;
  grant usage on schema storage to anon, authenticated, service_role;
  grant all on storage.objects, storage.buckets to anon, authenticated, service_role;

  -- Supabase grants table access to the API roles and relies on RLS.
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
`;

const migrationsDir = join(process.cwd(), "supabase", "migrations");

export async function createTestDb(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(supabaseStub);
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    try {
      await db.exec(readFileSync(join(migrationsDir, file), "utf8"));
    } catch (error) {
      throw new Error(`Migration ${file} failed: ${(error as Error).message}`);
    }
  }
  return db;
}

export type Actor = { role: "anon" } | { role: "service_role" } | { role: "authenticated"; userId: string };

/**
 * Runs `fn` as an API role inside a transaction that is always rolled back,
 * so each check starts from the same data.
 */
export async function as<T>(db: PGlite, actor: Actor, fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${actor.role}`);
    const sub = actor.role === "authenticated" ? actor.userId : "";
    await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [sub]);
    const result = await fn(tx);
    await tx.rollback();
    return result;
  });
}

/** Like `as`, but commits, for setting up fixtures as a given role. */
export async function asCommitted<T>(db: PGlite, actor: Actor, fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${actor.role}`);
    const sub = actor.role === "authenticated" ? actor.userId : "";
    await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [sub]);
    return fn(tx);
  });
}

export type Tx = Parameters<Parameters<PGlite["transaction"]>[0]>[0];

export async function createUser(db: PGlite, email: string, fullName?: string): Promise<string> {
  const { rows } = await db.query<{ id: string }>(
    `insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id`,
    [email, JSON.stringify(fullName ? { full_name: fullName } : {})],
  );
  const id = rows[0]?.id;
  if (!id) throw new Error("user insert failed");
  return id;
}
