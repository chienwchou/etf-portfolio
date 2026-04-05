"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, TrendingDown } from "lucide-react";
import { SEARCH_ETF_DATABASE, ETF } from "@/lib/data";

interface SearchBarProps {
  onSelect?: (etf: ETF) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<ETF[]>([]);
  const [open, setOpen]       = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) { setResults([]); setOpen(false); return; }
    const q = val.toLowerCase();
    const filtered = SEARCH_ETF_DATABASE.filter(
      (etf) =>
        etf.ticker.toLowerCase().includes(q) ||
        etf.name.toLowerCase().includes(q) ||
        etf.category.toLowerCase().includes(q)
    ).slice(0, 6);
    setResults(filtered);
    setOpen(filtered.length > 0);
  };

  const handleSelect = (etf: ETF) => {
    setQuery(etf.ticker);
    setOpen(false);
    onSelect?.(etf);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[480px]">
      {/* Icon */}
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => { if (results.length > 0) setOpen(true); }}
        onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
        placeholder="Search ETFs by ticker or name…"
        autoComplete="off"
        aria-label="Search ETFs"
        className="
          search-input
          w-full bg-bg-card border border-border-base rounded-[10px]
          py-[10px] pr-9 pl-10
          text-sm text-text-primary font-[inherit]
          transition-all duration-200
        "
      />

      {/* Clear */}
      {query && (
        <button
          onClick={() => { setQuery(""); setResults([]); setOpen(false); inputRef.current?.focus(); }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center cursor-pointer bg-transparent border-none"
        >
          <X size={14} />
        </button>
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          role="listbox"
          className="
            absolute top-[calc(100%+8px)] left-0 right-0 z-[100]
            bg-bg-card border border-border-light rounded-xl overflow-hidden
            shadow-[0_20px_60px_rgba(0,0,0,0.5)]
            animate-fade-in
          "
        >
          {results.map((etf, i) => (
            <div
              key={etf.ticker}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(etf)}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer
                transition-colors duration-150 hover:bg-bg-card-hover
                ${i < results.length - 1 ? "border-b border-border-base" : ""}
              `}
            >
              <span className="text-[13px] font-bold text-accent-blue min-w-[50px]">
                {etf.ticker}
              </span>
              <span className="text-[13px] text-text-primary flex-1">{etf.name}</span>
              <div className="flex flex-col items-end gap-[2px]">
                <span className="text-[13px] font-semibold text-text-secondary">
                  ${etf.price.toFixed(2)}
                </span>
                <span
                  className={`text-[11px] font-semibold flex items-center gap-[2px]
                    ${etf.changePct >= 0 ? "text-accent-green" : "text-accent-red"}`}
                >
                  {etf.changePct >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(etf.changePct).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
