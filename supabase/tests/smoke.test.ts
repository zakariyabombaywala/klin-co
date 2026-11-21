// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createTestDb } from "./pglite";

describe("migrations", () => {
  it("apply cleanly on a fresh database", async () => {
    const db = await createTestDb();
    const { rows } = await db.query<{ count: number }>(
      `select count(*)::int as count from pg_tables where schemaname = 'public'`,
    );
    expect(rows[0]?.count).toBeGreaterThanOrEqual(20);
  }, 60_000);
});
