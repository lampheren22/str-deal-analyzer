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
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">Deal Finder</h1>
        </div>
        <p className="text-sm text-gray-500">Estimate if a deal meets MART based on your revenue assumptions</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="field-label">City</label>
            <input
              type="text"
              placeholder="e.g. Gatlinburg, TN"
              value={inputs.city}
              onChange={(e) => set("city", e.target.value)}
              className="input w-full"
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
              className="input w-full"
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
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          Analyze Price Range
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Price Range Analysis</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Based on est. revenue of {formatCurrency(inputs.estAnnualRevenue)}/yr and {inputs.taxRate}% tax rate
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Purchase Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">MART</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cash Flow</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tax Savings</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ROI</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Good Deal?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {results.map((r) => (
                <tr key={r.price} className={`${r.isGoodDeal ? "bg-green-50/30" : ""} hover:bg-gray-50/50 transition-colors`}>
                  <td className="px-6 py-3.5 text-sm font-semibold text-gray-900">{formatCurrency(r.price)}</td>
                  <td className="px-6 py-3.5 text-sm text-gray-600">{formatCurrency(r.mart)}</td>
                  <td className={`px-6 py-3.5 text-sm font-medium ${r.cashFlow > 0 ? "text-green-600" : "text-red-500"}`}>
                    {formatCurrency(r.cashFlow)}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-green-600">{formatCurrency(r.taxSavings)}</td>
                  <td className={`px-6 py-3.5 text-sm font-medium ${r.roi >= 25 ? "text-green-600" : "text-gray-600"}`}>
                    {formatPct(r.roi)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBadgeColor(r.score)}`}>
                      {r.score}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    {r.isGoodDeal ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300" />
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
