"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, BarChart2, TrendingUp, DollarSign, Target, MapPin, Bed, Trash2,
  Calculator, Brain, Zap, BarChart3, Trophy, Briefcase,
} from "lucide-react";
import { Deal } from "@/lib/types";
import { getDeals, deleteDeal } from "@/lib/storage";
import { formatCurrency, formatPct, getScoreBadgeColor } from "@/lib/calculations";

export default function DashboardPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const router = useRouter();

  useEffect(() => {
    setDeals(getDeals());
  }, []);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Delete this deal?")) {
      deleteDeal(id);
      setDeals(getDeals());
    }
  }

  const totalDeals = deals.length;
  const avgRoi = totalDeals > 0 ? deals.reduce((s, d) => s + d.results.roi, 0) / totalDeals : 0;
  const bestDeal = deals.reduce<Deal | null>((best, d) => {
    if (!best || d.results.score > best.results.score) return d;
    return best;
  }, null);
  const totalTaxSavings = deals.reduce((s, d) => s + d.results.taxSavings, 0);

  const modules = [
    { href: "/analyze", label: "Deal Analyzer", icon: Calculator, description: "Evaluate any STR deal with MART, cash flow, and depreciation analysis", color: "#2563EB" },
    { href: "/predict", label: "Revenue Predictor", icon: Brain, description: "ML-powered revenue predictions based on property attributes", color: "#8B5CF6" },
    { href: "/deal-finder", label: "Deal Finder", icon: Zap, description: "Discover and rank STR investment opportunities by ROI", color: "#F59E0B" },
    { href: "/market", label: "Market Analytics", icon: BarChart3, description: "Deep-dive market intelligence for any U.S. STR market", color: "#06B6D4" },
    { href: "/competitors", label: "Competitor Analysis", icon: Trophy, description: "Benchmark your property against competing listings", color: "#22C55E" },
    { href: "/portfolio", label: "My Portfolio", icon: Briefcase, description: "Track and manage all your saved STR investment deals", color: "#FF5A5F" },
  ];

  return (
    <div className="p-8" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#0F172A" }}>STR Intelligence Platform</h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Bloomberg-grade analytics for short-term rental investors
          </p>
        </div>
        <Link
          href="/analyze"
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ background: "#2563EB" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Deals Analyzed" value={String(totalDeals)} icon={<BarChart2 className="w-5 h-5" style={{ color: "#64748B" }} />} />
        <StatCard label="Avg Portfolio ROI" value={totalDeals > 0 ? formatPct(avgRoi) : "—"} icon={<TrendingUp className="w-5 h-5" style={{ color: "#22C55E" }} />} accentColor="#22C55E" />
        <StatCard label="Total Tax Savings" value={totalDeals > 0 ? formatCurrency(totalTaxSavings) : "—"} icon={<DollarSign className="w-5 h-5" style={{ color: "#2563EB" }} />} accentColor="#2563EB" />
        <StatCard label="Best Deal Score" value={bestDeal ? String(bestDeal.results.score) : "—"} sub={bestDeal?.inputs.dealName} icon={<Target className="w-5 h-5" style={{ color: "#8B5CF6" }} />} accentColor="#8B5CF6" />
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Quick Actions:</p>
        {[
          { href: "/analyze", label: "Analyze New Deal", primary: true },
          { href: "/market", label: "Explore Market", primary: false },
          { href: "/deal-finder", label: "Find Deals", primary: false },
          { href: "/predict", label: "Predict Revenue", primary: false },
        ].map(({ href, label, primary }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={primary
              ? { background: "#2563EB", color: "#fff" }
              : { background: "#fff", color: "#0F172A", border: "1px solid #E2E8F0" }
            }
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Recent Deals */}
      {deals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: "#0F172A" }}>Recent Deals</h2>
            <Link href="/portfolio" className="text-sm font-medium" style={{ color: "#2563EB" }}>View all →</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {deals.slice(-3).reverse().map((deal) => (
              <DealCard key={deal.id} deal={deal} onDelete={handleDelete} onClick={() => router.push(`/analyze?id=${deal.id}`)} />
            ))}
          </div>
        </div>
      )}

      {/* Platform Modules */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: "#0F172A" }}>Platform Modules</h2>
        <div className="grid grid-cols-3 gap-4">
          {modules.map(({ href, label, icon: Icon, description, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl p-5 shadow-sm transition-all hover:shadow-md"
              style={{ border: "1px solid #E2E8F0" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "#0F172A" }}>{label}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, icon, accentColor,
}: {
  label: string; value: string; sub?: string; icon: React.ReactNode; accentColor?: string;
}) {
  return (
    <div
      className="bg-white rounded-xl p-5 shadow-sm"
      style={{
        border: "1px solid #E2E8F0",
        borderTop: accentColor ? `2px solid ${accentColor}` : "1px solid #E2E8F0",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color: "#0F172A" }}>{value}</p>
      {sub && <p className="text-xs mt-1 truncate" style={{ color: "#64748B" }}>{sub}</p>}
    </div>
  );
}

function DealCard({
  deal, onDelete, onClick,
}: {
  deal: Deal; onDelete: (id: string, e: React.MouseEvent) => void; onClick: () => void;
}) {
  const { inputs, results } = deal;
  const badgeColor = getScoreBadgeColor(results.score);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md"
      style={{ border: "1px solid #E2E8F0" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-base" style={{ color: "#0F172A" }}>{inputs.dealName || "Unnamed Deal"}</h3>
          {inputs.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" style={{ color: "#64748B" }} />
              <span className="text-xs" style={{ color: "#64748B" }}>{inputs.location}</span>
            </div>
          )}
        </div>
        <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${badgeColor}`}>{results.score}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <Metric label="Price" value={formatCurrency(inputs.purchasePrice)} />
        <Metric label="Cash Flow" value={formatCurrency(results.cashFlow)} positive={results.cashFlow > 0} />
        <Metric label="ROI" value={formatPct(results.roi)} positive={results.roi >= 25} />
      </div>

      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
        <div className="flex items-center gap-3 text-xs" style={{ color: "#64748B" }}>
          {inputs.bedrooms > 0 && (
            <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{inputs.bedrooms} beds</span>
          )}
          {inputs.propertyType && <span>&middot; {inputs.propertyType}</span>}
        </div>
        <button
          onClick={(e) => onDelete(deal.id, e)}
          className="transition-colors"
          style={{ color: "#E2E8F0" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EF4444")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#E2E8F0")}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  const color = positive !== undefined ? (positive ? "#22C55E" : "#EF4444") : "#0F172A";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#64748B" }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color }}>{value}</p>
    </div>
  );
}
