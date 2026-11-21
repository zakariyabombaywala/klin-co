import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z
    .string({ message: "SUPABASE_SECRET_KEY is missing" })
    .min(20, "SUPABASE_SECRET_KEY looks too short"),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

/** Server-only secrets. Importing this from a client component fails the build. */
export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse({
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || undefined,
  });
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.message}`).join("\n");
    throw new Error(`Invalid server environment variables (see .env.example):\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}
