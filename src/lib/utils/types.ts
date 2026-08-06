/**
 * Preserves autocomplete for known string literals while still accepting any
 * string. Using `T | string` would collapse the union to `string`, causing
 * editors to discard suggestions for the literals in `T`.
 */
export type LiteralUnion<T extends string> = T | (string & {});
