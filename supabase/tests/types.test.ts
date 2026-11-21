// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { Constants } from "../../src/types/database";
import { createTestDb } from "./pglite";

/**
 * Guards src/types/database.ts against drift from the migrations: every table,
 * view, column and enum value in the schema must appear in the types and vice versa.
 */
const typesSource = readFileSync(join(process.cwd(), "src/types/database.ts"), "utf8");

/** Column names of `<relation>: { Row: { ... } }` in the types file. */
function typedColumns(relation: string): string[] {
  const start = typesSource.search(new RegExp(`\\n      ${relation}: \\{\\n        Row: \\{`));
  if (start === -1) return [];
  const body = typesSource.slice(start).split("        };")[0] ?? "";
  return [...body.matchAll(/^ {10}([a-z_0-9]+)\??:/gm)].map((m) => m[1] ?? "").sort();
}

describe("src/types/database.ts", () => {
  it("matches the migrated schema", async () => {
    const db = await createTestDb();
    const { rows } = await db.query<{ relation: string; column_name: string }>(`
      select c.table_name as relation, c.column_name
      from information_schema.columns c
      join information_schema.tables t on t.table_schema = c.table_schema and t.table_name = c.table_name
      where c.table_schema = 'public'
      order by 1, 2`);
    const schema = new Map<string, string[]>();
    for (const row of rows) schema.set(row.relation, [...(schema.get(row.relation) ?? []), row.column_name]);

    for (const [relation, columns] of schema) {
      expect(typedColumns(relation), `columns of ${relation}`).toEqual([...columns].sort());
    }

    const enums = await db.query<{ name: string; values: string[] }>(`
      select t.typname as name, array_agg(e.enumlabel order by e.enumsortorder) as values
      from pg_type t join pg_enum e on e.enumtypid = t.oid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' group by t.typname`);
    const typedEnums = Constants.public.Enums as Record<string, readonly string[]>;
    expect(Object.keys(typedEnums).sort()).toEqual(enums.rows.map((e) => e.name).sort());
    for (const e of enums.rows) expect([...(typedEnums[e.name] ?? [])], `enum ${e.name}`).toEqual(e.values);
  }, 60_000);
});
