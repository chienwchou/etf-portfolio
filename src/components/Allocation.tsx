"use client";

import { useMemo } from "react";
import { PORTFOLIO_ETFS, computeAllocation } from "@/lib/data";
import { AllocationChart } from "./Charts";

const CATEGORY_COLORS: Record<string, string> = {
  "US Equity":   "#3b82f6",
  "Intl Equity": "#8b5cf6",
  Bonds:         "#06b6d4",
  Tech:          "#10b981",
  "Real Estate": "#f59e0b",
  Commodities:   "#ef4444",
};

const TARGETS: Record<string, number> = {
  "US Equity":   50,
  "Intl Equity": 20,
  Bonds:         15,
  Tech:          10,
  "Real Estate": 3,
  Commodities:   2,
};

export default function Allocation() {
  const allocation = useMemo(() => computeAllocation(PORTFOLIO_ETFS), []);

  const byCategory = useMemo(() => {
    const total = PORTFOLIO_ETFS.reduce((s, e) => s + e.price * e.shares, 0);
    const map: Record<string, number> = {};
    PORTFOLIO_ETFS.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + ((e.price * e.shares) / total) * 100;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value: Math.round(value * 10) / 10,
      color: CATEGORY_COLORS[name] ?? "#888",
    }));
  }, []);

  return (
    <div className="p-7 flex-1 animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">
          Asset Allocation
        </h1>
        <p className="text-sm text-text-secondary">Portfolio diversification overview</p>
      </div>

      {/* Two donut charts */}
      <div className="grid grid-cols-[2fr_1fr] gap-4 mb-4">
        {/* By ETF */}
        <div className="bg-bg-card border border-border-base rounded-2xl p-6 transition-colors hover:border-border-light">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-lg font-bold text-text-primary tracking-tight">By ETF</div>
              <div className="text-[13px] text-text-secondary mt-0.5">Individual position weights</div>
            </div>
          </div>
          <AllocationChart data={allocation} />
          <div className="flex flex-col gap-2.5 mt-3">
            {allocation.map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <div className="text-[13px] text-text-secondary flex-1">{a.name}</div>
                <div className="flex-1 max-w-[120px] h-1 bg-border-base rounded-sm overflow-hidden">
                  <div className="h-full rounded-sm" style={{ width: `${a.value}%`, background: a.color }} />
                </div>
                <div className="text-[13px] font-bold text-text-primary">{a.value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* By Category */}
        <div className="bg-bg-card border border-border-base rounded-2xl p-6 transition-colors hover:border-border-light">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-lg font-bold text-text-primary tracking-tight">By Category</div>
              <div className="text-[13px] text-text-secondary mt-0.5">Asset class weights</div>
            </div>
          </div>
          <AllocationChart data={byCategory} />
          <div className="flex flex-col gap-2.5 mt-3">
            {[...byCategory].sort((a, b) => b.value - a.value).map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <div className="text-[13px] text-text-secondary flex-1">{a.name}</div>
                <div className="flex-1 max-w-[120px] h-1 bg-border-base rounded-sm overflow-hidden">
                  <div className="h-full rounded-sm" style={{ width: `${a.value}%`, background: a.color }} />
                </div>
                <div className="text-[13px] font-bold text-text-primary">{a.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target vs Actual */}
      <div className="bg-bg-card border border-border-base rounded-2xl p-6 transition-colors hover:border-border-light">
        <div className="flex items-center justify-between mb-5">
          <div className="text-lg font-bold text-text-primary tracking-tight">Target vs Actual Weights</div>
        </div>
        <div className="flex flex-col gap-3.5">
          {Object.entries(TARGETS).map(([name, target]) => {
            const actual = byCategory.find((b) => b.name === name)?.value ?? 0;
            const diff   = actual - target;
            const color  = CATEGORY_COLORS[name] ?? "#888";
            return (
              <div key={name} className="flex items-center gap-4">
                <div className="min-w-[110px] text-[13px] text-text-secondary">{name}</div>
                <div className="flex-1 flex flex-col gap-1">
                  {/* Target row */}
                  <div className="flex gap-1">
                    <div className="h-1.5 rounded-sm" style={{ flex: target, background: `${color}33` }} />
                    <div className="h-1.5 rounded-sm bg-border-base" style={{ flex: 100 - target }} />
                  </div>
                  {/* Actual row */}
                  <div className="flex gap-1">
                    <div className="h-1.5 rounded-sm" style={{ flex: actual, background: color }} />
                    <div className="h-1.5 rounded-sm bg-border-base" style={{ flex: 100 - actual }} />
                  </div>
                </div>
                <div className="min-w-[60px] text-right text-xs font-semibold">
                  <span className={diff > 0 ? "text-accent-green" : diff < 0 ? "text-accent-red" : "text-text-muted"}>
                    {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-text-muted">
          <span>■ Target weight</span>
          <span className="opacity-50">■ Actual weight</span>
        </div>
      </div>
    </div>
  );
}
