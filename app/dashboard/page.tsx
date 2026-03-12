"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, BarChart2, TrendingUp, DollarSign, Target, MapPin, Bed, Trash2 } from "lucide-react";
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
  const totalCashFlow = deals.reduce((s, d) => s + d.results.cashFlow, 0);
  const bestDeal = deals.reduce<Deal | null>((best, d) => {
    if (!best || d.results.score > best.results.score) return d;
    return best;
  }, null);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>{totalDeals} deal{totalDeals !== 1 ? "s" : ""} analyzed</p>
        </div>
        <Link
          href="/analyze"
          className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
          style={{ background: "#2563EB" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Deals"
          value={String(totalDeals)}
          icon={<BarChart2 className="w-5 h-5" style={{ color: "#64748B" }} />}
        />
        <StatCard
          label="Avg ROI"
          value={totalDeals > 0 ? formatPct(avgRoi) : "—"}
          icon={<TrendingUp className="w-5 h-5" style={{ color: "#22C55E" }} />}
          accentColor="#22C55E"
        />
        <StatCard
          label="Total Cash Flow"
          value={totalDeals > 0 ? formatCurrency(totalCashFlow) : "—"}
          icon={<DollarSign className="w-5 h-5" style={{ color: "#2563EB" }} />}
          accentColor="#2563EB"
        />
        <StatCard
          label="Best Score"
          value={bestDeal ? String(bestDeal.results.score) : "—"}
          sub={bestDeal?.inputs.dealName}
          icon={<Target className="w-5 h-5" style={{ color: "#8B5CF6" }} />}
          accentColor="#8B5CF6"
        />
      </div>

      {/* Deal Cards */}
      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BarChart2 className="w-12 h-12 mb-4" style={{ color: "#E2E8F0" }} />
          <p className="font-medium" style={{ color: "#64748B" }}>No deals yet</p>
          <p className="text-sm mt-1 mb-4" style={{ color: "#94A3B8" }}>Analyze your first STR investment to get started.</p>
          <Link
            href="/analyze"
            className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
            style={{ background: "#2563EB" }}
          >
            Analyze a Deal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onDelete={handleDelete} onClick={() => router.push(`/analyze?id=${deal.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accentColor,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accentColor?: string;
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
  deal,
  onDelete,
  onClick,
}: {
  deal: Deal;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: () => void;
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
          <h3 className="font-semibold text-base" style={{ color: "#0F172A" }}>{inputs.dealName}</h3>
          {inputs.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" style={{ color: "#64748B" }} />
              <span className="text-xs" style={{ color: "#64748B" }}>{inputs.location}</span>
            </div>
          )}
        </div>
        <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${badgeColor}`}>
          {results.score}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <Metric label="Price" value={formatCurrency(inputs.purchasePrice)} />
        <Metric label="Cash Flow" value={formatCurrency(results.cashFlow)} positive={results.cashFlow > 0} />
        <Metric label="ROI" value={formatPct(results.roi)} positive={results.roi >= 25} />
      </div>

      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
        <div className="flex items-center gap-3 text-xs" style={{ color: "#64748B" }}>
          {inputs.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-3 h-3" />
              {inputs.bedrooms} beds
            </span>
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
  const color =
    positive !== undefined
      ? positive
        ? "#22C55E"
        : "#EF4444"
      : "#0F172A";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#64748B" }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        {positive !== undefined && positive ? "~" : ""}{value}
      </p>
    </div>
  );
}
