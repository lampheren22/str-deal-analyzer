"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Search, AlertTriangle, CheckCircle, ShieldAlert, SlidersHorizontal } from "lucide-react";
import { getMarketData, CITY_PROFILES } from "@/lib/mockData";
import { formatCurrency } from "@/lib/calculations";

type MarketData = ReturnType<typeof getMarketData>;

const CITY_LIST = Object.keys(CITY_PROFILES);

function getRiskLevel(marketOcc: number, breakEven: number): { level: "LOW" | "MEDIUM" | "HIGH"; cushion: number } {
  const cushion = marketOcc - breakEven;
  if (cushion >= 15) return { level: "LOW", cushion };
  if (cushion >= 5) return { level: "MEDIUM", cushion };
  return { level: "HIGH", cushion };
}

export default function SeasonalityPage() {
  const [city, setCity] = useState("Gatlinburg, TN");
  const [bedrooms, setBedrooms] = useState(3);
  const [propertyPrice, setPropertyPrice] = useState(500000);
  const [data, setData] = useState<MarketData | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  function analyze() {
    setData(getMarketData(city, bedrooms));
  }

  useEffect(() => { analyze(); }, []);

  const mart = propertyPrice / 7.5;
  const avgNightlyRate = data?.avgNightlyRate ?? 250;
  const breakEvenOcc = avgNightlyRate > 0 ? (mart / (avgNightlyRate * 365)) * 100 : 0;
  const marketOcc = data?.avgOccupancy ?? 0;
  const { level: riskLevel, cushion } = data ? getRiskLevel(marketOcc, breakEvenOcc) : { level: "HIGH" as const, cushion: 0 };

  // Forecast data: best/base/worst case per month
  const forecastData = data?.monthlyRevenue.map((m) => ({
    month: m.month,
    bestCase: Math.round(m.revenue * 1.25),
    baseCase: m.revenue,
    worstCase: Math.round(m.revenue * 0.72),
    occupancy: m.occupancy,
  })) ?? [];

  // Quarterly summaries
  const quarters = data ? [
    { q: "Q1", months: data.monthlyRevenue.slice(0, 3) },
    { q: "Q2", months: data.monthlyRevenue.slice(3, 6) },
    { q: "Q3", months: data.monthlyRevenue.slice(6, 9) },
    { q: "Q4", months: data.monthlyRevenue.slice(9, 12) },
  ].map(({ q, months }) => {
    const avgRev = Math.round(months.reduce((s, m) => s + m.revenue, 0) / 3);
    const avgOcc = Math.round(months.reduce((s, m) => s + m.occupancy, 0) / 3);
    const trend = months[2].revenue > months[0].revenue ? "up" : "down";
    return { q, avgRev, avgOcc, trend };
  }) : [];

  const riskStyle =
    riskLevel === "LOW"
      ? { bg: "#DCFCE7", text: "#15803D", Icon: CheckCircle }
      : riskLevel === "MEDIUM"
      ? { bg: "#FEF9C3", text: "#A16207", Icon: AlertTriangle }
      : { bg: "#FEE2E2", text: "#B91C1C", Icon: ShieldAlert };

  return (
    <div className="p-4 md:p-8" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Seasonality & Risk Analysis</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Understand revenue volatility, break-even thresholds, and seasonal demand patterns</p>
      </div>

      {/* Mobile: compact filter summary */}
      <div className="flex md:hidden items-center justify-between mb-3">
        <p className="text-sm" style={{ color: "#64748B" }}>
          <span className="font-medium" style={{ color: "#0F172A" }}>{city}</span> · {bedrooms} BR · ${(propertyPrice / 1000).toFixed(0)}k
        </p>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={showFilters
            ? { background: "#2563EB", color: "#fff" }
            : { background: "#fff", color: "#0F172A", border: "1px solid #E2E8F0" }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {showFilters ? "Hide" : "Change"}
        </button>
      </div>

      {/* Filter */}
      <div className={`${showFilters ? "block" : "hidden md:block"} bg-white rounded-xl shadow-sm p-5 mb-6 flex flex-wrap items-end gap-4`} style={{ border: "1px solid #E2E8F0" }}>
        <div className="flex-1">
          <label className="field-label">City</label>
          <input
            list="seas-city-list"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
            placeholder="e.g. Gatlinburg, TN"
          />
          <datalist id="seas-city-list">
            {CITY_LIST.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="w-36">
          <label className="field-label">Bedrooms</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="input">
            {[1, 2, 3, 4, 5, 6].map((b) => <option key={b} value={b}>{b} BR</option>)}
          </select>
        </div>
        <div className="w-48">
          <label className="field-label">Property Price</label>
          <div className="input-prefix">
            <span>$</span>
            <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <button
          onClick={analyze}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg"
          style={{ background: "#2563EB" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Search className="w-4 h-4" />
          Analyze
        </button>
      </div>

      {!data ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <TrendingUp className="w-16 h-16 mb-4" style={{ color: "#E2E8F0" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "#0F172A" }}>Select a Market to Analyze</h3>
          <p className="text-sm max-w-sm" style={{ color: "#64748B" }}>
            Enter a city, bedroom count, and property price to see seasonal revenue patterns and investment risk metrics.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Risk Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #E2E8F0", borderTop: "3px solid #EF4444" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>Break-Even Occupancy</p>
              <p className="text-3xl font-bold" style={{ color: "#EF4444" }}>{breakEvenOcc.toFixed(1)}%</p>
              <p className="text-xs mt-1" style={{ color: "#64748B" }}>MART ÷ (rate × 365)</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #E2E8F0", borderTop: "3px solid #22C55E" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>Market Avg Occupancy</p>
              <p className="text-3xl font-bold" style={{ color: "#22C55E" }}>{marketOcc}%</p>
              <p className="text-xs mt-1" style={{ color: "#64748B" }}>{data.city} annual average</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #E2E8F0", borderTop: "3px solid #2563EB" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>Occupancy Cushion</p>
              <p className="text-3xl font-bold" style={{ color: cushion >= 0 ? "#22C55E" : "#EF4444" }}>
                {cushion >= 0 ? "+" : ""}{cushion.toFixed(1)}%
              </p>
              <p className="text-xs mt-1" style={{ color: "#64748B" }}>Market avg minus break-even</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #E2E8F0", borderTop: `3px solid ${riskStyle.text}` }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>Investment Risk</p>
              <div className="flex items-center gap-2">
                <riskStyle.Icon className="w-5 h-5" style={{ color: riskStyle.text }} />
                <span className="text-2xl font-bold px-3 py-1 rounded-lg" style={{ background: riskStyle.bg, color: riskStyle.text }}>
                  {riskLevel}
                </span>
              </div>
              <p className="text-xs mt-2" style={{ color: "#64748B" }}>
                {riskLevel === "LOW" ? "Strong cushion above break-even" : riskLevel === "MEDIUM" ? "Moderate cushion — manageable" : "Low cushion — requires strong execution"}
              </p>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
            <h3 className="text-base font-semibold mb-1" style={{ color: "#0F172A" }}>Monthly Revenue Forecast</h3>
            <p className="text-xs mb-4" style={{ color: "#64748B" }}>Best case (+25%), base case, and worst case (-28%) revenue scenarios</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bestGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="worstGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                          <p className="font-semibold mb-1" style={{ color: "#0F172A" }}>{label}</p>
                          {payload.map((p, i) => (
                            <p key={i} style={{ color: p.color ?? "#2563EB" }}>{p.name}: {formatCurrency(Number(p.value))}</p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="bestCase" name="Best Case" stroke="#22C55E" fill="url(#bestGrad)" strokeWidth={1.5} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="baseCase" name="Base Case" stroke="#2563EB" fill="url(#baseGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="worstCase" name="Worst Case" stroke="#EF4444" fill="url(#worstGrad)" strokeWidth={1.5} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Occupancy + Volatility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Monthly Occupancy</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={forecastData} margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                            <p className="font-semibold" style={{ color: "#0F172A" }}>{label}</p>
                            <p style={{ color: "#22C55E" }}>Occupancy: {payload[0]?.value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="occupancy" name="Occupancy %" fill="#22C55E" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Revenue Volatility Range</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={forecastData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                            <p className="font-semibold mb-1" style={{ color: "#0F172A" }}>{label}</p>
                            {payload.map((p, i) => (
                              <p key={i} style={{ color: p.color ?? "#2563EB" }}>{p.name}: {formatCurrency(Number(p.value))}</p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="bestCase" name="Best" fill="#22C55E" radius={[2, 2, 0, 0]} fillOpacity={0.7} />
                  <Bar dataKey="baseCase" name="Base" fill="#2563EB" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="worstCase" name="Worst" fill="#EF4444" radius={[2, 2, 0, 0]} fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quarterly Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quarters.map(({ q, avgRev, avgOcc, trend }) => (
              <div key={q} className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #E2E8F0" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{q}</p>
                  <span style={{ color: trend === "up" ? "#22C55E" : "#EF4444" }}>{trend === "up" ? "↑" : "↓"}</span>
                </div>
                <p className="text-xl font-bold mb-1" style={{ color: "#0F172A" }}>{formatCurrency(avgRev)}</p>
                <p className="text-xs" style={{ color: "#64748B" }}>Avg monthly revenue</p>
                <p className="text-sm font-medium mt-2" style={{ color: "#22C55E" }}>{avgOcc}% occupancy</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
