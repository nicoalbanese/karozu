import { z } from "zod";
import { CompiledTemplate, Template } from "./template";

type Dependency = {
  packageName: string;
  version: "latest" | string;
  dev?: boolean;
};

type DependencyConfig<T extends z.ZodObject<any>> = {
  default?: Array<Dependency>;
} & {
  [K in keyof z.infer<T>]?: {
    [V in z.infer<T>[K]]?: Array<Dependency>;
  };
};

type UtilityFunction = (...args: any) => any;
type InstallScript = {
  name?: string;
  description?: string;
  /** should not include the package manager, should be everything after the package manager ie `install` instead of `pnpm install` */
  script: string;
};

type PackageJSONCommand = {
  description?: string;
  /** should be the command to run, examples: `node dist/index.js`, `next dev`, `eslint .` */
  command: string;
};

type ExtensionConfig<
  T extends z.ZodObject<any>,
  U = Record<string, UtilityFunction>,
> = {
  name: string;
  version: string;
  description: string;
  author: string;
  props: T;
  dependencies: (props: z.infer<T>) => DependencyConfig<T>;
  utilities?: U;
  postInstallScripts?: (props: z.infer<T>) => InstallScript[];
  commands?: (props: z.infer<T>) => PackageJSONCommand[];
};

export class Extension<
  T extends z.ZodObject<any>,
  U = Record<string, UtilityFunction>,
> {
  public readonly config: ExtensionConfig<T, U>;
  public readonly utilities: U;

  constructor(config: ExtensionConfig<T, U>) {
    this.config = config;
    this.utilities = config.utilities as U;
  }

  compile(templates: Template<Extension<T, U>>[], values: z.infer<T>) {
    const deps: string[] = [];
    const devDeps: string[] = [];
    const dependencies = this.config.dependencies(values);
    const compiledTemplates: CompiledTemplate<Extension<T, U>>[] = [];

    // Process dependencies
    if (dependencies.default) {
      dependencies.default.forEach((dep) => {
        if (dep.dev) {
          devDeps.push(dep.packageName);
        } else {
          deps.push(dep.packageName);
        }
      });
    }

    // Add dependencies based on provided values
    (
      Object.entries(values) as [
        keyof z.infer<T>,
        z.infer<T>[keyof z.infer<T>],
      ][]
    ).forEach(([key, value]) => {
      const categoryDeps = dependencies[key];
      if (categoryDeps && typeof value !== "undefined") {
        const specificDeps = (
          categoryDeps as Record<
            string | number | symbol,
            Array<Dependency> | undefined
          >
        )[value];
        if (specificDeps) {
          specificDeps.forEach((dep) => {
            if (dep.dev) {
              devDeps.push(dep.packageName);
            } else {
              deps.push(dep.packageName);
            }
          });
        }
      }
    });

    // Process templates
    templates.forEach((template) => {
      const compiled = template.compile(values);
      compiledTemplates.push(compiled);
    });

    const postInstallScripts = this.config.postInstallScripts
      ? this.config.postInstallScripts(values)
      : [];
    const commands = this.config.commands ? this.config.commands(values) : [];

    return {
      dependencies: deps,
      devDependencies: devDeps,
      templates: compiledTemplates,
      postInstallScripts,
      commands,
    };
  }
}
