"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    // Store API key in sessionStorage to pass to protected page
    sessionStorage.setItem("apiKey", apiKey.trim());
    router.push("/protected");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Sidebar activePage="api-playground" />
      
      <div className="ml-72 overflow-auto">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">
              API Playground
            </h1>
            <p className="text-lg text-zinc-600">
              Enter your API key to test and validate it
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-semibold text-zinc-900 mb-2">
                  API Key
                </label>
                <input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-base text-black placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <p className="mt-2 text-sm text-zinc-500">
                  Your API key will be validated when you proceed to the protected page.
                </p>
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  type="submit"
                  disabled={!apiKey.trim() || isSubmitting}
                  className="rounded-xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit & Validate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
