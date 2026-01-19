"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/dashboards/Toast";
import { ToastType } from "@/types/api-key";

export default function ProtectedPage() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  useEffect(() => {
    const validateApiKey = async () => {
      // Get API key from sessionStorage (set in playground page)
      const apiKey = sessionStorage.getItem("apiKey");

      if (!apiKey) {
        // If no API key, redirect to playground
        router.push("/playground");
        return;
      }

      try {
        const response = await fetch("/api/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey }),
        });

        const result = await response.json();

        if (result.valid) {
          setIsValid(true);
          setToastMessage("Valid API Key /protected can be accessed");
          setToastType("success");
        } else {
          setIsValid(false);
          setToastMessage("Invalid API Key");
          setToastType("error");
        }
      } catch (error) {
        console.error("Error validating API key:", error);
        setIsValid(false);
        setToastMessage("Invalid API Key");
        setToastType("error");
      } finally {
        setIsValidating(false);
        setShowToast(true);
        // Clear the API key from sessionStorage after validation
        sessionStorage.removeItem("apiKey");
      }
    };

    validateApiKey();
  }, [router]);

  const hideToast = () => {
    setShowToast(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Sidebar activePage="api-playground" />
      
      <div className="ml-72 overflow-auto">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">
              Protected Page
            </h1>
            <p className="text-lg text-zinc-600">
              API key validation in progress...
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            {isValidating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-500 mb-4"></div>
                <p className="text-sm text-zinc-600">Validating API key...</p>
              </div>
            ) : isValid ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 border border-emerald-200">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900">Access Granted</h3>
                    <p className="text-sm text-emerald-700">Your API key is valid and you can access this protected page.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => router.push("/playground")}
                    className="rounded-xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blue-600"
                  >
                    Try Another API Key
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Access Denied</h3>
                    <p className="text-sm text-red-700">The API key you provided is invalid or has been revoked.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => router.push("/playground")}
                    className="rounded-xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blue-600"
                  >
                    Go Back to Playground
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
