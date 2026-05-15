import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .describe("PostgreSQL connection string"),
  API_PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000)
    .describe("Port the API server listens on"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("[env] Invalid environment configuration:");
  for (const [field, messages] of Object.entries(result.error.flatten().fieldErrors)) {
    console.error(`  ${field}: ${messages?.join(", ")}`);
  }
  process.exit(1);
}

export const env = result.data;
