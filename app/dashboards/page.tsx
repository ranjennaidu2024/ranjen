"use client";

import { useMemo, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

type ApiKey = {
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

const scopeOptions = ["read", "write", "admin", "delete"] as const;
const environmentOptions = ["production", "staging", "development"] as const;

const formatSecret = (secret: string, revealed: boolean = false) => {
  if (revealed) return secret;
  if (secret.length <= 10) return "••••••••••";
  return `${secret.slice(0, 10)}••••••••••${secret.slice(-4)}`;
};

const generateSecret = (env: string) => {
  const rand = () => Math.random().toString(36).slice(2, 8);
  const prefix = env === "production" ? "live" : env === "staging" ? "test" : "dev";
  return `groot_${prefix}_${rand()}${rand()}${rand()}`;
};

export default function GrootApiKeyDashboard() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newScopes, setNewScopes] = useState<string[]>(["read"]);
  const [newEnvironment, setNewEnvironment] = useState<"production" | "staging" | "development">("development");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "revoked">("all");
  const [filterEnvironment, setFilterEnvironment] = useState<"all" | "production" | "staging" | "development">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch API keys from the database
  useEffect(() => {
    fetchKeys();
  }, [filterStatus, filterEnvironment]);

  const fetchKeys = async () => {
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
  };
  
  const editingKey = useMemo(
    () => keys.find((k) => k.id === editingId),
    [editingId, keys]
  );
  const [editDraft, setEditDraft] = useState<{ 
    name: string; 
    scopes: string[];
    environment: "production" | "staging" | "development";
  }>({ name: "", scopes: [], environment: "development" });

  // Helper function to show toast notifications
  const showToastNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const toggleScope = (
    scopes: string[],
    scope: string,
    setter: (s: string[]) => void
  ) => {
    const next = scopes.includes(scope)
      ? scopes.filter((s) => s !== scope)
      : [...scopes, scope];
    setter(next);
  };

  const filteredKeys = useMemo(() => {
    return keys.filter((key) => {
      const statusMatch = filterStatus === "all" || key.status === filterStatus;
      const envMatch = filterEnvironment === "all" || key.environment === filterEnvironment;
      return statusMatch && envMatch;
    });
  }, [keys, filterStatus, filterEnvironment]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewName("");
    setNewScopes(["read"]);
    setNewEnvironment("development");
  };

  const createKey = async () => {
    if (!newName.trim()) return;
    
    try {
      const newKey = {
        name: newName.trim(),
        secret: generateSecret(newEnvironment),
        scopes: newScopes.length ? newScopes : ["read"],
        environment: newEnvironment,
      };

      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKey),
      });

      if (!response.ok) {
        throw new Error("Failed to create API key");
      }

      await fetchKeys(); // Refresh the list
      closeModal();
      showToastNotification("API key created successfully!", "success");
    } catch (err) {
      console.error("Error creating key:", err);
      showToastNotification("Failed to create API key. Please try again.", "error");
    }
  };

  const startEdit = (key: ApiKey) => {
    setEditingId(key.id);
    setEditDraft({ name: key.name, scopes: [...key.scopes], environment: key.environment });
  };

  const saveEdit = async () => {
    if (!editingId || !editDraft.name.trim()) return;
    
    try {
      const response = await fetch(`/api/keys/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editDraft.name.trim(),
          scopes: editDraft.scopes,
          environment: editDraft.environment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update API key");
      }

      await fetchKeys(); // Refresh the list
      setEditingId(null);
      showToastNotification("API key updated successfully!", "success");
    } catch (err) {
      console.error("Error updating key:", err);
      showToastNotification("Failed to update API key. Please try again.", "error");
    }
  };

  const rotateKey = async (id: string) => {
    const key = keys.find((k) => k.id === id);
    if (!key) return;
    
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: generateSecret(key.environment),
          last_used: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rotate API key");
      }

      await fetchKeys(); // Refresh the list
    } catch (err) {
      console.error("Error rotating key:", err);
      alert("Failed to rotate API key. Please try again.");
    }
  };

  const toggleStatus = async (id: string) => {
    const key = keys.find((k) => k.id === id);
    if (!key) return;
    
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: key.status === "active" ? "revoked" : "active",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle API key status");
      }

      await fetchKeys(); // Refresh the list
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to toggle API key status. Please try again.");
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this API key? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }

      await fetchKeys(); // Refresh the list
      showToastNotification("API key deleted successfully!", "error");
    } catch (err) {
      console.error("Error deleting key:", err);
      showToastNotification("Failed to delete API key. Please try again.", "error");
    }
  };

  const toggleRevealSecret = (id: string) => {
    setRevealedSecrets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copySecret = async (secret: string, id: string) => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopiedId(id);
      showToastNotification("Copied API Key to clipboard", "success");
    } catch (err) {
      console.error("Failed to copy:", err);
      showToastNotification("Failed to copy API key", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar 
        activePage="overview" 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className={`overflow-auto transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-0"}`}>
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <span>Pages</span>
            <span>/</span>
            <span className="text-zinc-900">Overview</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Overview
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-zinc-200">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-zinc-700">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50"
                  title="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50"
                  title="Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a 
                  href="mailto:contact@example.com"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50"
                  title="Email"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Current Plan Card */}
          <div className="rounded-3xl bg-gradient-to-br from-pink-200/60 via-purple-200/60 to-blue-300/60 p-8 backdrop-blur-sm mb-8">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-wider text-black/70">
                    Current Plan
                  </p>
                  <h2 className="text-5xl font-bold text-black">
                    Researcher
                  </h2>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-black">API Usage</p>
                      <svg className="h-4 w-4 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-black/70">Monthly plan</p>
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-full max-w-2xl rounded-full bg-white/30">
                        <div className="h-2 w-0 rounded-full bg-white"></div>
                      </div>
                      <span className="ml-4 text-sm font-medium text-black whitespace-nowrap">
                        0/1,000 Credits
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/30 transition-colors hover:bg-white/40">
                      <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white shadow-lg transition-transform"></span>
                    </button>
                    <span className="text-sm font-medium text-black">Pay as you go</span>
                    <svg className="h-4 w-4 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <button className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-black backdrop-blur-sm transition-colors hover:bg-white/30">
                💳 Manage Plan
              </button>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-zinc-900">API Keys</h2>
                <button
                  onClick={openModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-zinc-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-sm text-zinc-600">
              The key is used to authenticate your requests to the Research API. To learn more, see the{" "}
              <a href="#" className="font-medium text-zinc-900 underline">
                documentation
              </a>{" "}
              page.
            </p>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* API Keys Table */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Key
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredKeys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <p className="text-sm text-zinc-500">No API keys found. Create your first key to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredKeys.map((key) => {
                      const isEditing = editingId === key.id;
                      const isRevealed = revealedSecrets.has(key.id);
                      const isCopied = copiedId === key.id;
                      
                      return (
                        <tr
                          key={key.id}
                          className="transition-colors hover:bg-zinc-50"
                        >
                          {/* Name Column */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <input
                                value={editDraft.name}
                                onChange={(e) =>
                                  setEditDraft((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-black focus:border-zinc-400 focus:outline-none"
                              />
                            ) : (
                              <div className="text-sm font-medium text-black">
                                {key.name}
                              </div>
                            )}
                          </td>

                          {/* Type Column */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <select
                                value={editDraft.environment}
                                onChange={(e) =>
                                  setEditDraft((prev) => ({
                                    ...prev,
                                    environment: e.target.value as any,
                                  }))
                                }
                                className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-black focus:border-zinc-400 focus:outline-none"
                              >
                                {environmentOptions.map((env) => (
                                  <option key={env} value={env}>
                                    {env}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="text-sm text-black">
                                {key.environment}
                              </div>
                            )}
                          </td>

                          {/* Usage Column */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-black">0</div>
                          </td>

                          {/* Key Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-sm text-black">
                                {formatSecret(key.secret, isRevealed)}
                              </code>
                            </div>
                          </td>

                          {/* Options Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={saveEdit}
                                    className="rounded-lg p-2 text-black transition hover:bg-zinc-100"
                                    title="Save"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="rounded-lg p-2 text-black transition hover:bg-zinc-100"
                                    title="Cancel"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => toggleRevealSecret(key.id)}
                                    className="rounded-lg p-2 text-black transition hover:bg-zinc-100"
                                    title={isRevealed ? "Hide" : "Reveal"}
                                  >
                                    {isRevealed ? (
                                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                      </svg>
                                    ) : (
                                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => copySecret(key.secret, key.id)}
                                    className="rounded-lg p-2 text-black transition hover:bg-zinc-100"
                                    title="Copy"
                                  >
                                    {isCopied ? (
                                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => startEdit(key)}
                                    className="rounded-lg p-2 text-black transition hover:bg-zinc-100"
                                    title="Edit"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteKey(key.id)}
                                    className="rounded-lg p-2 text-black transition hover:bg-zinc-100"
                                    title="Delete"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remote MCP Section */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-zinc-900 mb-3">Remote MCP</h2>
            <p className="text-sm text-zinc-600 mb-4">
              Connect directly to Groot's remote MCP server for a seamless experience without local installation or configuration. 
              Select your desired API key and click the button below to generate the MCP connection URL. For examples on how to use the remote MCP, click{" "}
              <a href="#" className="font-medium text-blue-600 underline hover:text-blue-700">
                here
              </a>
              .
            </p>
            <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
              Generate MCP Connection URL
            </button>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-black mb-2">Create a new API key</h2>
            <p className="text-zinc-600 mb-8">Enter a name and limit for the new API key.</p>

            {/* Key Name */}
            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-black">
                Key Name — <span className="font-normal text-zinc-500">A unique name to identify this key</span>
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Key Name"
                className="w-full rounded-xl border-2 border-blue-500 bg-white px-4 py-3 text-base text-black placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Key Type */}
            <div className="mb-6">
              <label className="mb-3 block text-base font-semibold text-black">
                Key Type — <span className="font-normal text-zinc-500">Choose the environment for this key</span>
              </label>
              <div className="space-y-3">
                <button
                  onClick={() => setNewEnvironment("development")}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    newEnvironment === "development"
                      ? "border-blue-500 bg-blue-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      newEnvironment === "development" ? "border-blue-500" : "border-zinc-300"
                    }`}>
                      {newEnvironment === "development" && (
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <div>
                      <div className="text-lg font-semibold text-black">Development</div>
                      <div className="text-sm text-zinc-500">Rate limited to 100 requests/minute</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setNewEnvironment("production")}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    newEnvironment === "production"
                      ? "border-blue-500 bg-blue-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      newEnvironment === "production" ? "border-blue-500" : "border-zinc-300"
                    }`}>
                      {newEnvironment === "production" && (
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <svg className="h-6 w-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <div className="text-lg font-semibold text-black">Production</div>
                      <div className="text-sm text-zinc-500">Rate limited to 1,000 requests/minute</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setNewEnvironment("staging")}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    newEnvironment === "staging"
                      ? "border-blue-500 bg-blue-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      newEnvironment === "staging" ? "border-blue-500" : "border-zinc-300"
                    }`}>
                      {newEnvironment === "staging" && (
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <svg className="h-6 w-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <div>
                      <div className="text-lg font-semibold text-black">Staging</div>
                      <div className="text-sm text-zinc-500">Rate limited to 500 requests/minute</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Scopes */}
            <div className="mb-8">
              <label className="mb-3 block text-base font-semibold text-black">
                Permissions — <span className="font-normal text-zinc-500">Select access levels</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {scopeOptions.map((scope) => (
                  <button
                    key={scope}
                    onClick={() => toggleScope(newScopes, scope, setNewScopes)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                      newScopes.includes(scope)
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-zinc-300 bg-white text-black hover:border-zinc-400"
                    }`}
                    type="button"
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={closeModal}
                className="rounded-xl px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={createKey}
                disabled={!newName.trim()}
                className="rounded-xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className={`flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl ${
            toastType === "success" 
              ? "bg-gradient-to-r from-emerald-500 to-teal-600" 
              : toastType === "error"
              ? "bg-gradient-to-r from-red-500 to-rose-600"
              : "bg-gradient-to-r from-blue-500 to-indigo-600"
          }`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              {toastType === "success" ? (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : toastType === "error" ? (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-lg font-semibold text-white">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
