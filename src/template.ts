import { z } from "zod";
import { Extension } from "./extension";

/**
 * Type of operation to perform on a file
 */
export type FileOperation = 
  | "create"   // Create a new file
  | "edit"     // Edit an existing file with string replacements
  | "append"   // Append content to an existing file
  | "delete";  // Delete a file

/**
 * Represents a string replacement operation for editing files
 */
export type Replacement = {
  /** Text to find in the file */
  oldString: string;
  /** Text to replace it with */
  newString: string;
};

/**
 * Configuration for a template, including metadata and content
 */
type TemplateConfig<E extends Extension<any, any>> = {
  /** Title of the template */
  title: string;
  /** Description of what the template does */
  description: string;
  /** **Absolute file path** where template will be generated (from root directory) */
  path: string;
  /** Operation to perform on the file */
  operation?: FileOperation;
} & (
  | {
      /** Operation is create (default) or not specified */
      operation?: "create";
      /** Template content string */
      template: string;
    }
  | {
      /** Operation is edit */
      operation: "edit";
      /** Array of replacements to perform */
      replacements: Replacement[];
    }
  | {
      /** Operation is append */
      operation: "append";
      /** Content to append to the file */
      content: string;
    }
  | {
      /** Operation is delete */
      operation: "delete";
    }
);

/**
 * Template object with configuration and extension
 */
export type CompiledTemplate<E extends Extension<any, any>> = TemplateConfig<E>;

/**
 * Function that generates a template configuration using extension props and utilities
 */
type TemplateFunction<E extends Extension<any, any>> = (context: {
  /** Extension props values */
  props: z.infer<E["config"]["props"]>;
  /** Extension utility functions */
  utilities: E["utilities"];
}) => TemplateConfig<E>;

/**
 * Template class for generating extension-specific template files
 * @template E Extension type this template belongs to
 */
export class Template<E extends Extension<any, any>> {
  /** Associated extension instance */
  private extension: E;
  /** Function to generate template config */
  private templateFn: TemplateFunction<E>;

  /**
   * Creates a new template instance
   * @param extension Extension this template belongs to
   * @param templateFn Function to generate template config
   */
  constructor(extension: E, templateFn: TemplateFunction<E>) {
    this.extension = extension;
    this.templateFn = templateFn;
  }

  /**
   * Compiles the template with given props
   * @param props Extension props to use in template
   * @returns Compiled template config with extension reference
   */
  compile(props: z.infer<E["config"]["props"]>) {
    const config = this.templateFn({
      props,
      utilities: this.extension.utilities,
    });

    // Set default operation to "create" if not specified
    if (!config.operation) {
      if ("template" in config) {
        (config as any).operation = "create";
      }
    }

    return {
      ...config,
      // extension: this.extension,
    };
  }
}
