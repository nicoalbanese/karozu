/**
 * Base utilities
 *
 */
export const baseUtilities = {
  /**
   * Transforms a string to CamelCase
   *
   * @param {string} s - String to transform
   * @returns {string} Converted string
   */
  camelCase: (s: string) =>
    s ? s.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()) : "",
  // ...add any other utility function
  /**
   * Transforms a string to UPPERCASE
   *
   * @param {string} input - String to transform
   * @returns {string} Converted string
   */
  upperCase: (input: string) => input.toUpperCase(),
  /**
   * Transforms a string to lowercase
   *
   * @param {string} input - String to transform
   * @returns {string} Converted string
   */
  lowerCase: (input: string) => input.toLowerCase(),
};
