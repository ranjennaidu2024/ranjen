"use client";

import { useMemo, useState } from "react";

type ApiKey = {
  id: string;
  name: string;
  secret: string;
  status: "active" | "revoked";
  scopes: string[];
  createdAt: string;
  lastUsed: string;
};

const scopeOptions = ["read", "write", "admin"] as const;

const seedKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production public API",
    secret: "pk_live_43fj-9dhw-q22n-0x9p",
    status: "active",
    scopes: ["read", "write"],
    createdAt: "2024-09-12",
    lastUsed: "2024-11-28",
  },
  {
    id: "key-2",
    name: "Staging integration",
    secret: "pk_test_8ddm-112a-y2l2-88de",
    status: "active",
    scopes: ["read"],
    createdAt: "2024-06-02",
    lastUsed: "2024-11-04",
  },
  {
    id: "key-3",
    name: "Legacy automation",
    secret: "pk_live_xx33-0qwe-9921-55aa",
    status: "revoked",
    scopes: ["read"],
    createdAt: "2023-12-14",
    lastUsed: "2024-03-01",
  },
];

const formatSecret = (secret: string) => {
  if (secret.length <= 6) return secret;
  return `${secret.slice(0, 6)}••••${secret.slice(-4)}`;
};

const generateSecret = () => {
  const rand = () => Math.random().toString(36).slice(2, 8);
  return `pk_${rand()}-${rand()}-${rand()}-${rand()}`;
};

