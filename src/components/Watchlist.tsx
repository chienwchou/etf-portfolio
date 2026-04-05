"use client";

import { Star, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { SEARCH_ETF_DATABASE } from "@/lib/data";

const WATCHLIST = SEARCH_ETF_DATABASE.filter((e) => e.shares === 0);

export default function Watchlist() {
  return (
    <div className="p-7 flex-1 animate-fade-in">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">Watchlist</h1>
          <p className="text-sm text-text-secondary">ETFs you are tracking</p>
        </div>
        <button className="inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] text-[13px] font-semibold text-white cursor-pointer transition-all duration-200 bg-gradient-to-br from-accent-blue to-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]">
          <Plus size={14} /> Add to Watchlist
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {WATCHLIST.map((etf) => (
          <div
            key={etf.ticker}
            className="bg-bg-card border border-border-base rounded-2xl p-5 flex items-center gap-4 transition-colors hover:border-border-light"
          >
            <Star size={18} className="text-accent-amber flex-shrink-0" />

            {/* Icon */}
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center font-extrabold text-xs flex-shrink-0 border"
              style={{ background: `${etf.color}22`, borderColor: `${etf.color}44`, color: etf.color }}
            >
              {etf.ticker.slice(0, 3)}
            </div>

            {/* Name */}
            <div className="flex-1">
              <div className="font-bold text-text-primary text-[15px]">{etf.ticker}</div>
              <div className="text-xs text-text-muted">{etf.name}</div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="font-bold text-base text-text-primary">${etf.price.toFixed(2)}</div>
              <span
                className={`
                  inline-flex items-center gap-[3px] px-2 py-[3px] rounded-md text-xs font-semibold mt-0.5
                  ${etf.changePct >= 0 ? "bg-emerald-500/10 text-accent-green" : "bg-red-500/10 text-accent-red"}
                `}
              >
                {etf.changePct >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {etf.changePct >= 0 ? "+" : ""}{etf.changePct.toFixed(2)}%
              </span>
            </div>

            {/* AUM */}
            <div className="text-right">
              <div className="text-xs text-text-muted">AUM</div>
              <div className="font-semibold text-sm text-text-secondary">{etf.aum}</div>
            </div>

            {/* Category badge */}
            <span className="inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold bg-blue-500/10 text-accent-blue">
              {etf.category}
            </span>

            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-xs font-semibold cursor-pointer transition-all duration-200 bg-bg-secondary text-text-secondary border border-border-base hover:bg-bg-card-hover hover:text-text-primary">
              <Plus size={12} /> Add to Portfolio
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
