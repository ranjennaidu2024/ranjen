import { ToastType } from "@/types/api-key";

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className={`flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl ${
        type === "success" 
          ? "bg-gradient-to-r from-emerald-500 to-teal-600" 
          : type === "error"
          ? "bg-gradient-to-r from-red-500 to-rose-600"
          : "bg-gradient-to-r from-blue-500 to-indigo-600"
      }`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          {type === "success" ? (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : type === "error" ? (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <span className="text-lg font-semibold text-white">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
