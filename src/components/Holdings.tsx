"use client";

import { TrendingUp, TrendingDown, Filter, ArrowUpDown } from "lucide-react";
import { PORTFOLIO_ETFS } from "@/lib/data";

export default function Holdings() {
  const totalValue = PORTFOLIO_ETFS.reduce((s, e) => s + e.price * e.shares, 0);

  return (
    <div className="p-7 flex-1 animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">
          Holdings Detail
        </h1>
        <p className="text-sm text-text-secondary">Full position breakdown with metrics</p>
      </div>

      <div className="flex gap-2.5 mb-5">
        <button className="inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] text-[13px] font-semibold cursor-pointer transition-all duration-200 bg-bg-secondary text-text-secondary border border-border-base hover:bg-bg-card-hover hover:text-text-primary">
          <Filter size={14} /> Filter
        </button>
        <button className="inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] text-[13px] font-semibold cursor-pointer transition-all duration-200 bg-bg-secondary text-text-secondary border border-border-base hover:bg-bg-card-hover hover:text-text-primary">
          <ArrowUpDown size={14} /> Sort
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {PORTFOLIO_ETFS.map((etf) => {
          const value  = etf.price * etf.shares;
          const weight = ((value / totalValue) * 100).toFixed(1);
          return (
            <div
              key={etf.ticker}
              className="bg-bg-card border border-border-base rounded-2xl p-5 transition-colors duration-200 hover:border-border-light"
            >
              <div className="flex items-center gap-4 flex-wrap">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 border"
                  style={{ background: `${etf.color}22`, borderColor: `${etf.color}44`, color: etf.color }}
                >
                  {etf.ticker.slice(0, 3)}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <div className="font-bold text-text-primary text-[15px]">{etf.ticker}</div>
                  <div className="text-xs text-text-muted">{etf.name}</div>
                </div>

                {/* Value */}
                <div className="text-right">
                  <div className="font-bold text-base text-text-primary">
                    ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-text-muted">{weight}% of portfolio</div>
                </div>

                {/* Price + change */}
                <div className="text-right">
                  <div className="font-semibold text-sm text-text-secondary">${etf.price.toFixed(2)}</div>
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

                {/* Expense ratio */}
                <div className="text-right">
                  <div className="text-xs text-text-muted">Expense</div>
                  <div className="font-semibold text-sm text-accent-amber">{etf.expenseRatio.toFixed(2)}%</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1 bg-border-base rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-[width] duration-700"
                  style={{
                    width: `${weight}%`,
                    background: `linear-gradient(90deg, ${etf.color}, ${etf.color}88)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
