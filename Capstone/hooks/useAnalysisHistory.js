"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "flyrank_analysis_history";
const MAX_HISTORY = 50;

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.url === "string" &&
        Array.isArray(item.messages),
    );
  } catch {
    return [];
  }
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? safeParse(raw) : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((items) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("[useAnalysisHistory] persist error:", e);
    }
  }, []);

  const addAnalysis = useCallback(
    ({ title, url, domain, messages }) => {
      const trimmed = (title || "").trim();
      const safeUrl = (url || "").trim();
      if (!trimmed || !safeUrl) return;

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.url !== safeUrl);
        const newItem = {
          id: crypto.randomUUID(),
          title: trimmed,
          url: safeUrl,
          domain: (domain || "").trim() || new URL(safeUrl).hostname,
          createdAt: new Date().toISOString(),
          messages: Array.isArray(messages) ? messages : [],
        };
        const next = [newItem, ...filtered].slice(0, MAX_HISTORY);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const removeAnalysis = useCallback(
    (id) => {
      setHistory((prev) => {
        const next = prev.filter((item) => item.id !== id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error("[useAnalysisHistory] clear error:", e);
      }
    }
  }, []);

  const loadAnalysis = useCallback((id) => {
    return history.find((item) => item.id === id) || null;
  }, [history]);

  return {
    history,
    addAnalysis,
    removeAnalysis,
    clearHistory,
    loadAnalysis,
  };
}
