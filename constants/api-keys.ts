export const scopeOptions = ["read", "write", "admin", "delete"] as const;
export const environmentOptions = ["production", "staging", "development"] as const;

export type ScopeOption = typeof scopeOptions[number];
export type EnvironmentOption = typeof environmentOptions[number];
