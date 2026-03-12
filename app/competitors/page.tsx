"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Legend,
} from "recharts";
import { Trophy, Search } from "lucide-react";
import { getMarketData, CITY_PROFILES } from "@/lib/mockData";
import { formatCurrency } from "@/lib/calculations";

type MarketData = ReturnType<typeof getMarketData>;

const CITY_LIST = Object.keys(CITY_PROFILES);

export default function CompetitorsPage() {
  const [city, setCity] = useState("Gatlinburg, TN");
  const [bedrooms, setBedrooms] = useState(3);
  const [data, setData] = useState<MarketData | null>(null);

  function analyze() {
    setData(getMarketData(city, bedrooms));
  }

  useEffect(() => { analyze(); }, []);

  const scatterData = data?.competitorListings.map((l) => ({
    x: l.nightlyRate,
    y: l.occupancy,
    name: l.name,
  })) ?? [];

  return (
    <div className="p-8" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Competitor Analysis</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Benchmark your property against comparable STR listings</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex items-end gap-4" style={{ border: "1px solid #E2E8F0" }}>
        <div className="flex-1">
          <label className="field-label">City</label>
          <input
            list="comp-city-list"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
            placeholder="e.g. Gatlinburg, TN"
          />
          <datalist id="comp-city-list">
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
          Load Competitors
        </button>
      </div>

      {!data ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Trophy className="w-16 h-16 mb-4" style={{ color: "#E2E8F0" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "#0F172A" }}>Select a Market</h3>
          <p className="text-sm max-w-sm" style={{ color: "#64748B" }}>
            Choose a city and bedroom count to analyze competitor listings, amenity impact, and pricing benchmarks.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Amenity Impact */}
          <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
            <h3 className="text-base font-semibold mb-1" style={{ color: "#0F172A" }}>Amenities That Drive Revenue</h3>
            <p className="text-xs mb-4" style={{ color: "#64748B" }}>Revenue lift % for properties that include each amenity</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={[...data.amenityImpact].sort((a, b) => b.revenueLift - a.revenueLift)}
                layout="vertical"
                margin={{ top: 0, right: 80, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `+${v}%`} />
                <YAxis type="category" dataKey="amenity" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = data.amenityImpact.find(a => a.revenueLift === payload[0]?.value);
                      return (
                        <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                          <p className="font-semibold" style={{ color: "#0F172A" }}>+{payload[0]?.value}% revenue lift</p>
                          {item && <p style={{ color: "#64748B" }}>Found in {item.penetration}% of listings</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenueLift" name="Revenue Lift %" fill="#22C55E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Two charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Bedroom Count vs Revenue</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.bedroomBreakdown} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="bedrooms" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}BR`} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                            <p className="font-semibold" style={{ color: "#0F172A" }}>{label} Bedrooms</p>
                            <p style={{ color: "#2563EB" }}>Avg Revenue: {formatCurrency(Number(payload[0]?.value))}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgRevenue" name="Avg Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Price vs Occupancy</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="x" name="Nightly Rate" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} label={{ value: "Nightly Rate", position: "insideBottom", offset: -2, fontSize: 11, fill: "#64748B" }} />
                  <YAxis dataKey="y" name="Occupancy" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} domain={[40, 100]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                            <p style={{ color: "#2563EB" }}>Rate: ${payload[0]?.value}/night</p>
                            <p style={{ color: "#22C55E" }}>Occupancy: {payload[1]?.value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Scatter name="Listings" data={scatterData} fill="#2563EB" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competitor Listings Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <h3 className="text-base font-semibold" style={{ color: "#0F172A" }}>Competitor Listings</h3>
              <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Top 15 comparable properties in {data.city}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    {["Name", "Beds", "Baths", "Nightly Rate", "Annual Revenue", "Occupancy", "Rating", "Status", "Amenities"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.competitorListings.slice(0, 15).map((l) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="px-4 py-3.5 text-sm font-medium" style={{ color: "#0F172A" }}>{l.name}</td>
                      <td className="px-4 py-3.5 text-sm" style={{ color: "#64748B" }}>{l.bedrooms}</td>
                      <td className="px-4 py-3.5 text-sm" style={{ color: "#64748B" }}>{l.bathrooms}</td>
                      <td className="px-4 py-3.5 text-sm font-medium" style={{ color: "#0F172A" }}>{formatCurrency(l.nightlyRate)}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: "#22C55E" }}>{formatCurrency(l.annualRevenue)}</td>
                      <td className="px-4 py-3.5 text-sm" style={{ color: "#64748B" }}>{l.occupancy}%</td>
                      <td className="px-4 py-3.5 text-sm">
                        <span style={{ color: "#F59E0B" }}>{"★".repeat(Math.floor(l.reviewScore))}</span>
                        <span className="ml-1 text-xs" style={{ color: "#64748B" }}>{l.reviewScore}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {l.superhost ? (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#FEF9C3", color: "#A16207" }}>Superhost</span>
                        ) : (
                          <span className="text-xs" style={{ color: "#94A3B8" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {l.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#F1F5F9", color: "#64748B" }}>{a}</span>
                          ))}
                          {l.amenities.length > 3 && (
                            <span className="text-xs" style={{ color: "#94A3B8" }}>+{l.amenities.length - 3}</span>
                          )}
                        </div>
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
