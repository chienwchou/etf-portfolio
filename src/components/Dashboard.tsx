"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  RefreshCw,
  Bell,
  Download,
  Plus,
} from "lucide-react";
import {
  PORTFOLIO_ETFS,
  generatePerformanceData,
  generateVolumeData,
  computeAllocation,
} from "@/lib/data";
import { PerformanceChart, VolumeChart, AllocationChart } from "./Charts";

const PERIODS = ["1W", "1M", "3M", "6M", "1Y", "All"];

function formatMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function periodToDays(p: string) {
  return ({ "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365, All: 730 } as Record<string, number>)[p] ?? 365;
}

export default function Dashboard() {
  const [period, setPeriod] = useState("1Y");

  const perfData   = useMemo(() => generatePerformanceData(periodToDays(period)), [period]);
  const volumeData = useMemo(() => generateVolumeData(), []);
  const allocation = useMemo(() => computeAllocation(PORTFOLIO_ETFS), []);

  const totalValue    = PORTFOLIO_ETFS.reduce((s, e) => s + e.price * e.shares, 0);
  const totalGain     = PORTFOLIO_ETFS.reduce((s, e) => s + e.change * e.shares, 0);
  const totalGainPct  = (totalGain / (totalValue - totalGain)) * 100;

  const stats = [
    {
      label: "Total Value",
      value: formatMoney(totalValue),
      change: `+${formatMoney(totalGain)} today`,
      positive: true,
      icon: <DollarSign size={14} />,
      accent: "accent-blue",
    },
    {
      label: "Day's P&L",
      value: totalGain >= 0 ? `+${formatMoney(totalGain)}` : formatMoney(totalGain),
      change: `${totalGainPct >= 0 ? "+" : ""}${totalGainPct.toFixed(2)}% vs open`,
      positive: totalGain >= 0,
      icon: <TrendingUp size={14} />,
      accent: "accent-green",
    },
    {
      label: "Total Holdings",
      value: `${PORTFOLIO_ETFS.length} ETFs`,
      change: "Across 6 categories",
      positive: true,
      icon: <BarChart3 size={14} />,
      accent: "accent-purple",
    },
    {
      label: "Avg Expense Ratio",
      value: `${(PORTFOLIO_ETFS.reduce((s, e) => s + e.expenseRatio, 0) / PORTFOLIO_ETFS.length).toFixed(2)}%`,
      change: "vs 0.44% industry avg",
      positive: true,
      icon: <RefreshCw size={14} />,
      accent: "accent-amber",
    },
  ];

  return (
    <div className="p-7 flex-1 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">
            Portfolio Overview
          </h1>
          <p className="text-sm text-text-secondary flex items-center gap-2">
            Thursday, April 3, 2026 · Market Open
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse-glow" />
              <span className="text-xs text-accent-green">Live</span>
            </span>
          </p>
        </div>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] text-[13px] font-semibold cursor-pointer transition-all duration-200 bg-bg-secondary text-text-secondary border border-border-base hover:bg-bg-card-hover hover:text-text-primary">
            <Download size={14} /> Export
          </button>
          <button className="inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] text-[13px] font-semibold text-white cursor-pointer transition-all duration-200 bg-gradient-to-br from-accent-blue to-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]">
            <Plus size={14} /> Add ETF
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`
              stat-top-accent ${s.accent}
              relative overflow-hidden bg-bg-card border border-border-base rounded-2xl p-5
              transition-all duration-200 animate-count-up
              hover:-translate-y-0.5 hover:border-border-light hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]
            `}
          >
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-2">
              {s.icon} {s.label}
            </div>
            <div className="text-[28px] font-extrabold text-text-primary tracking-tight mb-2 tabular-nums">
              {s.value}
            </div>
            <div className={`text-[13px] font-semibold flex items-center gap-1 ${s.positive ? "text-accent-green" : "text-accent-red"}`}>
              {s.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-[2fr_1fr] gap-4 mb-6">
        {/* Performance */}
        <div className="bg-bg-card border border-border-base rounded-2xl p-6 transition-colors duration-200 hover:border-border-light">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-lg font-bold text-text-primary tracking-tight">Portfolio Performance</div>
              <div className="text-[13px] text-text-secondary mt-0.5">vs S&amp;P 500 benchmark</div>
            </div>
            {/* Period toggle */}
            <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`
                    px-3 py-[5px] text-xs font-semibold border-none rounded-md cursor-pointer transition-all duration-150
                    ${period === p ? "bg-accent-blue text-white" : "bg-transparent text-text-muted hover:text-text-secondary"}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <PerformanceChart data={perfData} />
          <div className="flex gap-5 mt-3 pt-3 border-t border-border-base">
            <div className="inline-flex items-center gap-1 bg-bg-secondary border border-border-base rounded-md px-2.5 py-1 text-xs text-text-secondary">
              <span className="inline-block w-2 h-2 rounded-sm bg-accent-blue" /> Portfolio
            </div>
            <div className="inline-flex items-center gap-1 bg-bg-secondary border border-border-base rounded-md px-2.5 py-1 text-xs text-text-secondary">
              <span className="inline-block w-2 h-2 rounded-sm bg-accent-purple opacity-70" /> S&amp;P 500
            </div>
          </div>
        </div>

        {/* Allocation */}
        <div className="bg-bg-card border border-border-base rounded-2xl p-6 transition-colors duration-200 hover:border-border-light">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-lg font-bold text-text-primary tracking-tight">Allocation</div>
              <div className="text-[13px] text-text-secondary mt-0.5">By ETF weight</div>
            </div>
          </div>
          <AllocationChart data={allocation} />
          <div className="flex flex-col gap-2.5 mt-2">
            {allocation.map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <div className="text-[13px] text-text-secondary flex-1">{a.name}</div>
                <div className="text-[13px] font-bold text-text-primary">{a.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings table */}
      <div className="bg-bg-card border border-border-base rounded-2xl transition-colors duration-200 hover:border-border-light mb-6">
        <div className="px-6 pt-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-lg font-bold text-text-primary tracking-tight">Holdings</div>
              <div className="text-[13px] text-text-secondary mt-0.5">{PORTFOLIO_ETFS.length} positions</div>
            </div>
            <button className="inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] text-xs font-semibold cursor-pointer transition-all duration-200 bg-bg-secondary text-text-secondary border border-border-base hover:bg-bg-card-hover hover:text-text-primary">
              View All
            </button>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ETF", "Category", "Price", "Day Change", "Shares", "Value", "Expense Ratio", "Weight"].map((h, i) => (
                <th
                  key={h}
                  className={`
                    text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted
                    px-4 py-3 border-b border-border-base
                    ${i > 1 ? "text-right" : "text-left"}
                  `}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PORTFOLIO_ETFS.map((etf) => {
              const value  = etf.price * etf.shares;
              const weight = ((value / totalValue) * 100).toFixed(1);
              return (
                <tr key={etf.ticker} className="holdings-row group">
                  <td className="px-4 py-[14px] text-sm text-text-secondary border-b border-border-base/50 transition-colors duration-150">
                    <div className="inline-flex items-center gap-1.5 font-bold text-text-primary text-sm">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: etf.color }} />
                      <div>
                        <div className="font-bold text-text-primary text-sm">{etf.ticker}</div>
                        <div className="text-[11px] text-text-muted max-w-[200px] truncate">{etf.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-[14px] text-sm text-text-secondary border-b border-border-base/50 transition-colors duration-150">
                    <span className="inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold bg-blue-500/10 text-accent-blue">
                      {etf.category}
                    </span>
                  </td>
                  <td className="px-4 py-[14px] text-sm text-right font-semibold text-text-primary border-b border-border-base/50 transition-colors duration-150">
                    ${etf.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-[14px] text-right border-b border-border-base/50 transition-colors duration-150">
                    <span
                      className={`
                        inline-flex items-center gap-[3px] px-2 py-[3px] rounded-md text-xs font-semibold
                        ${etf.changePct >= 0
                          ? "bg-emerald-500/10 text-accent-green"
                          : "bg-red-500/10 text-accent-red"}
                      `}
                    >
                      {etf.changePct >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {etf.changePct >= 0 ? "+" : ""}{etf.changePct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-[14px] text-sm text-right text-text-secondary border-b border-border-base/50 transition-colors duration-150">
                    {etf.shares}
                  </td>
                  <td className="px-4 py-[14px] text-sm text-right font-semibold text-text-primary border-b border-border-base/50 transition-colors duration-150">
                    ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-4 py-[14px] text-sm text-right text-text-secondary border-b border-border-base/50 transition-colors duration-150">
                    {etf.expenseRatio.toFixed(2)}%
                  </td>
                  <td className="px-4 py-[14px] border-b border-border-base/50 transition-colors duration-150">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1 w-[60px] bg-border-base rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-[width] duration-700"
                          style={{ width: `${weight}%`, background: etf.color }}
                        />
                      </div>
                      <span className="text-xs text-text-primary min-w-[36px] text-right">{weight}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cash Flow */}
      <div className="bg-bg-card border border-border-base rounded-2xl p-6 transition-colors duration-200 hover:border-border-light">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-lg font-bold text-text-primary tracking-tight">Cash Flow</div>
            <div className="text-[13px] text-text-secondary mt-0.5">Monthly inflows vs outflows</div>
          </div>
          <Bell size={16} className="text-text-muted" />
        </div>
        <VolumeChart data={volumeData} />
      </div>
    </div>
  );
}
