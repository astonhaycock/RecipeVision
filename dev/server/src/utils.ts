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
 * Sanitize a string. Remove symbols other than whitespace and letters.
 * Verify that it's a string.
 * Convert to lowercase. Return null if the resulting string is empty.
 * @param input The string to sanitize
 * @returns The sanitized string or null
 */
function sanitize_string(input: string): string | null {
  if (typeof input === "string") {
    const satanized = input
      .replace(/[^a-zA-Z\s]/g, "")
      .toLowerCase()
      .trim();
    return satanized.length === 0 ? null : satanized;
  }
  return null;
}

/**
 * Sanitize a list of strings. Remove symbols other than whitespace and letters.
 * Verify that it's an array of strings. Deduplicate the list.
 * Convert to lowercase. Return null if it's not a list of strings,
 * or if the resulting list is empty.
 * This function modifies the list in place, but returns it for convenience.
 * @param input The list of strings to sanitize
 * @returns The sanitized list or null
 */
function sanitize_list(input: string[]): string[] | null {
  if (Array.isArray(input) && input.every((i) => typeof i === "string")) {
    for (let i = 0; i < input.length; i++) {
      input[i] = sanitize_string(input[i]) || "";
    }
    const list = dedup(input.filter((i) => i.length > 0));
    if (list.length === 0) {
      return null;
    }
    return list;
  }
  return null;
}

export { dedup, sanitize_string, sanitize_list };
