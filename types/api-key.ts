export type ApiKey = {
  id: string;
  name: string;
  secret: string;
  status: "active" | "revoked";
  scopes: string[];
  created_at: string;
  last_used: string | null;
  environment: "production" | "staging" | "development";
  updated_at: string;
};

export type ApiKeyEnvironment = "production" | "staging" | "development";
export type ApiKeyStatus = "active" | "revoked";
export type ToastType = "success" | "error" | "info";

export type CreateApiKeyData = {
  name: string;
  secret: string;
  scopes: string[];
  environment: ApiKeyEnvironment;
};

export type UpdateApiKeyData = {
  name?: string;
  scopes?: string[];
  environment?: ApiKeyEnvironment;
  status?: ApiKeyStatus;
  secret?: string;
  last_used?: string;
};
