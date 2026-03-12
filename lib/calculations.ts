import { DealInputs, DealResults } from "./types";

export function calculateDeal(inputs: DealInputs): DealResults {
  const {
    purchasePrice,
    downPaymentPct,
    closingCosts,
    furnishingBudget,
    costSegregationCost,
    top25Revenue,
    federalTaxRate,
  } = inputs;

  // 1. MART: Minimum Annual Revenue Target
  const mart = purchasePrice / 7.5;

  // 2. Down payment amount
  const downPaymentAmount = purchasePrice * (downPaymentPct / 100);

  // 3. Total cash invested
  const totalCashInvested = downPaymentAmount + closingCosts + furnishingBudget + costSegregationCost;

  // 4. Potential cash flow (annual)
  const cashFlow = top25Revenue - mart;

  // 5. Depreciation
  const depreciableBasis = purchasePrice * 0.8;
  const year1Depreciation = depreciableBasis * 0.3;

  // 6. Tax savings
  const taxSavings = year1Depreciation * (federalTaxRate / 100);

  // 7. Year-1 ROI
  const roi = totalCashInvested > 0
    ? ((taxSavings + cashFlow) / totalCashInvested) * 100
    : 0;

  // 8. Deal score (0-100)
  const score = calculateDealScore(roi, cashFlow);

  // 9. Is it a good deal?
  const isGoodDeal = cashFlow > 0 && roi >= 25;

  return {
    mart,
    downPaymentAmount,
    totalCashInvested,
    depreciableBasis,
    year1Depreciation,
    taxSavings,
    cashFlow,
    roi,
    score,
    isGoodDeal,
  };
}

export function calculateDealScore(roi: number, cashFlow: number): number {
  let score = 0;

  // Positive cash flow gate (20 pts)
  if (cashFlow > 0) score += 20;

  // ROI above 25% threshold (30 pts)
  if (roi >= 25) score += 30;

  // ROI magnitude contributes remaining 50 pts
  score += Math.min(50, Math.max(0, roi));

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-500";
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-500";
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Deal Finder: given a price range and est. annual revenue, find optimal price
export function analyzePrice(price: number, estRevenue: number, taxRate: number) {
  const mart = price / 7.5;
  const cashFlow = estRevenue - mart;
  const depreciableBasis = price * 0.8;
  const year1Depreciation = depreciableBasis * 0.3;
  const taxSavings = year1Depreciation * (taxRate / 100);
  const downPayment = price * 0.2;
  const closingCosts = price * 0.03;
  const totalCashIn = downPayment + closingCosts + 25000 + 5000; // est. furnishing + cost seg
  const roi = totalCashIn > 0 ? ((taxSavings + cashFlow) / totalCashIn) * 100 : 0;
  const score = calculateDealScore(roi, cashFlow);
  return { price, mart, cashFlow, taxSavings, roi, score, isGoodDeal: cashFlow > 0 && roi >= 25 };
}
