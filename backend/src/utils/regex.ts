/** Escapes regex special characters to prevent ReDoS / unintended pattern injection. */
export const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
