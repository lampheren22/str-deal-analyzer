"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  Home, DollarSign, Percent, MapPin, Building2,
  RotateCcw, Save, BarChart2, TrendingUp, BadgeCheck, BadgeX,
  ChevronRight,
} from "lucide-react";
import { DealInputs, PropertyType } from "@/lib/types";
import { calculateDeal, formatCurrency, formatPct, getScoreBadgeColor } from "@/lib/calculations";
import { saveDeal, getDealById, updateDeal } from "@/lib/storage";

const DEFAULT_INPUTS: DealInputs = {
  dealName: "",
  purchasePrice: 500000,
  downPaymentPct: 20,
  closingCosts: 15000,
  furnishingBudget: 25000,
  costSegregationCost: 5000,
  top25Revenue: 90000,
  occupancyRate: 70,
  avgNightlyRate: 250,
  federalTaxRate: 32,
  location: "",
  propertyType: "",
  bedrooms: 0,
};

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  const [inputs, setInputs] = useState<DealInputs>(DEFAULT_INPUTS);
  const [saved, setSaved] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (editId) {
      const deal = getDealById(editId);
      if (deal) {
        setInputs(deal.inputs);
        setShowResults(true);
      }
    }
  }, [editId]);

  const results = calculateDeal(inputs);

  const set = useCallback((field: keyof DealInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setShowResults(false);
    setSaved(false);
  }, []);

  function handleReset() {
    setInputs(DEFAULT_INPUTS);
    setShowResults(false);
    setSaved(false);
    if (editId) router.push("/analyze");
  }

  function handleSave() {
    if (editId) {
      updateDeal(editId, inputs);
    } else {
      saveDeal(inputs);
    }
    setShowResults(true);
    setSaved(true);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analyze a Deal</h1>
          <p className="text-sm text-gray-500 mt-0.5">Enter property details to evaluate STR performance</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Deal"}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Form */}
        <div className="w-[560px] flex-shrink-0 space-y-5">
          {/* Property Details */}
          <Section icon={<Home className="w-4 h-4 text-blue-500" />} title="Property Details">
            <Field label="Deal Name" icon={null}>
              <input
                type="text"
                placeholder="e.g. Mountain View Cabin"
                value={inputs.dealName}
                onChange={(e) => set("dealName", e.target.value)}
                className="input w-full"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Purchase Price" icon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}>
                <PrefixInput
                  prefix="$"
                  type="number"
                  value={inputs.purchasePrice}
                  onChange={(v) => set("purchasePrice", v)}
                />
              </Field>
              <Field label="Down Payment" icon={<Percent className="w-3.5 h-3.5 text-gray-400" />}>
                <SuffixInput
                  suffix="%"
                  type="number"
                  value={inputs.downPaymentPct}
                  onChange={(v) => set("downPaymentPct", v)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Closing Costs" icon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}>
                <PrefixInput prefix="$" type="number" value={inputs.closingCosts} onChange={(v) => set("closingCosts", v)} />
              </Field>
              <Field label="Furnishing Budget" icon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}>
                <PrefixInput prefix="$" type="number" value={inputs.furnishingBudget} onChange={(v) => set("furnishingBudget", v)} />
              </Field>
            </div>
            <Field label="Cost Segregation Cost" icon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}>
              <PrefixInput prefix="$" type="number" value={inputs.costSegregationCost} onChange={(v) => set("costSegregationCost", v)} className="w-48" />
            </Field>
          </Section>

          {/* Revenue Data */}
          <Section icon={<DollarSign className="w-4 h-4 text-green-500" />} title="Revenue Data">
            <Field label="Top 25% Comparable Revenue" icon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}>
              <PrefixInput prefix="$" type="number" value={inputs.top25Revenue} onChange={(v) => set("top25Revenue", v)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Occupancy Rate" icon={<Percent className="w-3.5 h-3.5 text-gray-400" />}>
                <SuffixInput suffix="%" type="number" value={inputs.occupancyRate} onChange={(v) => set("occupancyRate", v)} />
              </Field>
              <Field label="Avg Nightly Rate (Optional)" icon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}>
                <PrefixInput prefix="$" type="number" value={inputs.avgNightlyRate} onChange={(v) => set("avgNightlyRate", v)} />
              </Field>
            </div>
          </Section>

          {/* Tax Data */}
          <Section icon={<Percent className="w-4 h-4 text-orange-500" />} title="Tax Data">
            <Field label="Federal Marginal Tax Rate" icon={<Percent className="w-3.5 h-3.5 text-gray-400" />}>
              <SuffixInput suffix="%" type="number" value={inputs.federalTaxRate} onChange={(v) => set("federalTaxRate", v)} className="w-48" />
            </Field>
          </Section>

          {/* Optional Details */}
          <Section icon={<MapPin className="w-4 h-4 text-gray-400" />} title="Optional Details">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Property Location" icon={<MapPin className="w-3.5 h-3.5 text-gray-400" />}>
                <input
                  type="text"
                  placeholder="Gatlinburg, TN"
                  value={inputs.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="input w-full"
                />
              </Field>
              <Field label="Property Type" icon={<Building2 className="w-3.5 h-3.5 text-gray-400" />}>
                <select
                  value={inputs.propertyType}
                  onChange={(e) => set("propertyType", e.target.value as PropertyType)}
                  className="input w-full"
                >
                  <option value="">Select type</option>
                  <option value="cabin">Cabin</option>
                  <option value="condo">Condo</option>
                  <option value="single family">Single Family</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="beach house">Beach House</option>
                </select>
              </Field>
            </div>
            <Field label="Bedrooms" icon={null}>
              <SuffixInput suffix="beds" type="number" value={inputs.bedrooms} onChange={(v) => set("bedrooms", v)} className="w-36" />
            </Field>
          </Section>
        </div>

        {/* Results Panel */}
        <div className="flex-1">
          {!showResults ? (
            <div className="flex flex-col items-center justify-center h-80 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
              <BarChart2 className="w-12 h-12 text-gray-200 mb-3" />
              <p className="font-semibold text-gray-700">Enter Deal Details</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                Fill in the property and revenue data to see your investment analysis.
              </p>
              <button
                onClick={() => setShowResults(true)}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700"
              >
                Preview Results <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <ResultsPanel inputs={inputs} results={results} />
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsPanel({ inputs, results }: { inputs: DealInputs; results: ReturnType<typeof calculateDeal> }) {
  const badgeColor = getScoreBadgeColor(results.score);

  return (
    <div className="space-y-4">
      {/* Score + verdict */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Deal Analysis</h2>
          <span className={`text-lg font-bold px-3 py-1 rounded-lg ${badgeColor}`}>
            Score: {results.score}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {results.isGoodDeal ? (
            <BadgeCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <BadgeX className="w-6 h-6 text-red-400 flex-shrink-0" />
          )}
          <p className="text-sm font-medium text-gray-700">
            {results.isGoodDeal
              ? "Strong deal — positive cash flow and 25%+ ROI"
              : results.cashFlow <= 0
              ? "Revenue doesn't cover MART — negative cash flow"
              : "Cash flow positive but ROI below 25% threshold"}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Key Metrics</h3>
        <div className="space-y-3">
          <ResultRow label="MART (Min Annual Revenue)" value={formatCurrency(results.mart)} formula={`${formatCurrency(inputs.purchasePrice)} ÷ 7.5`} />
          <ResultRow
            label="Potential Cash Flow"
            value={formatCurrency(results.cashFlow)}
            formula={`${formatCurrency(inputs.top25Revenue)} − ${formatCurrency(results.mart)}`}
            valueColor={results.cashFlow > 0 ? "text-green-600" : "text-red-500"}
          />
          <ResultRow label="Down Payment" value={formatCurrency(results.downPaymentAmount)} formula={`${inputs.downPaymentPct}% of ${formatCurrency(inputs.purchasePrice)}`} />
          <ResultRow label="Total Cash Invested" value={formatCurrency(results.totalCashInvested)} />
        </div>
      </div>

      {/* Depreciation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Depreciation & Tax Benefits</h3>
        <div className="space-y-3">
          <ResultRow label="Depreciable Basis" value={formatCurrency(results.depreciableBasis)} formula={`${formatCurrency(inputs.purchasePrice)} × 80%`} />
          <ResultRow label="Year 1 Depreciation" value={formatCurrency(results.year1Depreciation)} formula="Depreciable Basis × 30%" />
          <ResultRow
            label="Tax Savings"
            value={formatCurrency(results.taxSavings)}
            formula={`${formatCurrency(results.year1Depreciation)} × ${inputs.federalTaxRate}%`}
            valueColor="text-green-600"
          />
        </div>
      </div>

      {/* ROI */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Year-1 Total ROI</h3>
        <p className="text-3xl font-bold text-gray-900 mb-1">{formatPct(results.roi)}</p>
        <p className="text-xs text-gray-400">
          ({formatCurrency(results.taxSavings)} tax savings + {formatCurrency(results.cashFlow)} cash flow) ÷ {formatCurrency(results.totalCashInvested)} invested
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className={`flex-1 h-2 rounded-full bg-gray-100 overflow-hidden`}>
            <div
              className={`h-full rounded-full ${results.roi >= 25 ? "bg-green-500" : "bg-red-400"}`}
              style={{ width: `${Math.min(100, Math.max(0, results.roi * 2))}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">25% target</span>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  formula,
  valueColor = "text-gray-900",
}: {
  label: string;
  value: string;
  formula?: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        {formula && <p className="text-xs text-gray-400 mt-0.5">{formula}</p>}
      </div>
      <p className={`text-sm font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function PrefixInput({
  prefix,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  prefix: string;
  value: number | string;
  onChange: (v: number) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent ${className}`}>
      <span className="px-3 text-gray-400 text-sm border-r border-gray-200 bg-gray-50 py-2.5">{prefix}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="flex-1 px-3 py-2.5 text-sm text-gray-900 outline-none min-w-0"
      />
    </div>
  );
}

function SuffixInput({
  suffix,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  suffix: string;
  value: number | string;
  onChange: (v: number) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent ${className}`}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="flex-1 px-3 py-2.5 text-sm text-gray-900 outline-none min-w-0"
      />
      <span className="px-3 text-gray-400 text-sm border-l border-gray-200 bg-gray-50 py-2.5">{suffix}</span>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense>
      <AnalyzeContent />
    </Suspense>
  );
}