export default function ApiKeyDashboard() {
  const [keys, setKeys] = useState<ApiKey[]>(seedKeys);
  const [newName, setNewName] = useState("");
  const [newScopes, setNewScopes] = useState<string[]>(["read"]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingKey = useMemo(
    () => keys.find((k) => k.id === editingId),
    [editingId, keys]
  );
  const [editDraft, setEditDraft] = useState<{ name: string; scopes: string[] }>(
    { name: "", scopes: [] }
  );

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

  const createKey = () => {
    if (!newName.trim()) return;
    const next: ApiKey = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      secret: generateSecret(),
      status: "active",
      scopes: newScopes.length ? newScopes : ["read"],
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsed: "—",
    };
    setKeys((prev) => [next, ...prev]);
    setNewName("");
    setNewScopes(["read"]);
  };

  const startEdit = (key: ApiKey) => {
    setEditingId(key.id);
    setEditDraft({ name: key.name, scopes: [...key.scopes] });
  };

  const saveEdit = () => {
    if (!editingId || !editDraft.name.trim()) return;
    setKeys((prev) =>
      prev.map((k) =>
        k.id === editingId
          ? { ...k, name: editDraft.name.trim(), scopes: editDraft.scopes }
          : k
      )
    );
    setEditingId(null);
  };

  const rotateKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              secret: generateSecret(),
              lastUsed: new Date().toISOString().slice(0, 10),
            }
          : k
      )
    );
  };

  const toggleStatus = (id: string) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? { ...k, status: k.status === "active" ? "revoked" : "active" }
          : k
      )
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16 text-black dark:bg-black dark:text-zinc-50 sm:px-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              API Key Dashboard
            </h1>
            <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
              Create, rotate, and revoke keys. Edit names and scopes to keep your
              credentials organized and compliant.
            </p>
          </div>
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200">
            CRUD-ready UI for managing API keys
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create new key</h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Generates a secret immediately
              </span>
            </div>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Key name
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mobile app key"
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:border-black/40 focus:outline-none dark:border-white/15 dark:bg-zinc-950"
                />
              </label>
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Scopes
                </p>
                <div className="flex flex-wrap gap-2">
                  {scopeOptions.map((scope) => (
                    <button
                      key={scope}
                      onClick={() => toggleScope(newScopes, scope, setNewScopes)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        newScopes.includes(scope)
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-black/15 bg-white text-black hover:border-black/40 dark:border-white/20 dark:bg-zinc-950 dark:text-white"
                      }`}
                      type="button"
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={createKey}
                className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2f2f2f] disabled:cursor-not-allowed disabled:bg-black/40 dark:bg-white dark:text-black dark:hover:bg-[#e7e7e7] dark:disabled:bg-white/30"
                disabled={!newName.trim()}
              >
                Create key
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">Activity & hygiene</h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
              <li>• Rotate production keys on a regular cadence.</li>
              <li>• Revoke unused credentials and reissue when owners change.</li>
              <li>• Keep scopes minimal; grant write/admin only as needed.</li>
              <li>• Track last used to spot stale or compromised keys.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">Your API keys</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Rotate or revoke from the actions menu.
            </p>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
            <div className="grid grid-cols-1 bg-zinc-50 text-xs font-semibold uppercase text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400 sm:grid-cols-[1.2fr_1fr_0.8fr_0.7fr_1fr_1fr]">
              <div className="px-4 py-3">Name</div>
              <div className="px-4 py-3">Secret</div>
              <div className="px-4 py-3">Status</div>
              <div className="px-4 py-3">Scopes</div>
              <div className="px-4 py-3">Created</div>
              <div className="px-4 py-3">Actions</div>
            </div>
            <div className="divide-y divide-black/5 dark:divide-white/10">
              {keys.map((key) => {
                const isEditing = editingId === key.id;
                return (
                  <div
                    key={key.id}
                    className="grid grid-cols-1 items-center bg-white text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 sm:grid-cols-[1.2fr_1fr_0.8fr_0.7fr_1fr_1fr]"
                  >
                    <div className="px-4 py-3">
                      {isEditing ? (
                        <input
                          value={editDraft.name}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-black/15 bg-white px-2 py-1 text-sm dark:border-white/20 dark:bg-zinc-950"
                        />
                      ) : (
                        <div className="font-medium">{key.name}</div>
                      )}
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Last used {key.lastUsed || "—"}
                      </div>
                    </div>
                    <div className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      {formatSecret(key.secret)}
                    </div>
                    <div className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          key.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            key.status === "active"
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {key.status}
                      </span>
                    </div>
                    <div className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2">
                          {scopeOptions.map((scope) => (
                            <button
                              key={scope}
                              onClick={() =>
                                toggleScope(
                                  editDraft.scopes,
                                  scope,
                                  (s) =>
                                    setEditDraft((prev) => ({
                                      ...prev,
                                      scopes: s,
                                    }))
                                )
                              }
                              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                editDraft.scopes.includes(scope)
                                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                  : "border-black/15 bg-white text-black hover:border-black/40 dark:border-white/20 dark:bg-zinc-950 dark:text-white"
                              }`}
                              type="button"
                            >
                              {scope}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                          {key.scopes.map((scope) => (
                            <span
                              key={scope}
                              className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                      <div>Created {key.createdAt}</div>
                    </div>
                    <div className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={saveEdit}
                            className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-[#2f2f2f] dark:bg-white dark:text-black dark:hover:bg-[#e7e7e7]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-black/15 px-3 py-2 text-xs font-semibold text-black hover:border-black/40 hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => rotateKey(key.id)}
                            className="rounded-lg border border-black/15 px-3 py-2 text-xs font-semibold text-black hover:border-black/40 hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                          >
                            Rotate
                          </button>
                          <button
                            onClick={() => toggleStatus(key.id)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              key.status === "active"
                                ? "border border-rose-200 text-rose-600 hover:border-rose-400 hover:bg-rose-50 dark:border-rose-400/50 dark:text-rose-200 dark:hover:bg-rose-900/30"
                                : "border border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-400/50 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
                            }`}
                          >
                            {key.status === "active" ? "Revoke" : "Restore"}
                          </button>
                          <button
                            onClick={() => startEdit(key)}
                            className="rounded-lg border border-black/15 px-3 py-2 text-xs font-semibold text-black hover:border-black/40 hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
