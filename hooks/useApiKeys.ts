import { useState, useEffect, useCallback } from "react";
import { ApiKey, CreateApiKeyData, UpdateApiKeyData } from "@/types/api-key";

type FilterStatus = "all" | "active" | "revoked";
type FilterEnvironment = "all" | "production" | "staging" | "development";

export const useApiKeys = (
  filterStatus: FilterStatus = "all",
  filterEnvironment: FilterEnvironment = "all"
) => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterEnvironment !== "all") params.append("environment", filterEnvironment);
      
      const response = await fetch(`/api/keys?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }
      const result = await response.json();
      setKeys(result.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching keys:", err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterEnvironment]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createKey = async (data: CreateApiKeyData): Promise<ApiKey | null> => {
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create API key");
      }

      const result = await response.json();
      await fetchKeys();
      return result.data;
    } catch (err) {
      console.error("Error creating key:", err);
      throw err;
    }
  };

  const updateKey = async (id: string, data: UpdateApiKeyData): Promise<ApiKey | null> => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update API key");
      }

      const result = await response.json();
      await fetchKeys();
      return result.data;
    } catch (err) {
      console.error("Error updating key:", err);
      throw err;
    }
  };

  const deleteKey = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }

      await fetchKeys();
    } catch (err) {
      console.error("Error deleting key:", err);
      throw err;
    }
  };

  const rotateKey = async (id: string, environment: ApiKey["environment"]): Promise<void> => {
    const { generateSecret } = await import("@/utils/api-key");
    await updateKey(id, {
      secret: generateSecret(environment),
      last_used: new Date().toISOString(),
    });
  };

  const toggleKeyStatus = async (id: string, currentStatus: ApiKey["status"]): Promise<void> => {
    await updateKey(id, {
      status: currentStatus === "active" ? "revoked" : "active",
    });
  };

  return {
    keys,
    loading,
    error,
    fetchKeys,
    createKey,
    updateKey,
    deleteKey,
    rotateKey,
    toggleKeyStatus,
  };
};
