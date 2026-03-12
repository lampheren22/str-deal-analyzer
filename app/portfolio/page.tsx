"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, DollarSign, TrendingUp, Target, Trash2, ExternalLink } from "lucide-react";
import { Deal } from "@/lib/types";
import { getDeals, deleteDeal } from "@/lib/storage";
import { formatCurrency, formatPct, getScoreBadgeColor } from "@/lib/calculations";

export default function PortfolioPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const router = useRouter();

  useEffect(() => {
    setDeals(getDeals());
  }, []);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Remove this deal from portfolio?")) {
      deleteDeal(id);
      setDeals(getDeals());
    }
  }

  const totalRevenue = deals.reduce((s, d) => s + d.inputs.top25Revenue, 0);
  const totalCashFlow = deals.reduce((s, d) => s + d.results.cashFlow, 0);
  const avgRoi = deals.length > 0 ? deals.reduce((s, d) => s + d.results.roi, 0) / deals.length : 0;
  const bestScore = deals.length > 0 ? Math.max(...deals.map((d) => d.results.score)) : 0;

  const revenueChartData = deals.map((d) => ({
    name: d.inputs.dealName || "Unnamed",
    revenue: d.inputs.top25Revenue,
    score: d.results.score,
  }));

  const roiChartData = deals.map((d) => ({
    name: d.inputs.dealName || "Unnamed",
    roi: parseFloat(d.results.roi.toFixed(1)),
  }));

  if (deals.length === 0) {
    return (
      <div className="p-4 md:p-8" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>My Portfolio</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Track and manage your STR investment deals</p>
        </div>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Briefcase className="w-16 h-16 mb-4" style={{ color: "#E2E8F0" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "#0F172A" }}>No Deals in Portfolio</h3>
          <p className="text-sm mb-6 max-w-sm" style={{ color: "#64748B" }}>
            Analyze and save your first STR deal to start building your investment portfolio.
          </p>
          <Link
            href="/analyze"
            className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg"
            style={{ background: "#2563EB" }}
          >
            Analyze Your First Deal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>My Portfolio</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>{deals.length} deal{deals.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <Link
          href="/analyze"
          className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg"
          style={{ background: "#2563EB" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
        >
          + Add Deal
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Properties", value: String(deals.length), color: "#2563EB", icon: <Briefcase className="w-4 h-4" style={{ color: "#2563EB" }} /> },
          { label: "Total Annual Revenue", value: formatCurrency(totalRevenue), color: "#22C55E", icon: <DollarSign className="w-4 h-4" style={{ color: "#22C55E" }} /> },
          { label: "Total Cash Flow", value: formatCurrency(totalCashFlow), color: totalCashFlow >= 0 ? "#22C55E" : "#EF4444", icon: <TrendingUp className="w-4 h-4" style={{ color: totalCashFlow >= 0 ? "#22C55E" : "#EF4444" }} /> },
          { label: "Avg ROI", value: formatPct(avgRoi), color: avgRoi >= 25 ? "#22C55E" : "#F59E0B", icon: <Target className="w-4 h-4" style={{ color: "#8B5CF6" }} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #E2E8F0", borderTop: `3px solid ${color}` }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>{label}</p>
              {icon}
            </div>
            <p className="text-2xl font-bold" style={{ color: "#0F172A" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {deals.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Revenue by Property</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueChartData} margin={{ top: 5, right: 10, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                          <p className="font-semibold" style={{ color: "#0F172A" }}>{label}</p>
                          <p style={{ color: "#22C55E" }}>Revenue: {formatCurrency(Number(payload[0]?.value))}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>ROI Comparison</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={roiChartData} margin={{ top: 5, right: 10, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                          <p className="font-semibold" style={{ color: "#0F172A" }}>{label}</p>
                          <p style={{ color: "#2563EB" }}>ROI: {payload[0]?.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={25} stroke="#22C55E" strokeDasharray="4 2" label={{ value: "25% target", position: "insideTopRight", fontSize: 10, fill: "#22C55E" }} />
                <Bar dataKey="roi" name="ROI %" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Portfolio Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto" style={{ border: "1px solid #E2E8F0" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <h3 className="text-base font-semibold" style={{ color: "#0F172A" }}>Portfolio Holdings</h3>
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Best score: <span className="font-semibold" style={{ color: "#22C55E" }}>{bestScore}</span></p>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              {["Deal Name", "Location", "Price", "Cash Flow", "ROI", "Score", "Date Added", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{deal.inputs.dealName || "Unnamed Deal"}</p>
                    {deal.inputs.propertyType && <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{deal.inputs.propertyType} • {deal.inputs.bedrooms} BR</p>}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>{deal.inputs.location || "—"}</td>
                <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "#0F172A" }}>{formatCurrency(deal.inputs.purchasePrice)}</td>
                <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: deal.results.cashFlow > 0 ? "#22C55E" : "#EF4444" }}>
                  {deal.results.cashFlow > 0 ? "+" : ""}{formatCurrency(deal.results.cashFlow)}
                </td>
                <td className="px-5 py-3.5 text-sm font-medium" style={{ color: deal.results.roi >= 25 ? "#22C55E" : "#64748B" }}>
                  {formatPct(deal.results.roi)}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBadgeColor(deal.results.score)}`}>
                    {deal.results.score}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                  {new Date(deal.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/analyze?id=${deal.id}`)}
                      className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded"
                      style={{ color: "#2563EB", background: "#EFF6FF" }}
                    >
                      <ExternalLink className="w-3 h-3" /> View
                    </button>
                    <button
                      onClick={(e) => handleDelete(deal.id, e)}
                      className="transition-colors"
                      style={{ color: "#E2E8F0" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EF4444")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#E2E8F0")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
