import { Template } from "karozu";
import { drizzle } from "./config";

export const drizzleConfig = new Template(drizzle, ({ props, utilities }) => ({
  title: `${utilities.toKebabCase("DrizzleConfig")}`,
  description: "This is the config for Drizzle",
  path: "drizzle.config.ts",
  template: `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "${utilities.capitalize(props.dbType)}",
  provider: "${props.provider}",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
  `,
}));

export const dbInstance = new Template(drizzle, ({ props }) => {
  const templates = {
    neon: `
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });`,
    planetscale: `
import { drizzle } from "drizzle-orm/planetscale-serverless";

export const db = drizzle({ connection: {
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
}});`,
    turso: `
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});
const db = drizzle({ client });`,
  };

  return {
    title: "DB Instance",
    description: "This is the db instance for Drizzle",
    path: "lib/db/schema.ts",
    template: templates[props.provider],
  };
});

export const templates = [drizzleConfig, dbInstance];
