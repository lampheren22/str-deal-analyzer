"use client";

import { useState } from "react";
import { Sparkles, Search, CheckCircle2, XCircle } from "lucide-react";
import { DealFinderInputs } from "@/lib/types";
import { analyzePrice, formatCurrency, formatPct, getScoreBadgeColor } from "@/lib/calculations";

const DEFAULT: DealFinderInputs = {
  city: "",
  minPrice: 300000,
  maxPrice: 600000,
  bedrooms: "Any",
  estAnnualRevenue: 80000,
  taxRate: 32,
};

const STEPS = 5;

export default function DealFinderPage() {
  const [inputs, setInputs] = useState<DealFinderInputs>(DEFAULT);
  const [results, setResults] = useState<ReturnType<typeof analyzePrice>[] | null>(null);

  function set<K extends keyof DealFinderInputs>(key: K, value: DealFinderInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setResults(null);
  }

  function analyze() {
    const step = (inputs.maxPrice - inputs.minPrice) / STEPS;
    const prices: number[] = [];
    for (let i = 0; i <= STEPS; i++) {
      prices.push(Math.round(inputs.minPrice + step * i));
    }
    setResults(prices.map((p) => analyzePrice(p, inputs.estAnnualRevenue, inputs.taxRate)));
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" style={{ color: "#F59E0B" }} />
          <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Deal Finder</h1>
        </div>
        <p className="text-sm" style={{ color: "#64748B" }}>Estimate if a deal meets MART based on your revenue assumptions</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6" style={{ border: "1px solid #E2E8F0" }}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="field-label">City</label>
            <input
              type="text"
              placeholder="e.g. Gatlinburg, TN"
              value={inputs.city}
              onChange={(e) => set("city", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="field-label">Min Price</label>
            <div className="input-prefix">
              <span>$</span>
              <input
                type="number"
                value={inputs.minPrice}
                onChange={(e) => set("minPrice", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div>
            <label className="field-label">Max Price</label>
            <div className="input-prefix">
              <span>$</span>
              <input
                type="number"
                value={inputs.maxPrice}
                onChange={(e) => set("maxPrice", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <label className="field-label">Bedrooms</label>
            <select
              value={inputs.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
              className="input"
            >
              <option value="Any">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>
          <div>
            <label className="field-label">Est. Annual Revenue</label>
            <div className="input-prefix">
              <span>$</span>
              <input
                type="number"
                value={inputs.estAnnualRevenue}
                onChange={(e) => set("estAnnualRevenue", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div>
            <label className="field-label">Tax Rate %</label>
            <div className="input-suffix">
              <input
                type="number"
                value={inputs.taxRate}
                onChange={(e) => set("taxRate", parseFloat(e.target.value) || 0)}
              />
              <span>%</span>
            </div>
          </div>
        </div>
        <button
          onClick={analyze}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-colors"
          style={{ background: "#2563EB" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Search className="w-4 h-4" />
          Analyze Price Range
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <h2 className="font-semibold" style={{ color: "#0F172A" }}>Price Range Analysis</h2>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
              Based on est. revenue of {formatCurrency(inputs.estAnnualRevenue)}/yr and {inputs.taxRate}% tax rate
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {["Purchase Price", "MART", "Cash Flow", "Tax Savings", "ROI", "Score", "Good Deal?"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr
                  key={r.price}
                  className="transition-colors"
                  style={{
                    borderBottom: "1px solid #F1F5F9",
                    background: r.isGoodDeal ? "rgba(34,197,94,0.04)" : "transparent",
                  }}
                >
                  <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: "#0F172A" }}>{formatCurrency(r.price)}</td>
                  <td className="px-6 py-3.5 text-sm" style={{ color: "#64748B" }}>{formatCurrency(r.mart)}</td>
                  <td className="px-6 py-3.5 text-sm font-medium" style={{ color: r.cashFlow > 0 ? "#22C55E" : "#EF4444" }}>
                    {formatCurrency(r.cashFlow)}
                  </td>
                  <td className="px-6 py-3.5 text-sm" style={{ color: "#22C55E" }}>{formatCurrency(r.taxSavings)}</td>
                  <td className="px-6 py-3.5 text-sm font-medium" style={{ color: r.roi >= 25 ? "#22C55E" : "#64748B" }}>
                    {formatPct(r.roi)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBadgeColor(r.score)}`}>
                      {r.score}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    {r.isGoodDeal ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: "#22C55E" }} />
                    ) : (
                      <XCircle className="w-4 h-4" style={{ color: "#E2E8F0" }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
