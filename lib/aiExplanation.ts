import { DealInputs, DealResults } from "./types";
import { formatCurrency, formatPct } from "./calculations";

export type AIExplanation = {
  headline: string;
  verdict: "elite" | "strong" | "moderate" | "risky";
  strengths: string[];
  risks: string[];
  summary: string;
  recommendation: string;
};

export function generateExplanation(inputs: DealInputs, results: DealResults): AIExplanation {
  const { purchasePrice, bedrooms, location, top25Revenue, federalTaxRate } = inputs;
  const { mart, cashFlow, roi, taxSavings, score, isGoodDeal, year1Depreciation } = results;

  let verdict: AIExplanation["verdict"];
  if (score >= 90) verdict = "elite";
  else if (score >= 75) verdict = "strong";
  else if (score >= 60) verdict = "moderate";
  else verdict = "risky";

  const strengths: string[] = [];
  if (cashFlow > 0) strengths.push(`Positive cash flow of ${formatCurrency(cashFlow)}/yr — comparable listings generate ${Math.round(((top25Revenue / mart) - 1) * 100)}% more than MART`);
  if (roi >= 25) strengths.push(`${formatPct(roi)} Year-1 ROI exceeds the 25% target threshold`);
  if (bedrooms >= 4) strengths.push(`${bedrooms}-bedroom properties command premium rates and rank in top revenue tiers`);
  if (federalTaxRate >= 32) strengths.push(`${formatCurrency(taxSavings)} in Year-1 tax savings via cost segregation depreciation at ${federalTaxRate}% bracket`);
  if (top25Revenue > mart * 1.3) strengths.push(`Top-performing comps at ${formatCurrency(top25Revenue)} significantly exceed MART of ${formatCurrency(mart)}`);
  if (year1Depreciation > 50000) strengths.push(`Strong depreciation advantage: ${formatCurrency(year1Depreciation)} Year-1 deduction`);
  if (location) strengths.push(`${location} is a high-demand STR market with proven rental history`);
  if (strengths.length === 0) strengths.push("Revenue within range of MART threshold");

  const risks: string[] = [];
  if (cashFlow < 0) risks.push(`Negative cash flow of ${formatCurrency(Math.abs(cashFlow))} — revenue must improve ${formatCurrency(Math.abs(cashFlow))} to break even`);
  if (purchasePrice > 600000) risks.push(`High purchase price of ${formatCurrency(purchasePrice)} requires strong, consistent occupancy`);
  if (roi < 25) risks.push(`ROI of ${formatPct(roi)} is below the 25% target — factor in financing improvements`);
  if (top25Revenue < mart * 1.1) risks.push("Comparable revenues are close to MART with limited cash flow cushion");
  risks.push("Seasonal demand fluctuations may compress off-peak occupancy");
  if (purchasePrice > 500000) risks.push("Rising interest rates may impact refinancing and holding costs");
  if (risks.length > 3) risks.splice(3);

  const headline = verdict === "elite"
    ? `Elite STR opportunity — ${formatPct(roi)} Year-1 ROI with strong market fundamentals`
    : verdict === "strong"
    ? `Strong deal with ${formatPct(roi)} ROI and ${formatCurrency(cashFlow)} annual cash flow`
    : verdict === "moderate"
    ? `Moderate opportunity — deal qualifies but ROI has room to improve`
    : `Deal needs improvement — cash flow and ROI below target thresholds`;

  const summary = `This ${bedrooms}-bedroom property ${location ? `in ${location}` : ""} ${isGoodDeal ? "meets" : "does not meet"} STR investment criteria. ` +
    `With comparable listings averaging ${formatCurrency(top25Revenue)} in annual revenue and a MART of ${formatCurrency(mart)}, ` +
    `the potential cash flow is ${formatCurrency(cashFlow)}. Including Year-1 tax savings of ${formatCurrency(taxSavings)}, ` +
    `the total first-year return is ${formatPct(roi)} on ${formatCurrency(results.totalCashInvested)} cash invested.`;

  const recommendation = verdict === "elite" || verdict === "strong"
    ? "Proceed with due diligence. Request STR revenue data from local property managers and verify comparable listings."
    : verdict === "moderate"
    ? "Consider negotiating purchase price or identifying revenue enhancement opportunities (amenities, professional photography)."
    : "Reassess purchase price or target markets with stronger revenue-to-price ratios.";

  return { headline, verdict, strengths, risks, summary, recommendation };
}
