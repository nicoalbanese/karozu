import { drizzle } from "./config";
import { templates } from "./templates";

// Compile all templates with our props
const compiled = drizzle.compile(templates, {
  dbType: "mysql",
  provider: "planetscale",
});

// Log all templates for demonstration
console.log("All compiled templates:");
console.log(JSON.stringify(compiled, null, 2));

// For a real-world implementation, you would process each compiled template based on its operation
// Here's an example of how you might process the templates:
console.log("\nExample implementation of processing templates:");
compiled.templates.forEach((template) => {
  console.log(`\nProcessing: ${template.title} (${template.path})`);

  switch (template.operation) {
    case "create":
      console.log(
        `Would create file at ${template.path} with content: ${template.template.substring(0, 30)}...`,
      );
      break;

    case "edit":
      console.log(
        `Would edit file at ${template.path} with ${template.replacements.length} replacements`,
      );
      template.replacements.forEach((replacement, index) => {
        console.log(
          `  ${index + 1}. Replace "${replacement.oldString}" with "${replacement.newString}"`,
        );
      });
      break;

    case "append":
      console.log(
        `Would append to file at ${template.path} with content: ${template.content.substring(0, 30)}...`,
      );
      break;

    case "delete":
      console.log(`Would delete file at ${template.path}`);
      break;

    default:
      console.log(`Unknown operation for ${template.path}`);
  }
});
