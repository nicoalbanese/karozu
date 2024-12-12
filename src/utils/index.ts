/**
 * Base utility functions for string manipulation and path formatting
 * Contains common operations like case conversion, path formatting, and string truncation
 */
export const baseUtilities = {
  /**
   * Formats a file path by replacing backslashes with forward slashes
   * @param path - The file path to format
   * @returns The formatted path with forward slashes
   */
  formatPath: (path: string) => path.replace(/\\/g, "/"),

  /**
   * Converts a string to kebab-case
   * @param str - The string to convert
   * @returns The kebab-cased string
   */
  toKebabCase: (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),

  /**
   * Converts a kebab-case string to camelCase
   * @param str - The kebab-case string to convert
   * @returns The camelCased string
   */
  toCamelCase: (str: string) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()),

  /**
   * Converts a string to Title Case
   * @param str - The string to convert
   * @returns The Title Cased string
   */
  toTitleCase: (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),

  /**
   * Removes whitespace from both ends of a string
   * @param str - The string to trim
   * @returns The trimmed string
   */
  trim: (str: string) => str.trim(),

  /**
   * Truncates a string to a specified length and adds ellipsis if needed
   * @param str - The string to truncate
   * @param length - The maximum length before truncation
   * @returns The truncated string with ellipsis if truncated
   */
  truncate: (str: string, length: number) => str.length > length ? str.substring(0, length) + '...' : str
};

export type BaseUtilities = typeof baseUtilities;