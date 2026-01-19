"use client";

import { useState, useMemo } from "react";
import { ApiKey } from "@/types/api-key";
import { formatSecret } from "@/utils/api-key";
import { environmentOptions } from "@/constants/api-keys";

type ApiKeysTableProps = {
  keys: ApiKey[];
  loading: boolean;
  error: string | null;
  editingId: string | null;
  editDraft: { 
    name: string; 
    scopes: string[];
    environment: "production" | "staging" | "development";
  };
  revealedSecrets: Set<string>;
  copiedId: string | null;
  onEditDraftChange: (draft: { 
    name: string; 
    scopes: string[];
    environment: "production" | "staging" | "development";
  }) => void;
  onStartEdit: (key: ApiKey) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onToggleRevealSecret: (id: string) => void;
  onCopySecret: (secret: string, id: string) => void;
  onDeleteKey: (id: string) => void;
};

export default function ApiKeysTable({
  keys,
  loading,
  error,
  editingId,
  editDraft,
  revealedSecrets,
  copiedId,
  onEditDraftChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onToggleRevealSecret,
  onCopySecret,
  onDeleteKey,
}: ApiKeysTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-zinc-900">API Keys</h2>
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
            ) : keys.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm text-zinc-500">No API keys found. Create your first key to get started.</p>
                </td>
              </tr>
            ) : (
              keys.map((key) => {
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
                            onEditDraftChange({
                              ...editDraft,
                              name: e.target.value,
                            })
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
                            onEditDraftChange({
                              ...editDraft,
                              environment: e.target.value as any,
                            })
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
                              onClick={onSaveEdit}
                              className="rounded-lg p-2 text-black transition hover:bg-zinc-100"
                              title="Save"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={onCancelEdit}
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
                              onClick={() => onToggleRevealSecret(key.id)}
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
                              onClick={() => onCopySecret(key.secret, key.id)}
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
                              onClick={() => onStartEdit(key)}
                              className="rounded-lg p-2 text-black transition hover:bg-zinc-100"
                              title="Edit"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => onDeleteKey(key.id)}
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
  );
}
