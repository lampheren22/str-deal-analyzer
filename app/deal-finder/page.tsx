"use client";

import { useState } from "react";
import { Search, Zap, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getDealFinderListings, CITY_PROFILES, DealFinderListing } from "@/lib/mockData";
import { formatCurrency, formatPct } from "@/lib/calculations";

const CITY_LIST = Object.keys(CITY_PROFILES);

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 90 ? { background: "#DCFCE7", color: "#15803D" }
    : score >= 75 ? { background: "#DBEAFE", color: "#1D4ED8" }
    : score >= 60 ? { background: "#FEF9C3", color: "#A16207" }
    : { background: "#FEE2E2", color: "#B91C1C" };
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={style}>{score}</span>
  );
}

export default function DealFinderPage() {
  const [city, setCity] = useState("Gatlinburg, TN");
  const [minPrice, setMinPrice] = useState(300000);
  const [maxPrice, setMaxPrice] = useState(700000);
  const [minBedrooms, setMinBedrooms] = useState(3);
  const [minROI, setMinROI] = useState(25);
  const [listings, setListings] = useState<DealFinderListing[] | null>(null);

  function findDeals() {
    setListings(getDealFinderListings(city, minPrice, maxPrice, minBedrooms, minROI));
  }

  const goodDeals = listings?.filter((l) => l.isGoodDeal) ?? [];
  const avgROI = goodDeals.length > 0 ? goodDeals.reduce((s, l) => s + l.roi, 0) / goodDeals.length : 0;

  return (
    <div className="p-4 md:p-8" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5" style={{ color: "#F59E0B" }} />
          <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Deal Finder</h1>
        </div>
        <p className="text-sm" style={{ color: "#64748B" }}>Discover top-ranked STR investment properties filtered by your criteria</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6" style={{ border: "1px solid #E2E8F0" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className="field-label">City</label>
            <input
              list="df-city-list"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input"
              placeholder="e.g. Gatlinburg, TN"
            />
            <datalist id="df-city-list">
              {CITY_LIST.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label className="field-label">Min Price</label>
            <div className="input-prefix">
              <span>$</span>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div>
            <label className="field-label">Max Price</label>
            <div className="input-prefix">
              <span>$</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="field-label">Min BR</label>
              <select value={minBedrooms} onChange={(e) => setMinBedrooms(Number(e.target.value))} className="input">
                {[1, 2, 3, 4, 5].map((b) => <option key={b} value={b}>{b}+</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Min ROI %</label>
              <div className="input-suffix">
                <input type="number" value={minROI} onChange={(e) => setMinROI(parseFloat(e.target.value) || 0)} />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={findDeals}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg"
          style={{ background: "#2563EB" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Search className="w-4 h-4" />
          Find Deals
        </button>
      </div>

      {!listings ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <Zap className="w-14 h-14 mb-4" style={{ color: "#E2E8F0" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "#0F172A" }}>Find Your Next Investment</h3>
          <p className="text-sm max-w-sm" style={{ color: "#64748B" }}>
            Set your filters above and click "Find Deals" to discover ranked STR properties scored by ROI and cash flow potential.
          </p>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <p className="text-sm font-medium" style={{ color: "#0F172A" }}>
              {listings.length} properties found in <span style={{ color: "#2563EB" }}>{city}</span>
            </p>
            <span style={{ color: "#E2E8F0" }}>|</span>
            <p className="text-sm" style={{ color: "#64748B" }}>
              <span className="font-semibold" style={{ color: "#22C55E" }}>{goodDeals.length}</span> meet your {minROI}% ROI target
            </p>
            {goodDeals.length > 0 && (
              <>
                <span style={{ color: "#E2E8F0" }}>|</span>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  Avg ROI of qualifying deals: <span className="font-semibold" style={{ color: "#22C55E" }}>{formatPct(avgROI)}</span>
                </p>
              </>
            )}
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto" style={{ border: "1px solid #E2E8F0" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  {["Address", "Price", "Est. Revenue", "MART", "Cash Flow", "ROI", "Score", "Days on Mkt", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr
                    key={l.id}
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      background: l.isGoodDeal ? "rgba(34,197,94,0.04)" : "transparent",
                    }}
                  >
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#0F172A" }}>{l.address}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{l.bedrooms} BR / {l.bathrooms} BA • {l.sqft.toLocaleString()} sqft • {l.propertyType}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: "#0F172A" }}>{formatCurrency(l.price)}</td>
                    <td className="px-4 py-3.5 text-sm font-medium" style={{ color: "#22C55E" }}>{formatCurrency(l.estimatedRevenue)}</td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "#64748B" }}>{formatCurrency(l.mart)}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: l.cashFlow > 0 ? "#22C55E" : "#EF4444" }}>
                      {l.cashFlow > 0 ? "+" : ""}{formatCurrency(l.cashFlow)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold" style={{ color: l.roi >= minROI ? "#22C55E" : "#64748B" }}>
                        {formatPct(l.roi)}
                      </span>
                      {l.roi >= minROI && <span className="ml-1 text-xs" style={{ color: "#22C55E" }}>✓</span>}
                    </td>
                    <td className="px-4 py-3.5"><ScoreBadge score={l.score} /></td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "#64748B" }}>{l.daysOnMarket}d</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {l.isGoodDeal ? (
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#22C55E" }} />
                        ) : (
                          <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#E2E8F0" }} />
                        )}
                        <Link
                          href="/analyze"
                          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded"
                          style={{ color: "#2563EB", background: "#EFF6FF" }}
                        >
                          Analyze <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Deals Found", value: String(listings.length) },
              { label: "Good Deals", value: String(goodDeals.length) },
              { label: "Avg ROI (qualifying)", value: goodDeals.length > 0 ? formatPct(avgROI) : "—" },
              { label: "Best Score", value: listings.length > 0 ? String(listings[0].score) : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: "1px solid #E2E8F0" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#64748B" }}>{label}</p>
                <p className="text-xl font-bold" style={{ color: "#0F172A" }}>{value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
