import { z } from "zod";
import { Extension } from "./extension";

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
  /** Template content string */
  template: string;
};

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

    return {
      ...config,
      // extension: this.extension,
    };
  }
}
