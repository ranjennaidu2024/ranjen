export default function CurrentPlanCard() {
  return (
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
  );
}
