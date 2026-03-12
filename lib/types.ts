export type PropertyType = "cabin" | "condo" | "single family" | "townhouse" | "beach house" | "";

export interface DealInputs {
  dealName: string;
  purchasePrice: number;
  downPaymentPct: number;
  closingCosts: number;
  furnishingBudget: number;
  costSegregationCost: number;
  top25Revenue: number;
  occupancyRate: number;
  avgNightlyRate: number;
  federalTaxRate: number;
  location: string;
  propertyType: PropertyType;
  bedrooms: number;
}

export interface DealResults {
  mart: number;
  downPaymentAmount: number;
  totalCashInvested: number;
  depreciableBasis: number;
  year1Depreciation: number;
  taxSavings: number;
  cashFlow: number;
  roi: number;
  score: number;
  isGoodDeal: boolean;
}

export interface Deal {
  id: string;
  createdAt: string;
  inputs: DealInputs;
  results: DealResults;
}

export interface DealFinderInputs {
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  estAnnualRevenue: number;
  taxRate: number;
}
