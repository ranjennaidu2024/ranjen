"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/dashboards/Header";
import CurrentPlanCard from "@/components/dashboards/CurrentPlanCard";
import ApiKeysTable from "@/components/dashboards/ApiKeysTable";
import CreateApiKeyModal from "@/components/dashboards/CreateApiKeyModal";
import Toast from "@/components/dashboards/Toast";
import RemoteMCP from "@/components/dashboards/RemoteMCP";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useToast } from "@/hooks/useToast";
import { generateSecret } from "@/utils/api-key";
import { ApiKey } from "@/types/api-key";

export default function GrootApiKeyDashboard() {
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "revoked">("all");
  const [filterEnvironment, setFilterEnvironment] = useState<"all" | "production" | "staging" | "development">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ 
    name: string; 
    scopes: string[];
    environment: "production" | "staging" | "development";
  }>({ name: "", scopes: [], environment: "development" });

  const { keys, loading, error, createKey, updateKey, deleteKey, rotateKey, toggleKeyStatus } = useApiKeys(
    filterStatus,
    filterEnvironment
  );
  const { showToast, toastMessage, toastType, showToastNotification, hideToast } = useToast();

  const filteredKeys = useMemo(() => {
    return keys.filter((key) => {
      const statusMatch = filterStatus === "all" || key.status === filterStatus;
      const envMatch = filterEnvironment === "all" || key.environment === filterEnvironment;
      return statusMatch && envMatch;
    });
  }, [keys, filterStatus, filterEnvironment]);

  const handleCreateKey = async (data: {
    name: string;
    scopes: string[];
    environment: "production" | "staging" | "development";
  }) => {
    try {
      await createKey({
        ...data,
        secret: generateSecret(data.environment),
      });
      showToastNotification("API key created successfully!", "success");
    } catch (err) {
      showToastNotification("Failed to create API key. Please try again.", "error");
    }
  };

  const handleStartEdit = (key: ApiKey) => {
    setEditingId(key.id);
    setEditDraft({ name: key.name, scopes: [...key.scopes], environment: key.environment });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editDraft.name.trim()) return;
    
    try {
      await updateKey(editingId, {
        name: editDraft.name.trim(),
        scopes: editDraft.scopes,
        environment: editDraft.environment,
      });
      setEditingId(null);
      showToastNotification("API key updated successfully!", "success");
    } catch (err) {
      showToastNotification("Failed to update API key. Please try again.", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this API key? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteKey(id);
      showToastNotification("API key deleted successfully!", "success");
    } catch (err) {
      showToastNotification("Failed to delete API key. Please try again.", "error");
    }
  };

  const handleToggleRevealSecret = (id: string) => {
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

  const handleCopySecret = async (secret: string, id: string) => {
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
          <Header />

          <CurrentPlanCard />

          {/* API Keys Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-zinc-900">API Keys</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-zinc-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <ApiKeysTable
              keys={filteredKeys}
              loading={loading}
              error={error}
              editingId={editingId}
              editDraft={editDraft}
              revealedSecrets={revealedSecrets}
              copiedId={copiedId}
              onEditDraftChange={setEditDraft}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onToggleRevealSecret={handleToggleRevealSecret}
              onCopySecret={handleCopySecret}
              onDeleteKey={handleDeleteKey}
            />
          </div>

          <RemoteMCP />
        </div>
      </div>

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateKey}
      />

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
