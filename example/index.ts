import { drizzle } from "./config";
import { templates } from "./templates";

const compiled = drizzle.compile(templates, {
  dbType: "mysql",
  provider: "planetscale",
});

console.log(compiled);
