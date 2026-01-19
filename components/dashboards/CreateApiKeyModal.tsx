"use client";

import { useState } from "react";
import { ApiKeyEnvironment } from "@/types/api-key";
import { scopeOptions, environmentOptions } from "@/constants/api-keys";

type CreateApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    scopes: string[];
    environment: ApiKeyEnvironment;
  }) => Promise<void>;
};

export default function CreateApiKeyModal({
  isOpen,
  onClose,
  onCreate,
}: CreateApiKeyModalProps) {
  const [newName, setNewName] = useState("");
  const [newScopes, setNewScopes] = useState<string[]>(["read"]);
  const [newEnvironment, setNewEnvironment] = useState<ApiKeyEnvironment>("development");
  const [isCreating, setIsCreating] = useState(false);

  const toggleScope = (scope: string) => {
    setNewScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    
    setIsCreating(true);
    try {
      await onCreate({
        name: newName.trim(),
        scopes: newScopes.length ? newScopes : ["read"],
        environment: newEnvironment,
      });
      setNewName("");
      setNewScopes(["read"]);
      setNewEnvironment("development");
      onClose();
    } catch (error) {
      // Error handling is done in parent component via toast
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setNewName("");
    setNewScopes(["read"]);
    setNewEnvironment("development");
    onClose();
  };

  if (!isOpen) return null;

  return (
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
                onClick={() => toggleScope(scope)}
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
            onClick={handleClose}
            className="rounded-xl px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-zinc-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!newName.trim() || isCreating}
            className="rounded-xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
