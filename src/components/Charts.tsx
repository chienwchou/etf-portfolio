"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { useState, useCallback } from "react";

// ----- Performance Chart -----
interface PerformancePoint {
  date: string;
  portfolio: number;
  benchmark: number;
}

interface PerformanceChartProps {
  data: PerformancePoint[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: p.color,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span>{p.dataKey === "portfolio" ? "Portfolio" : "S&P 500"}</span>
          <span>${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,66,0.5)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="benchmark"
          stroke="#8b5cf6"
          strokeWidth={1.5}
          fill="url(#colorBenchmark)"
          strokeDasharray="4 2"
          dot={false}
          name="S&P 500"
        />
        <Area
          type="monotone"
          dataKey="portfolio"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#colorPortfolio)"
          dot={false}
          name="Portfolio"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ----- Volume / Cash Flow Chart -----
interface VolumePoint {
  month: string;
  inflow: number;
  outflow: number;
}

interface VolumeChartProps {
  data: VolumePoint[];
}

const VolumeTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; fill: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: p.fill,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span>{p.name}</span>
          <span>${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function VolumeChart({ data }: VolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={8}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,66,0.5)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--text-muted)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={40}
        />
        <Tooltip content={<VolumeTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "var(--text-muted)", paddingTop: 12 }}
        />
        <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[3, 3, 0, 0]} />
        <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ----- Donut / Pie Chart -----
interface AllocationData {
  name: string;
  value: number;
  color: string;
}

interface AllocationChartProps {
  data: AllocationData[];
}

const renderActiveShape = (props: {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: AllocationData;
  value: number;
}) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--text-primary)" fontSize={16} fontWeight={800}>
        {value}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize={11}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function AllocationChart({ data }: AllocationChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback(
    (_: unknown, index: number) => setActiveIndex(index),
    []
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
