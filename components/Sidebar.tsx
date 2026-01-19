"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  activePage?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ activePage, isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isPersonalDropdownOpen, setIsPersonalDropdownOpen] = useState(false);

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: "/dashboards",
    },
    {
      id: "api-playground",
      label: "API Playground",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      href: "/playground",
    },
    {
      id: "use-cases",
      label: "Use Cases",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      href: "/use-cases",
    },
    {
      id: "billing",
      label: "Billing",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      href: "/billing",
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: "/settings",
    },
    {
      id: "certification",
      label: "Certification",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      href: "/certification",
    },
    {
      id: "documentation",
      label: "Documentation",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: "https://docs.example.com",
      external: true,
    },
    {
      id: "tavily-mcp",
      label: "Tavily MCP",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      href: "https://mcp.example.com",
      external: true,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo Section */}
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            {/* Tavily Logo - Using a colorful gradient placeholder */}
            <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
              <path d="M20 5L30 15L20 25L10 15L20 5Z" fill="#3B82F6" />
              <path d="M20 15L30 25L20 35L10 25L20 15Z" fill="#F59E0B" />
              <path d="M10 15L20 25L15 30L5 20L10 15Z" fill="#EF4444" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900">Ranjen AI</span>
        </div>

        {/* Personal Dropdown */}
        <div className="mb-6">
          <button
            onClick={() => setIsPersonalDropdownOpen(!isPersonalDropdownOpen)}
            className="flex w-full items-center justify-between rounded-lg bg-blue-50 px-4 py-2.5 transition-colors hover:bg-blue-100"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm font-semibold text-white">
                R
              </div>
              <span className="text-sm font-medium text-gray-900">Personal</span>
            </div>
            <svg
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isPersonalDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = activePage === item.id || pathname === item.href;
          const baseClasses = "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
          const activeClasses = isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

          if (item.external) {
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClasses} ${activeClasses}`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${baseClasses} ${activeClasses}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile at Bottom */}
      <div className="border-t border-gray-200 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-sm font-semibold text-white">
            R
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate text-sm font-medium text-gray-900">Ranjen Naidu Vasudiven</p>
          </div>
          <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
      </aside>

      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className={`fixed top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-50 ${
            isOpen ? "left-[272px]" : "left-4"
          }`}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
