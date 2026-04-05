// Shared data and types for the ETF Portfolio app

export interface ETF {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  aum: string;
  expenseRatio: number;
  shares: number;
  category: string;
  color: string;
}

export interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

export const PORTFOLIO_ETFS: ETF[] = [
  {
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    price: 241.78,
    change: 2.34,
    changePct: 0.98,
    aum: "$376.4B",
    expenseRatio: 0.03,
    shares: 42,
    category: "US Equity",
    color: "#3b82f6",
  },
  {
    ticker: "VXUS",
    name: "Vanguard Total Intl Stock ETF",
    price: 59.22,
    change: -0.41,
    changePct: -0.69,
    aum: "$68.7B",
    expenseRatio: 0.07,
    shares: 120,
    category: "Intl Equity",
    color: "#8b5cf6",
  },
  {
    ticker: "BND",
    name: "Vanguard Total Bond Market ETF",
    price: 72.15,
    change: 0.18,
    changePct: 0.25,
    aum: "$108.2B",
    expenseRatio: 0.03,
    shares: 80,
    category: "Bonds",
    color: "#06b6d4",
  },
  {
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    price: 468.92,
    change: 5.71,
    changePct: 1.23,
    aum: "$255.3B",
    expenseRatio: 0.20,
    shares: 15,
    category: "Tech",
    color: "#10b981",
  },
  {
    ticker: "VNQ",
    name: "Vanguard Real Estate ETF",
    price: 84.67,
    change: -1.02,
    changePct: -1.19,
    aum: "$35.1B",
    expenseRatio: 0.12,
    shares: 35,
    category: "Real Estate",
    color: "#f59e0b",
  },
  {
    ticker: "GLD",
    name: "SPDR Gold Shares",
    price: 227.44,
    change: 1.87,
    changePct: 0.83,
    aum: "$72.8B",
    expenseRatio: 0.40,
    shares: 18,
    category: "Commodities",
    color: "#ef4444",
  },
];

export const SEARCH_ETF_DATABASE: ETF[] = [
  ...PORTFOLIO_ETFS,
  {
    ticker: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 523.45,
    change: 4.12,
    changePct: 0.79,
    aum: "$528.1B",
    expenseRatio: 0.09,
    shares: 0,
    category: "US Equity",
    color: "#3b82f6",
  },
  {
    ticker: "IWM",
    name: "iShares Russell 2000 ETF",
    price: 199.34,
    change: -2.44,
    changePct: -1.21,
    aum: "$56.4B",
    expenseRatio: 0.19,
    shares: 0,
    category: "US Equity",
    color: "#3b82f6",
  },
  {
    ticker: "AGG",
    name: "iShares Core U.S. Aggregate Bond ETF",
    price: 95.18,
    change: 0.22,
    changePct: 0.23,
    aum: "$109.7B",
    expenseRatio: 0.03,
    shares: 0,
    category: "Bonds",
    color: "#06b6d4",
  },
  {
    ticker: "XLE",
    name: "Energy Select Sector SPDR Fund",
    price: 84.25,
    change: 1.33,
    changePct: 1.60,
    aum: "$36.8B",
    expenseRatio: 0.09,
    shares: 0,
    category: "Energy",
    color: "#f59e0b",
  },
  {
    ticker: "ARKK",
    name: "ARK Innovation ETF",
    price: 47.88,
    change: -1.12,
    changePct: -2.29,
    aum: "$6.9B",
    expenseRatio: 0.75,
    shares: 0,
    category: "Innovation",
    color: "#8b5cf6",
  },
];

// Generate realistic performance chart data
export function generatePerformanceData(days: number) {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let portfolio = 100000;
  let benchmark = 100000;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const portReturn = (Math.random() - 0.46) * 0.025;
    const benchReturn = (Math.random() - 0.47) * 0.022;

    portfolio *= 1 + portReturn;
    benchmark *= 1 + benchReturn;

    if (i % Math.floor(days / 60) === 0 || i === days - 1) {
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        portfolio: Math.round(portfolio),
        benchmark: Math.round(benchmark),
        fullDate: date.toISOString(),
      });
    }
  }
  return data;
}

export function generateVolumeData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month) => ({
    month,
    inflow: Math.floor(Math.random() * 8000 + 2000),
    outflow: Math.floor(Math.random() * 3000 + 500),
  }));
}

export function computeAllocation(etfs: ETF[]): AllocationItem[] {
  const total = etfs.reduce((sum, e) => sum + e.price * e.shares, 0);
  return etfs.map((e) => ({
    name: e.ticker,
    value: Math.round(((e.price * e.shares) / total) * 100 * 10) / 10,
    color: e.color,
  }));
}
