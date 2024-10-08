// This file defines utilities to be used elsewhere. What else did you expect?

function purint(text: string) {
  console.log(`\x1b[95m${text}\x1b[0m`);
}

/**
 *  Sort a list and deduplicate items
 *  Returns the list for convenience, but modifies the list in place
 *  @param list The list to deduplicate
 *  @param fn An optional comparison function
 *  @returns The deduplicated list
 */
//TODO: A library utility for this would be a little faster, though it doesn't make
//TODO: a difference in this particular location.
function dedup<T>(list: Array<T>, fn?: (a: T, b: T) => number): Array<T> {
  list.sort(fn);
  if (fn === undefined) {
    fn = (a, b) => (a == b ? 0 : 1);
  }
  for (let i = list.length - 1; i > 0; i--) {
    if (fn(list[i], list[i - 1]) === 0) {
      list[i] = list[list.length - 1];
      list.pop();
    }
  }
  return list;
}

/**
 * Verify a string.
 * This function returns false on the following conditions:
 * - The input is not a string
 * - The input is longer than 50 characters
 * - The input has illegal symbols, capitals, or numbers
 * - The input has leading or trailing whitespace
 * - The input has multiple spaces in a row
 * The reason is to fail loudly and early so that the clients don't wind up with
 * unexpected or mishandled data.
 * @param input The string to sanitize
 * @returns True if the string is valid
 */
function string_valid(input: string): boolean {
  if (typeof input === "string") {
    if (input.length > 50) {
      return false;
    }
    if (input.match(/^[a-z]( [a-z]|[a-z])+$/)) {
      return true;
    }
  }
  return false;
}

/**
 * Verify a list of strings. This function returns a string describing the issue
 * on the following conditions:
 * - The input is not an array
 * - The input contains an object that is not a string
 * - A string is longer than 50 characters
 * - A string has illegal symbols, capitals, or numbers
 * - A string has leading or trailing whitespace
 * - A string has multiple spaces in a row
 * @param input The list of strings to sanitize
 * @returns The error, or null if the list is valid
 */
function list_valid(input: string[]): string | null {
  if (Array.isArray(input)) {
    for (let i = 0; i < input.length; i++) {
      if (!string_valid(input[i])) {
        return `invalid string in list: ${input[i]}`;
      }
    }
    return null;
  }
  return "invalid list";
}

/**
 * Parse and sanitize a list of strings generated by ChatGPT.
 * This function does the following things, returning null if it fails:
 * - Parse the JSON response
 * - Ensure the response is an array
 * The function then sanitizes the list, doing the following:
 * - Remove items that are not strings
 * - Trim strings, remove symbols and numbers, and lowercase them
 * - Fix instances of multiple spaces in a row
 * - Remove strings that are still over 50 characters
 * - Remove empty strings
 * - Deduplicate the list
 * This function does not fail loudly (except when returning null)
 * as the input's quality can't be guaranteed.
 * We do what we can with what we have.
 * @param input The string to parse and sanitize
 * @returns The sanitized list
 */
function parse_ai_response(input: string): string[] | null {
  try {
    const list = JSON.parse(input);
    if (!Array.isArray(list)) {
      throw new Error();
    }
    for (let i = list.length - 1; i >= 0; i--) {
      if (typeof list[i] !== "string") {
        list.splice(i, 1);
        continue;
      }
      list[i] = list[i].trim().replace(/  +/g, " ").toLowerCase();
      if (list[i].length > 50) {
        list.splice(i, 1);
      }
    }
    return dedup(list);
  } catch {
    return null;
  }
}

export { dedup, string_valid, list_valid, parse_ai_response, purint };
