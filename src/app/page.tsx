"use client";

import { useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Dashboard from "@/components/Dashboard";
import Holdings from "@/components/Holdings";
import Allocation from "@/components/Allocation";
import Performance from "@/components/Performance";
import Watchlist from "@/components/Watchlist";
import type { ETF } from "@/lib/data";

function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="p-7 flex-1 animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">{title}</h1>
        <p className="text-sm text-text-secondary">{subtitle}</p>
      </div>
      <div className="bg-bg-card border border-border-base rounded-2xl p-16 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border-base flex items-center justify-center">
          <RefreshCw size={24} className="text-text-muted" />
        </div>
        <p className="text-[15px] text-text-muted">This section is coming soon</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab]       = useState("dashboard");
  const [_selectedEtf, setSelectedEtf] = useState<ETF | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":   return <Dashboard />;
      case "holdings":    return <Holdings />;
      case "allocation":  return <Allocation />;
      case "performance": return <Performance />;
      case "watchlist":   return <Watchlist />;
      case "risk":        return <PlaceholderPage title="Risk Analysis" subtitle="Portfolio risk metrics and stress tests" />;
      case "research":    return <PlaceholderPage title="Research" subtitle="ETF research and market insights" />;
      case "alerts":      return <PlaceholderPage title="Alerts" subtitle="Price alerts and portfolio notifications" />;
      case "settings":    return <PlaceholderPage title="Settings" subtitle="Account preferences and configuration" />;
      default:            return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Topbar */}
        <header className="
          sticky top-0 z-[5] flex-shrink-0
          flex items-center gap-4 px-7 py-4
          bg-bg-secondary border-b border-border-base
          backdrop-blur-xl
        ">
          <SearchBar onSelect={setSelectedEtf} />

          <div className="ml-auto flex items-center gap-3">
            {/* NYSE status */}
            <div className="inline-flex items-center gap-1.5 bg-bg-secondary border border-border-base rounded-md px-2.5 py-1 text-xs text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block" />
              NYSE Open
            </div>

            {/* Bell */}
            <button
              aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-[9px] border border-border-base bg-transparent text-text-secondary cursor-pointer transition-all duration-200 hover:border-border-light hover:text-text-primary"
            >
              <Bell size={16} />
              <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full bg-accent-blue border-2 border-bg-secondary" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white text-[13px] font-bold cursor-pointer">
              JD
            </div>
          </div>
        </header>

        {renderContent()}
      </div>
    </div>
  );
}
