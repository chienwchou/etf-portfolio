"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  BarChart2,
  PieChart,
  TrendingUp,
  Star,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Activity,
  BookOpen,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard",   id: "dashboard" },
  { icon: <BarChart2 size={18} />,       label: "Holdings",    id: "holdings" },
  { icon: <PieChart size={18} />,        label: "Allocation",  id: "allocation" },
  { icon: <TrendingUp size={18} />,      label: "Performance", id: "performance" },
  { icon: <Activity size={18} />,        label: "Risk Analysis", id: "risk", badge: "New" },
  { icon: <Star size={18} />,            label: "Watchlist",   id: "watchlist" },
  { icon: <BookOpen size={18} />,        label: "Research",    id: "research" },
];

const bottomNavItems: NavItem[] = [
  { icon: <Bell size={18} />,     label: "Alerts",   id: "alerts",   badge: "3" },
  { icon: <Settings size={18} />, label: "Settings", id: "settings" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative z-10 flex flex-col flex-shrink-0 overflow-hidden
        bg-bg-sidebar border-r border-border-base
        transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[260px]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border-base flex-shrink-0">
        <div
          className="
            w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0
            text-white text-lg font-bold
            bg-gradient-to-br from-accent-blue to-accent-purple
            shadow-[0_4px_12px_rgba(59,130,246,0.3)]
          "
        >
          α
        </div>
        {!collapsed && (
          <div>
            <div className="text-[15px] font-bold text-text-primary whitespace-nowrap tracking-tight">
              AlphaTrack
            </div>
            <div className="text-[11px] text-text-muted whitespace-nowrap">ETF Portfolio</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {!collapsed && (
          <div className="px-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted whitespace-nowrap overflow-hidden">
            Overview
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                relative flex items-center gap-3 w-full text-left
                px-5 py-[10px] overflow-hidden whitespace-nowrap
                text-sm font-medium border-none cursor-pointer
                transition-all duration-200
                nav-item-active
                ${isActive
                  ? "bg-blue-500/10 text-accent-blue nav-item-active"
                  : "bg-transparent text-text-secondary hover:bg-blue-500/5 hover:text-text-primary"
                }
              `}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-accent-blue text-white text-[10px] font-semibold px-[7px] py-[2px] rounded-full flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {!collapsed && (
          <div className="px-5 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted whitespace-nowrap overflow-hidden">
            Account
          </div>
        )}

        {bottomNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                relative flex items-center gap-3 w-full text-left
                px-5 py-[10px] overflow-hidden whitespace-nowrap
                text-sm font-medium border-none cursor-pointer
                transition-all duration-200
                ${isActive
                  ? "bg-blue-500/10 text-accent-blue nav-item-active"
                  : "bg-transparent text-text-secondary hover:bg-blue-500/5 hover:text-text-primary"
                }
              `}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-accent-blue text-white text-[10px] font-semibold px-[7px] py-[2px] rounded-full flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="
          absolute top-5 -right-3 z-20
          w-6 h-6 rounded-full
          bg-bg-card border border-border-base
          flex items-center justify-center
          text-text-secondary cursor-pointer
          transition-all duration-200 hover:text-text-primary
        "
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Footer */}
      <div className="flex items-center gap-3 p-4 border-t border-border-base flex-shrink-0">
        <div
          className="
            w-9 h-9 rounded-full flex-shrink-0
            bg-gradient-to-br from-accent-blue to-accent-purple
            flex items-center justify-center
            text-white text-sm font-bold
          "
        >
          JD
        </div>
        {!collapsed && (
          <div>
            <div className="text-[13px] font-semibold text-text-primary">Jane Doe</div>
            <div className="text-[11px] text-text-muted">Pro Investor</div>
          </div>
        )}
      </div>
    </aside>
  );
}
