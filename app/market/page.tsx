"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { BarChart3, TrendingUp, DollarSign, Users, Activity, Search } from "lucide-react";
import { getMarketData, CITY_PROFILES } from "@/lib/mockData";
import { formatCurrency } from "@/lib/calculations";

type MarketData = ReturnType<typeof getMarketData>;

const CITY_LIST = Object.keys(CITY_PROFILES);

function CustomTooltipRevenue({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string; color?: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
        <p className="font-semibold mb-1" style={{ color: "#0F172A" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color ?? "#2563EB" }}>
            {p.name}: {p.name === "Occupancy" ? `${p.value}%` : formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function CustomTooltipBasic({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string; color?: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
        <p className="font-semibold mb-1" style={{ color: "#0F172A" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color ?? "#2563EB" }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function MetricCard({ label, value, sub, accentColor, icon }: {
  label: string; value: string; sub?: string; accentColor: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #E2E8F0", borderTop: `3px solid ${accentColor}` }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color: "#0F172A" }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{sub}</p>}
    </div>
  );
}

export default function MarketPage() {
  const [city, setCity] = useState("Gatlinburg, TN");
  const [bedrooms, setBedrooms] = useState(3);
  const [data, setData] = useState<MarketData | null>(null);

  function analyze() {
    setData(getMarketData(city, bedrooms));
  }

  useEffect(() => { analyze(); }, []);

  return (
    <div className="p-8" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Market Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Deep-dive STR market intelligence for any U.S. city</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex items-end gap-4" style={{ border: "1px solid #E2E8F0" }}>
        <div className="flex-1">
          <label className="field-label">City</label>
          <input
            list="city-list"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
            placeholder="e.g. Gatlinburg, TN"
          />
          <datalist id="city-list">
            {CITY_LIST.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="w-36">
          <label className="field-label">Bedrooms</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="input">
            {[1, 2, 3, 4, 5, 6].map((b) => <option key={b} value={b}>{b} BR</option>)}
          </select>
        </div>
        <button
          onClick={analyze}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg"
          style={{ background: "#2563EB" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Search className="w-4 h-4" />
          Analyze Market
        </button>
      </div>

      {!data ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <BarChart3 className="w-16 h-16 mb-4" style={{ color: "#E2E8F0" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "#0F172A" }}>Select a Market to Analyze</h3>
          <p className="text-sm max-w-sm" style={{ color: "#64748B" }}>
            Choose a city and bedroom count above to load real-time market intelligence including revenue data, competitor analysis, and seasonality trends.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-6 gap-4">
            <MetricCard label="Avg Nightly Rate" value={formatCurrency(data.avgNightlyRate)} sub="per night" accentColor="#2563EB" icon={<DollarSign className="w-4 h-4" style={{ color: "#2563EB" }} />} />
            <MetricCard label="Median Revenue" value={formatCurrency(data.medianRevenue)} sub="annual" accentColor="#22C55E" icon={<TrendingUp className="w-4 h-4" style={{ color: "#22C55E" }} />} />
            <MetricCard label="Top 25% Revenue" value={formatCurrency(data.top25Revenue)} sub="annual" accentColor="#8B5CF6" icon={<Activity className="w-4 h-4" style={{ color: "#8B5CF6" }} />} />
            <MetricCard label="Avg Occupancy" value={`${data.avgOccupancy}%`} sub="annual avg" accentColor="#F59E0B" icon={<Users className="w-4 h-4" style={{ color: "#F59E0B" }} />} />
            <MetricCard label="Active Listings" value={data.listingCount.toLocaleString()} sub={data.profile.marketTier + " market"} accentColor="#06B6D4" icon={<BarChart3 className="w-4 h-4" style={{ color: "#06B6D4" }} />} />
            <MetricCard label="YoY Growth" value={`+${data.profile.yoyGrowth}%`} sub="year-over-year" accentColor="#22C55E" icon={<TrendingUp className="w-4 h-4" style={{ color: "#22C55E" }} />} />
          </div>

          {/* Row 2: Monthly Revenue + Distribution */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Monthly Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.monthlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                  <YAxis yAxisId="rate" orientation="right" hide={true} />
                  <Tooltip content={<CustomTooltipRevenue />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" fill="url(#revGrad)" strokeWidth={2} />
                  <Area yAxisId="right" type="monotone" dataKey="occupancy" name="Occupancy" stroke="#22C55E" fill="none" strokeWidth={2} strokeDasharray="4 2" />
                  <Area yAxisId="rate" type="monotone" dataKey="avgRate" name="Avg Rate" stroke="#F59E0B" fill="none" strokeWidth={1.5} strokeDasharray="3 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Revenue Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.revenueDistribution} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                            <p className="font-semibold" style={{ color: "#0F172A" }}>{label}</p>
                            <p style={{ color: "#2563EB" }}>{payload[0]?.value} listings ({data.revenueDistribution.find(r => r.range === label)?.pct ?? 0}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" name="Listings" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 3: Revenue by BR + Occupancy Trend */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Revenue by Bedroom Count</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.bedroomBreakdown} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="brGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#93C5FD" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="bedrooms" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}BR`} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltipBasic />} />
                  <Bar dataKey="avgRevenue" name="Avg Revenue" fill="url(#brGrad)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Monthly Occupancy Rate</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.monthlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
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
                  <Area type="monotone" dataKey="occupancy" name="Occupancy" stroke="#22C55E" fill="url(#occGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competitor Listings Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold" style={{ color: "#0F172A" }}>Top Performing Listings</h3>
              <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Comparable properties in the {data.city} market</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    {["Property Name", "Beds", "Nightly Rate", "Annual Revenue", "Occupancy", "Rating", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.competitorListings.slice(0, 12).map((listing) => (
                    <tr key={listing.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "#0F172A" }}>{listing.name}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>{listing.bedrooms} BR / {listing.bathrooms} BA</td>
                      <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "#0F172A" }}>{formatCurrency(listing.nightlyRate)}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: "#22C55E" }}>{formatCurrency(listing.annualRevenue)}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>{listing.occupancy}%</td>
                      <td className="px-5 py-3.5 text-sm">
                        <span style={{ color: "#F59E0B" }}>{"★".repeat(Math.floor(listing.reviewScore))}</span>
                        <span className="ml-1 text-xs" style={{ color: "#64748B" }}>{listing.reviewScore}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {listing.superhost && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#FEF9C3", color: "#A16207" }}>
                            Superhost
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
