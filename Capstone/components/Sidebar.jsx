"use client";

import { useState, useMemo } from "react";
import Icon from "@/components/Icons";

export default function Sidebar({
  isOpen,
  onClose,
  onToggle,
  history,
  onSelectAnalysis,
  onNewAnalysis,
  onClearHistory,
  selectedId,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    return history.filter((item) => {
      const domain = (item.domain || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      const url = (item.url || "").toLowerCase();
      return domain.includes(q) || title.includes(q) || url.includes(q);
    });
  }, [history, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full
          w-72 bg-white dark:bg-[#0f0f0f]
          border-r border-gray-200 dark:border-[#2a2a2a]
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "lg:w-72" : "lg:w-0 lg:border-r-0 lg:overflow-hidden"}
          flex flex-col
        `}
        aria-label="Analysis history sidebar"
      >
        {isOpen && (
          <div className="flex flex-col h-full w-72">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#2a2a2a]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">MetaSpark AI</h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">Website Metadata Analyzer</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors hidden lg:block"
                  aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                  title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <Icon name="menu" className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors lg:block"
                  aria-label="Close sidebar"
                  title="Close sidebar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-200 dark:border-[#2a2a2a]">
              <label htmlFor="history-search" className="sr-only">
                Search analysis history
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="history-search"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search analyses..."
                  className="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a] text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* New Analysis Button */}
            <div className="p-3 border-b border-gray-200 dark:border-[#2a2a2a]">
              <button
                onClick={() => {
                  onNewAnalysis();
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 text-white text-sm font-medium hover:from-primary-600 hover:to-primary-800 active:scale-95 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Analysis
              </button>
            </div>

            {/* Recent Analyses */}
            <div className="flex-1 overflow-y-auto p-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-1">
                Recent
              </h3>
              {filteredHistory.length === 0 ? (
                <div className="px-1 py-3 text-xs text-gray-400 dark:text-gray-500 text-center">
                  {searchQuery ? "No analyses found" : "No recent analyses"}
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredHistory.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onSelectAnalysis(item);
                          onClose();
                        }}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                          ${selectedId === item.id
                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                          }
                        `}
                        aria-current={selectedId === item.id ? "true" : undefined}
                      >
                        <div className="truncate font-medium">{item.title}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                          {item.domain}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-[#2a2a2a]">
              {history.length > 0 && (
                <button
                  onClick={() => {
                    onClearHistory();
                  }}
                  className="w-full text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mb-2"
                >
                  Clear History
                </button>
              )}
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                Developed by Muhammad Awais Altaf
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}