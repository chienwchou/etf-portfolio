"use client";

import { useState, useMemo } from "react";
import { generatePerformanceData } from "@/lib/data";
import { PerformanceChart } from "./Charts";

const PERIODS = ["1W", "1M", "3M", "6M", "1Y", "All"];

export default function Performance() {
  const [period, setPeriod] = useState("1Y");

  const perfData = useMemo(
    () =>
      generatePerformanceData(
        ({ "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365, All: 730 } as Record<string, number>)[period] ?? 365
      ),
    [period]
  );

  const last  = perfData[perfData.length - 1];
  const first = perfData[0];

  const gainPct  = last && first ? (((last.portfolio - first.portfolio) / first.portfolio) * 100).toFixed(2) : "0";
  const benchPct = last && first ? (((last.benchmark - first.benchmark) / first.benchmark) * 100).toFixed(2) : "0";
  const alpha    = (parseFloat(gainPct) - parseFloat(benchPct)).toFixed(2);

  const metrics = [
    { label: "Portfolio Return",  value: `${parseFloat(gainPct) >= 0  ? "+" : ""}${gainPct}%`,  color: parseFloat(gainPct)  >= 0 ? "text-accent-green" : "text-accent-red" },
    { label: "Benchmark Return",  value: `${parseFloat(benchPct) >= 0 ? "+" : ""}${benchPct}%`, color: "text-accent-purple" },
    { label: "Alpha Generated",   value: `${parseFloat(alpha) >= 0    ? "+" : ""}${alpha}%`,    color: parseFloat(alpha)    >= 0 ? "text-accent-green" : "text-accent-red" },
    { label: "Sharpe Ratio",      value: "1.42",   color: "text-accent-blue" },
    { label: "Max Drawdown",      value: "-8.4%",  color: "text-accent-red" },
    { label: "Volatility (σ)",    value: "12.6%",  color: "text-accent-amber" },
  ];

  return (
    <div className="p-7 flex-1 animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">
          Performance Analytics
        </h1>
        <p className="text-sm text-text-secondary">Historical returns vs benchmark</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="
              stat-top-accent accent-blue
              relative overflow-hidden bg-bg-card border border-border-base rounded-2xl p-5
              transition-all duration-200
              hover:-translate-y-0.5 hover:border-border-light hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]
            "
          >
            <div className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-2">
              {m.label}
            </div>
            <div className={`text-[22px] font-extrabold tracking-tight ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-bg-card border border-border-base rounded-2xl p-6 transition-colors hover:border-border-light">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-lg font-bold text-text-primary tracking-tight">Portfolio vs Benchmark</div>
            <div className="text-[13px] text-text-secondary mt-0.5">Starting value $100,000</div>
          </div>
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
      </div>
    </div>
  );
}
