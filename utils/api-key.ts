import { ApiKeyEnvironment } from "@/types/api-key";

export const formatSecret = (secret: string, revealed: boolean = false) => {
  if (revealed) return secret;
  if (secret.length <= 10) return "••••••••••";
  return `${secret.slice(0, 10)}••••••••••${secret.slice(-4)}`;
};

export const generateSecret = (env: ApiKeyEnvironment) => {
  const rand = () => Math.random().toString(36).slice(2, 8);
  const prefix = env === "production" ? "live" : env === "staging" ? "test" : "dev";
  return `groot_${prefix}_${rand()}${rand()}${rand()}`;
};
