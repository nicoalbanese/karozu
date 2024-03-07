import * as fs from "fs";
import type { KarozuOptions } from "./index";
import * as path from "path";
import * as util from "util";

// Convert fs functions to versions that return promises.
// const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

let isCompiling = false;

const updateConsole = (templateDir: string) => {
  console.clear();
  console.log("Karozu Watcher");
  console.log("Listening for changes in:", templateDir);
  console.log("---------------");
};

export function watch(options: KarozuOptions<any>) {
  updateConsole(options.templateDir);
  const templatesDir = path.join(process.cwd(), options.templateDir);
  fs.watch(templatesDir, { recursive: true }, async (_, filename) => {
    if (isCompiling) {
      return;
    }

    if (!filename) {
      return;
    }

    const ext = path.extname(filename);

    if (ext === ".ts" && !filename.endsWith("compiled.ts")) {
      isCompiling = true;
      const filePath = path.join(templatesDir, filename);

      // Clear the require cache to ensure new values are used on import
      delete require.cache[require.resolve(filePath)];

      // Import the TemplateFile instance
      const templateMod = require(filePath);
      const templateFile = templateMod.default;

      if (
        !templateFile ||
        typeof templateFile.compileTestTemplate !== "function"
      ) {
        console.error(
          `\nERROR:\nThe file doesn't export a TemplateFile instance.\n`,
        );
        isCompiling = false;
        return;
      }

      // Compile
      const compiledText = templateFile.compileTestTemplate();

      // Write output text
      const outputPath = filePath.replace(
        "template.ts",
        options.outputFileName,
      );
      await writeFile(outputPath, compiledText);

      isCompiling = false;
      console.log(
        `[${new Date().toUTCString().split(" ").slice(4, 5)}] ` +
          `File compiled: ${filePath.slice(outputPath.indexOf("src/"))}`,
      );
    }
  });
}
