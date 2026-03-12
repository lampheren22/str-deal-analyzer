"use client";

import { useEffect, useState } from "react";
import { GitCompare, MapPin, X } from "lucide-react";
import { Deal } from "@/lib/types";
import { getDeals } from "@/lib/storage";
import { formatCurrency, formatPct, getScoreBadgeColor } from "@/lib/calculations";

export default function ComparePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setDeals(getDeals());
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  const selectedDeals = selected.map((id) => deals.find((d) => d.id === id)).filter(Boolean) as Deal[];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Compare Deals</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Select up to 4 deals to compare side by side</p>
      </div>

      {/* Deal Selector chips */}
      {deals.length === 0 ? (
        <p className="text-sm" style={{ color: "#64748B" }}>No deals saved yet. Analyze some deals first.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-8">
          {deals.map((deal) => {
            const active = selected.includes(deal.id);
            return (
              <button
                key={deal.id}
                onClick={() => toggle(deal.id)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                style={
                  active
                    ? { background: "#2563EB", color: "#fff", borderColor: "#2563EB" }
                    : { background: "#fff", color: "#0F172A", borderColor: "#E2E8F0" }
                }
              >
                {deal.inputs.dealName || "Unnamed Deal"}
              </button>
            );
          })}
        </div>
      )}

      {/* Compare Table */}
      {selectedDeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <GitCompare className="w-10 h-10 mb-3" style={{ color: "#E2E8F0" }} />
          <p className="text-sm" style={{ color: "#64748B" }}>Click deals above to start comparing</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold uppercase tracking-wider pb-4 pr-6 w-44" style={{ color: "#64748B" }}>
                  Metric
                </th>
                {selectedDeals.map((deal) => (
                  <th key={deal.id} className="pb-4 px-4 min-w-[180px]">
                    <div className="bg-white rounded-xl shadow-sm p-4 text-left" style={{ border: "1px solid #E2E8F0" }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm truncate pr-2" style={{ color: "#0F172A" }}>
                          {deal.inputs.dealName || "Unnamed"}
                        </p>
                        <button
                          onClick={() => toggle(deal.id)}
                          className="flex-shrink-0 transition-colors"
                          style={{ color: "#E2E8F0" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#64748B")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#E2E8F0")}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {deal.inputs.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" style={{ color: "#64748B" }} />
                          <span className="text-xs" style={{ color: "#64748B" }}>{deal.inputs.location}</span>
                        </div>
                      )}
                      <div className="mt-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBadgeColor(deal.results.score)}`}>
                          Score: {deal.results.score}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ borderTop: "1px solid #E2E8F0" }}>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.key} className="transition-colors" style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td className="py-3 pr-6 text-sm font-medium" style={{ color: "#64748B" }}>{row.label}</td>
                  {selectedDeals.map((deal) => {
                    const val = row.getValue(deal);
                    const best = getBest(row, selectedDeals);
                    const isBest = selectedDeals.length > 1 && deal.id === best;
                    return (
                      <td key={deal.id} className="py-3 px-4 text-sm font-semibold">
                        <span style={{ color: isBest ? "#22C55E" : "#0F172A" }}>
                          {row.format(val)}
                        </span>
                        {isBest && selectedDeals.length > 1 && (
                          <span className="ml-1.5 text-[10px] font-normal" style={{ color: "#22C55E" }}>best</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface CompareRow {
  key: string;
  label: string;
  getValue: (d: Deal) => number;
  format: (v: number) => string;
  higherIsBetter?: boolean;
}

const COMPARE_ROWS: CompareRow[] = [
  { key: "price", label: "Purchase Price", getValue: (d) => d.inputs.purchasePrice, format: formatCurrency, higherIsBetter: false },
  { key: "downPct", label: "Down Payment %", getValue: (d) => d.inputs.downPaymentPct, format: (v) => `${v}%`, higherIsBetter: false },
  { key: "cashInvested", label: "Total Cash Invested", getValue: (d) => d.results.totalCashInvested, format: formatCurrency, higherIsBetter: false },
  { key: "mart", label: "MART", getValue: (d) => d.results.mart, format: formatCurrency, higherIsBetter: false },
  { key: "top25", label: "Top 25% Revenue", getValue: (d) => d.inputs.top25Revenue, format: formatCurrency, higherIsBetter: true },
  { key: "cashFlow", label: "Cash Flow", getValue: (d) => d.results.cashFlow, format: formatCurrency, higherIsBetter: true },
  { key: "depreciation", label: "Year 1 Depreciation", getValue: (d) => d.results.year1Depreciation, format: formatCurrency, higherIsBetter: true },
  { key: "taxSavings", label: "Tax Savings", getValue: (d) => d.results.taxSavings, format: formatCurrency, higherIsBetter: true },
  { key: "roi", label: "Year-1 ROI", getValue: (d) => d.results.roi, format: formatPct, higherIsBetter: true },
  { key: "score", label: "Deal Score", getValue: (d) => d.results.score, format: (v) => String(v), higherIsBetter: true },
];

function getBest(row: CompareRow, deals: Deal[]): string | null {
  if (row.higherIsBetter === undefined) return null;
  let bestId: string | null = null;
  let bestVal = row.higherIsBetter ? -Infinity : Infinity;
  for (const deal of deals) {
    const val = row.getValue(deal);
    if (row.higherIsBetter ? val > bestVal : val < bestVal) {
      bestVal = val;
      bestId = deal.id;
    }
  }
  return bestId;
}
