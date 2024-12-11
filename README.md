# Karozu

A type-safe declarative approach to dynamic code generation.

Karozu means `schematic` in Japanese 😊

## How to use

1. Define an Extension with the props and dependencies you need. You can also pass utility functions to use in your templates. This is helpful for string manipulation, date formatting, etc.
```typescript file="extension/config.ts"
import { z } from "zod";
import { Extension } from "karozu";
import { baseUtilities } from "karozu/utils";

// ---------Define Props---------
export const propSchema = z.object({
  dbType: z.enum(["postgres", "mysql", "sqlite"]),
  provider: z.enum(["neon", "turso", "planetscale"]),
});

// ---------Create Extension---------
export const drizzle = new Extension({
  name: "drizzle-orm",
  version: "1.0.0",
  description: "Drizzle ORM for Next.js",
  author: "@nicoalbanese10",
  props: propSchema,
  postInstallScripts: (props) => [],
  dependencies: (props) => ({
    default: [
      {
        packageName: "drizzle-orm",
        version: "^2.0.0",
      },
      {
        packageName: "drizzle-kit",
        version: "^2.0.0",
        dev: true,
      },
    ],
    dbType: {
      postgres: [
        {
          packageName: "pg",
          version: "^8.7.1",
        },
      ],
      mysql: [
        {
          packageName: "mysql2",
          version: "^3.6.0",
        },
      ],
      sqlite: [
        {
          packageName: "@libsql/client",
          version: "^0.5.0",
        },
        {
          packageName: "better-sqlite3",
          version: "^9.0.0",
        },
      ],
    },
    provider: {
      neon: [
        {
          packageName: "@neondatabase/serverless",
          version: "^0.7.0",
        },
      ],
      planetscale: [
        {
          packageName: "planetscale",
          version: "latest",
        },
      ],
      turso: [
        {
          packageName: "@turso/client",
          version: "^0.1.0",
        },
      ],
    },
  }),
  utilities: {
    ...baseUtilities,
    capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
    formatDate: (date: Date) => date.toISOString(),
  },
});
```

2. Define your templates. You can use the props and utilities you defined in the extension with full type-safety.
```typescript file="extension/templates.ts"
// ---------Usage---------
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

// More templates...
```

3. Finally, compile your extension with the templates and props:
```typescript file="extension/index.ts"
import { drizzle } from "./config";
import { templates } from "./templates";

const compiled = drizzle.compile(templates, {
  dbType: "mysql",
  provider: "planetscale",
});

console.log(compiled);
/*

This will return:

{
  dependencies: [ 'drizzle-orm', 'mysql2', 'planetscale' ],
  devDependencies: [ 'drizzle-kit' ],
  templates: [
    {
      title: 'drizzle-config',
      description: 'This is the config for Drizzle',
      path: 'drizzle.config.ts',
      template: 'import { defineConfig } from "drizzle-kit";\n' +
        '\n' +
        'export default defineConfig({\n' +
        '  dialect: "Mysql",\n' +
        '  provider: "planetscale",\n' +
        '  schema: "./src/schema.ts",\n' +
        '  out: "./drizzle",\n' +
        '});\n' +
        '  '
    },
    // More templates...
  ]
}

*/
```