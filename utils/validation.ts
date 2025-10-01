export const MAX_PROMPT_LENGTH = 2000;
export const MAX_LOG_LENGTH = 50000;

/**
 * A simple input sanitizer to remove characters commonly used in XSS attacks.
 * This serves as a defense-in-depth measure. The primary protection against
 * XSS is React's automatic content escaping.
 * @param input The string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (input: string): string => {
  // Removes < and > characters to prevent HTML tag injection.
  return input.replace(/[<>]/g, '');
};