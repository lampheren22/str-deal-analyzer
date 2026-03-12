"use client";

import { useEffect, useState } from "react";
import { FileSpreadsheet, Download, CheckSquare, Square, MapPin } from "lucide-react";
import { Deal } from "@/lib/types";
import { getDeals } from "@/lib/storage";
import { formatCurrency, formatPct, getScoreBadgeColor } from "@/lib/calculations";

export default function ExportPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setDeals(getDeals());
  }, []);

  function toggle(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function toggleAll() {
    if (selected.length === deals.length) {
      setSelected([]);
    } else {
      setSelected(deals.map((d) => d.id));
    }
  }

  const selectedDeals = deals.filter((d) => selected.includes(d.id));

  function exportCSV() {
    if (selectedDeals.length === 0) return;
    const headers = [
      "Deal Name", "Location", "Property Type", "Bedrooms",
      "Purchase Price", "Down Payment %", "Closing Costs", "Furnishing Budget",
      "Cost Segregation", "Total Cash Invested", "Top 25% Revenue",
      "Occupancy Rate %", "Avg Nightly Rate", "Federal Tax Rate %",
      "MART", "Cash Flow", "Depreciable Basis", "Year 1 Depreciation",
      "Tax Savings", "Year-1 ROI %", "Deal Score", "Good Deal",
    ];
    const rows = selectedDeals.map((d) => [
      d.inputs.dealName, d.inputs.location, d.inputs.propertyType, d.inputs.bedrooms,
      d.inputs.purchasePrice, d.inputs.downPaymentPct, d.inputs.closingCosts,
      d.inputs.furnishingBudget, d.inputs.costSegregationCost, d.results.totalCashInvested,
      d.inputs.top25Revenue, d.inputs.occupancyRate, d.inputs.avgNightlyRate, d.inputs.federalTaxRate,
      d.results.mart.toFixed(0), d.results.cashFlow.toFixed(0), d.results.depreciableBasis.toFixed(0),
      d.results.year1Depreciation.toFixed(0), d.results.taxSavings.toFixed(0),
      d.results.roi.toFixed(2), d.results.score, d.results.isGoodDeal ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "str-deals.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportReport() {
    if (selectedDeals.length === 0) return;
    const lines: string[] = [
      "STR DEAL ANALYZER — INVESTMENT REPORT",
      `Generated: ${new Date().toLocaleDateString()}`,
      "=".repeat(60),
      "",
    ];
    selectedDeals.forEach((d, i) => {
      lines.push(`${i + 1}. ${d.inputs.dealName || "Unnamed Deal"}`);
      if (d.inputs.location) lines.push(`   Location: ${d.inputs.location}`);
      lines.push(`   Purchase Price:      ${formatCurrency(d.inputs.purchasePrice)}`);
      lines.push(`   Total Cash Invested: ${formatCurrency(d.results.totalCashInvested)}`);
      lines.push(`   MART:                ${formatCurrency(d.results.mart)}`);
      lines.push(`   Cash Flow:           ${formatCurrency(d.results.cashFlow)}`);
      lines.push(`   Year 1 Tax Savings:  ${formatCurrency(d.results.taxSavings)}`);
      lines.push(`   Year-1 ROI:          ${formatPct(d.results.roi)}`);
      lines.push(`   Deal Score:          ${d.results.score}/100`);
      lines.push(`   Verdict:             ${d.results.isGoodDeal ? "✓ STRONG DEAL" : "✗ Needs Review"}`);
      lines.push("");
    });
    const text = lines.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "str-deal-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Export Deals</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Select deals and export as CSV or report</p>
      </div>

      {deals.length === 0 ? (
        <div className="text-sm" style={{ color: "#64748B" }}>No deals saved yet.</div>
      ) : (
        <>
          {/* Select all */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={toggleAll}
              className="text-sm font-medium transition-colors"
              style={{ color: "#2563EB" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#1D4ED8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#2563EB")}
            >
              {selected.length === deals.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm" style={{ color: "#64748B" }}>{selected.length} selected</span>
          </div>

          {/* Deal list */}
          <div className="space-y-2 mb-6">
            {deals.map((deal) => {
              const isSelected = selected.includes(deal.id);
              return (
                <div
                  key={deal.id}
                  onClick={() => toggle(deal.id)}
                  className="flex items-center justify-between p-4 bg-white rounded-xl cursor-pointer transition-all"
                  style={{
                    border: isSelected ? "1px solid #2563EB" : "1px solid #E2E8F0",
                    boxShadow: isSelected ? "0 0 0 1px #2563EB" : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5" style={{ color: "#2563EB" }} />
                    ) : (
                      <Square className="w-5 h-5" style={{ color: "#E2E8F0" }} />
                    )}
                    <div>
                      <p className="font-medium text-sm" style={{ color: "#0F172A" }}>{deal.inputs.dealName || "Unnamed Deal"}</p>
                      {deal.inputs.location && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" style={{ color: "#64748B" }} />
                          <span className="text-xs" style={{ color: "#64748B" }}>{deal.inputs.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{formatCurrency(deal.inputs.purchasePrice)}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBadgeColor(deal.results.score)}`}>
                      Score: {deal.results.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Export buttons */}
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              disabled={selected.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={exportReport}
              disabled={selected.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#2563EB" }}
              onMouseEnter={(e) => {
                if (selected.length > 0) (e.currentTarget as HTMLElement).style.background = "#1D4ED8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#2563EB";
              }}
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}
