// City profiles with realistic STR market data
export type CityProfile = {
  baseRevenue3BR: number;
  avgNightlyRate: number;
  avgOccupancy: number;
  seasonalityType: "beach" | "mountain" | "urban" | "resort" | "lakefront";
  marketTier: "premium" | "high" | "medium" | "growing";
  listingCount: number;
  yoyGrowth: number;
  state: string;
};

export const CITY_PROFILES: Record<string, CityProfile> = {
  "Gatlinburg, TN": { baseRevenue3BR: 78000, avgNightlyRate: 285, avgOccupancy: 72, seasonalityType: "mountain", marketTier: "premium", listingCount: 4200, yoyGrowth: 8.2, state: "TN" },
  "Nashville, TN": { baseRevenue3BR: 62000, avgNightlyRate: 225, avgOccupancy: 68, seasonalityType: "urban", marketTier: "high", listingCount: 8500, yoyGrowth: 5.1, state: "TN" },
  "Scottsdale, AZ": { baseRevenue3BR: 74000, avgNightlyRate: 295, avgOccupancy: 65, seasonalityType: "resort", marketTier: "premium", listingCount: 5200, yoyGrowth: 9.4, state: "AZ" },
  "Destin, FL": { baseRevenue3BR: 92000, avgNightlyRate: 385, avgOccupancy: 67, seasonalityType: "beach", marketTier: "premium", listingCount: 6800, yoyGrowth: 7.8, state: "FL" },
  "Gulf Shores, AL": { baseRevenue3BR: 84000, avgNightlyRate: 320, avgOccupancy: 69, seasonalityType: "beach", marketTier: "high", listingCount: 3800, yoyGrowth: 11.2, state: "AL" },
  "Myrtle Beach, SC": { baseRevenue3BR: 68000, avgNightlyRate: 245, avgOccupancy: 66, seasonalityType: "beach", marketTier: "medium", listingCount: 7200, yoyGrowth: 6.3, state: "SC" },
  "Pigeon Forge, TN": { baseRevenue3BR: 72000, avgNightlyRate: 260, avgOccupancy: 73, seasonalityType: "mountain", marketTier: "high", listingCount: 3900, yoyGrowth: 7.5, state: "TN" },
  "Austin, TX": { baseRevenue3BR: 58000, avgNightlyRate: 210, avgOccupancy: 64, seasonalityType: "urban", marketTier: "high", listingCount: 12000, yoyGrowth: 3.8, state: "TX" },
  "New Orleans, LA": { baseRevenue3BR: 65000, avgNightlyRate: 235, avgOccupancy: 69, seasonalityType: "urban", marketTier: "high", listingCount: 9200, yoyGrowth: 4.2, state: "LA" },
  "Charleston, SC": { baseRevenue3BR: 71000, avgNightlyRate: 265, avgOccupancy: 67, seasonalityType: "urban", marketTier: "high", listingCount: 4100, yoyGrowth: 8.6, state: "SC" },
  "Sedona, AZ": { baseRevenue3BR: 88000, avgNightlyRate: 345, avgOccupancy: 68, seasonalityType: "resort", marketTier: "premium", listingCount: 2800, yoyGrowth: 12.1, state: "AZ" },
  "Park City, UT": { baseRevenue3BR: 98000, avgNightlyRate: 420, avgOccupancy: 62, seasonalityType: "mountain", marketTier: "premium", listingCount: 3200, yoyGrowth: 6.9, state: "UT" },
  "Lake Tahoe, CA": { baseRevenue3BR: 94000, avgNightlyRate: 395, avgOccupancy: 63, seasonalityType: "mountain", marketTier: "premium", listingCount: 4600, yoyGrowth: 5.7, state: "CA" },
  "Miami Beach, FL": { baseRevenue3BR: 82000, avgNightlyRate: 325, avgOccupancy: 70, seasonalityType: "beach", marketTier: "premium", listingCount: 15000, yoyGrowth: 4.8, state: "FL" },
  "Key West, FL": { baseRevenue3BR: 105000, avgNightlyRate: 465, avgOccupancy: 71, seasonalityType: "beach", marketTier: "premium", listingCount: 2200, yoyGrowth: 6.4, state: "FL" },
  "San Diego, CA": { baseRevenue3BR: 78000, avgNightlyRate: 310, avgOccupancy: 67, seasonalityType: "beach", marketTier: "high", listingCount: 11500, yoyGrowth: 3.9, state: "CA" },
  "Asheville, NC": { baseRevenue3BR: 66000, avgNightlyRate: 240, avgOccupancy: 69, seasonalityType: "mountain", marketTier: "high", listingCount: 3600, yoyGrowth: 10.3, state: "NC" },
  "Savannah, GA": { baseRevenue3BR: 58000, avgNightlyRate: 215, avgOccupancy: 67, seasonalityType: "urban", marketTier: "medium", listingCount: 3100, yoyGrowth: 9.7, state: "GA" },
  "Breckenridge, CO": { baseRevenue3BR: 96000, avgNightlyRate: 405, avgOccupancy: 61, seasonalityType: "mountain", marketTier: "premium", listingCount: 4000, yoyGrowth: 7.2, state: "CO" },
  "Outer Banks, NC": { baseRevenue3BR: 89000, avgNightlyRate: 355, avgOccupancy: 65, seasonalityType: "beach", marketTier: "high", listingCount: 5100, yoyGrowth: 8.9, state: "NC" },
};

// Seasonality indices Jan-Dec (1.0 = average month)
export const SEASONALITY_INDICES: Record<string, number[]> = {
  beach: [0.55, 0.60, 0.75, 0.90, 1.20, 1.45, 1.55, 1.45, 1.10, 0.80, 0.60, 0.55],
  mountain: [1.25, 1.10, 0.85, 0.70, 0.75, 0.90, 1.15, 1.10, 0.80, 0.85, 1.05, 1.30],
  urban: [0.85, 0.85, 0.95, 1.05, 1.10, 1.10, 1.05, 1.05, 1.10, 1.05, 0.90, 0.90],
  resort: [0.95, 0.85, 1.05, 1.15, 1.10, 0.85, 0.85, 0.90, 1.10, 1.15, 1.05, 1.00],
  lakefront: [0.45, 0.50, 0.65, 0.85, 1.25, 1.45, 1.55, 1.50, 1.15, 0.80, 0.50, 0.45],
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Bedroom revenue multipliers
const BR_MULTIPLIERS: Record<number, number> = { 1: 0.52, 2: 0.78, 3: 1.0, 4: 1.32, 5: 1.65, 6: 2.0 };

// Seeded pseudo-random for deterministic data per city
function seededRng(seed: string) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h) ^ seed.charCodeAt(i);
    h = h >>> 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) | 0;
    h = h >>> 0;
    return h / 0x100000000;
  };
}

export type MarketData = {
  city: string;
  profile: CityProfile;
  bedrooms: number;
  avgNightlyRate: number;
  medianRevenue: number;
  top25Revenue: number;
  top10Revenue: number;
  avgRevenue: number;
  avgOccupancy: number;
  listingCount: number;
  monthlyRevenue: { month: string; revenue: number; occupancy: number; avgRate: number }[];
  revenueDistribution: { range: string; count: number; pct: number }[];
  competitorListings: CompetitorListing[];
  amenityImpact: { amenity: string; revenueLift: number; penetration: number }[];
  bedroomBreakdown: { bedrooms: number; avgRevenue: number; avgOccupancy: number; count: number }[];
};

export type CompetitorListing = {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  nightlyRate: number;
  annualRevenue: number;
  occupancy: number;
  reviewScore: number;
  amenities: string[];
  superhost: boolean;
};

export function getMarketData(city: string, bedrooms: number = 3): MarketData {
  const profile = CITY_PROFILES[city] ?? {
    baseRevenue3BR: 65000, avgNightlyRate: 250, avgOccupancy: 67, seasonalityType: "urban" as const,
    marketTier: "medium" as const, listingCount: 4000, yoyGrowth: 5.0, state: "??",
  };
  const rng = seededRng(city + bedrooms);
  const brMult = BR_MULTIPLIERS[Math.min(Math.max(bedrooms, 1), 6)] ?? 1.0;
  const baseRev = profile.baseRevenue3BR * brMult;
  const avgNightlyRate = Math.round(profile.avgNightlyRate * brMult * (0.95 + rng() * 0.1));
  const avgRevenue = Math.round(baseRev * (0.92 + rng() * 0.08));
  const medianRevenue = Math.round(avgRevenue * 0.88);
  const top25Revenue = Math.round(avgRevenue * 1.32);
  const top10Revenue = Math.round(avgRevenue * 1.58);
  const seasonIndices = SEASONALITY_INDICES[profile.seasonalityType];

  // Monthly revenue/occupancy
  const monthlyRevenue = MONTHS.map((month, i) => {
    const idx = seasonIndices[i];
    const noise = 0.96 + rng() * 0.08;
    const monthRev = Math.round((avgRevenue / 12) * idx * noise);
    const occ = Math.min(98, Math.round(profile.avgOccupancy * idx * noise));
    const rate = Math.round(avgNightlyRate * idx * (0.97 + rng() * 0.06));
    return { month, revenue: monthRev, occupancy: occ, avgRate: rate };
  });

  // Revenue distribution buckets
  const buckets = [
    { range: "$0-20k", min: 0, max: 20000 },
    { range: "$20-40k", min: 20000, max: 40000 },
    { range: "$40-60k", min: 40000, max: 60000 },
    { range: "$60-80k", min: 60000, max: 80000 },
    { range: "$80-100k", min: 80000, max: 100000 },
    { range: "$100-120k", min: 100000, max: 120000 },
    { range: "$120k+", min: 120000, max: Infinity },
  ];
  const distWeights = [4, 10, 20, 28, 20, 12, 6];
  const totalListings = profile.listingCount;
  const revenueDistribution = buckets.map((b, i) => {
    const noise = 0.85 + rng() * 0.3;
    const count = Math.round((distWeights[i] / 100) * totalListings * noise);
    return { range: b.range, count, pct: Math.round((count / totalListings) * 100) };
  });

  // Competitor listings (20 listings)
  const amenityPool = ["Pool", "Hot Tub", "Game Room", "Fire Pit", "EV Charger", "Pet Friendly", "Gym", "Theater Room", "Kayaks", "Bikes", "Grill", "Mountain View", "Waterfront", "Smart TV", "Fast WiFi"];
  const nameAdjectives = ["Cozy", "Luxury", "Modern", "Charming", "Stunning", "Beautiful"];
  const nameNouns = ["Cabin", "Retreat", "Escape", "Haven", "Getaway", "Hideaway"];
  const competitorListings: CompetitorListing[] = Array.from({ length: 20 }, (_, i) => {
    const listBR = Math.max(1, bedrooms + Math.floor(rng() * 3) - 1);
    const listOcc = Math.min(95, Math.round(profile.avgOccupancy * (0.8 + rng() * 0.4)));
    const listRate = Math.round(avgNightlyRate * (0.7 + rng() * 0.6));
    const listRev = Math.round(listRate * 365 * (listOcc / 100));
    const numAmenities = 3 + Math.floor(rng() * 6);
    const shuffledAmenities = [...amenityPool].sort(() => rng() - 0.5).slice(0, numAmenities);
    return {
      id: `listing-${i}`,
      name: `${nameAdjectives[Math.floor(rng() * 6)]} ${nameNouns[Math.floor(rng() * 6)]}`,
      bedrooms: listBR,
      bathrooms: Math.max(1, listBR - 1 + Math.floor(rng() * 2)),
      nightlyRate: listRate,
      annualRevenue: listRev,
      occupancy: listOcc,
      reviewScore: parseFloat((4.5 + rng() * 0.5).toFixed(2)),
      amenities: shuffledAmenities,
      superhost: rng() > 0.6,
    };
  });

  // Amenity impact data
  const amenityImpacts = [
    { amenity: "Pool", revenueLift: 18, penetration: 22 },
    { amenity: "Hot Tub", revenueLift: 11, penetration: 35 },
    { amenity: "Game Room", revenueLift: 7, penetration: 18 },
    { amenity: "Pet Friendly", revenueLift: 6, penetration: 41 },
    { amenity: "Fire Pit", revenueLift: 5, penetration: 48 },
    { amenity: "EV Charger", revenueLift: 4, penetration: 12 },
    { amenity: "Theater Room", revenueLift: 9, penetration: 8 },
    { amenity: "Waterfront", revenueLift: 24, penetration: 15 },
  ].map(a => ({ ...a, revenueLift: Math.round(a.revenueLift * (0.9 + rng() * 0.2)) }));

  // Bedroom breakdown
  const brWeights = [0.12, 0.22, 0.28, 0.20, 0.12, 0.06];
  const bedroomBreakdown = [1, 2, 3, 4, 5, 6].map(br => {
    const mult = BR_MULTIPLIERS[br] ?? 1;
    return {
      bedrooms: br,
      avgRevenue: Math.round(profile.baseRevenue3BR * mult * (0.95 + rng() * 0.1)),
      avgOccupancy: Math.min(95, Math.round(profile.avgOccupancy * (0.9 + rng() * 0.2))),
      count: Math.round(profile.listingCount * brWeights[br - 1] * (0.9 + rng() * 0.2)),
    };
  });

  return {
    city, profile, bedrooms, avgNightlyRate, medianRevenue, top25Revenue, top10Revenue,
    avgRevenue, avgOccupancy: profile.avgOccupancy, listingCount: profile.listingCount,
    monthlyRevenue, revenueDistribution, competitorListings, amenityImpact: amenityImpacts, bedroomBreakdown,
  };
}

export type RevenuePrediction = {
  predicted: number;
  low: number;
  high: number;
  confidence: number;
  featureImportance: { feature: string; importance: number; value: string }[];
  modelComparison: { model: string; prediction: number; rmse: number }[];
};

export function predictRevenue(inputs: {
  bedrooms: number;
  bathrooms: number;
  city: string;
  nightly_rate: number;
  review_score: number;
  has_pool: boolean;
  has_hot_tub: boolean;
  has_game_room: boolean;
  pet_friendly: boolean;
  sqft: number;
}): RevenuePrediction {
  const profile = CITY_PROFILES[inputs.city] ?? { baseRevenue3BR: 65000, avgNightlyRate: 250, avgOccupancy: 67, seasonalityType: "urban" as const, marketTier: "medium" as const, listingCount: 4000, yoyGrowth: 5.0, state: "??" };
  const brMult = BR_MULTIPLIERS[Math.min(Math.max(inputs.bedrooms, 1), 6)] ?? 1.0;
  let base = profile.baseRevenue3BR * brMult;

  // Adjustments
  if (inputs.nightly_rate > 0) {
    const rateAdj = inputs.nightly_rate / (profile.avgNightlyRate ?? 250);
    base *= (0.4 + rateAdj * 0.6);
  }
  if (inputs.review_score >= 4.8) base *= 1.12;
  else if (inputs.review_score >= 4.5) base *= 1.05;
  else if (inputs.review_score < 4.0) base *= 0.88;
  if (inputs.has_pool) base *= 1.18;
  if (inputs.has_hot_tub) base *= 1.11;
  if (inputs.has_game_room) base *= 1.07;
  if (inputs.pet_friendly) base *= 1.06;
  if (inputs.sqft > 3000) base *= 1.08;
  else if (inputs.sqft < 1000) base *= 0.92;
  if (inputs.bathrooms >= inputs.bedrooms) base *= 1.04;

  const predicted = Math.round(base);
  const confidence = 0.78 + Math.min(0.15, inputs.review_score > 0 ? 0.05 : 0);

  const featureImportance = [
    { feature: "Location", importance: 32, value: inputs.city || "Unknown" },
    { feature: "Bedrooms", importance: 24, value: `${inputs.bedrooms} BR` },
    { feature: "Nightly Rate", importance: 18, value: inputs.nightly_rate > 0 ? `$${inputs.nightly_rate}` : "N/A" },
    { feature: "Review Score", importance: 12, value: inputs.review_score > 0 ? `${inputs.review_score}\u2605` : "N/A" },
    { feature: "Pool", importance: inputs.has_pool ? 8 : 3, value: inputs.has_pool ? "Yes \u2713" : "No" },
    { feature: "Hot Tub", importance: inputs.has_hot_tub ? 6 : 1, value: inputs.has_hot_tub ? "Yes \u2713" : "No" },
  ];

  const modelComparison = [
    { model: "Linear Regression", prediction: Math.round(predicted * 0.94), rmse: 8200 },
    { model: "Random Forest", prediction: Math.round(predicted * 1.02), rmse: 6100 },
    { model: "Gradient Boosting", prediction: predicted, rmse: 5400 },
  ];

  return {
    predicted,
    low: Math.round(predicted * 0.82),
    high: Math.round(predicted * 1.18),
    confidence,
    featureImportance,
    modelComparison,
  };
}

// Deal finder mock listings
export type DealFinderListing = {
  id: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  estimatedRevenue: number;
  mart: number;
  cashFlow: number;
  roi: number;
  score: number;
  isGoodDeal: boolean;
  daysOnMarket: number;
};

export function getDealFinderListings(city: string, minPrice: number, maxPrice: number, minBedrooms: number, minROI: number): DealFinderListing[] {
  const rng = seededRng(city + minPrice + maxPrice);
  const profile = CITY_PROFILES[city] ?? { baseRevenue3BR: 65000, avgOccupancy: 67, state: "??", avgNightlyRate: 250, seasonalityType: "urban" as const, marketTier: "medium" as const, listingCount: 4000, yoyGrowth: 5.0 };
  const streets = ["Maple St", "Oak Ave", "Pine Rd", "Cedar Ln", "Birch Blvd", "Elm Dr", "Walnut Way", "Spruce Ct", "Hickory Pl", "Willow Ln", "Summit Dr", "Valley Rd"];
  const propTypes = ["Single Family", "Cabin", "Condo", "Townhouse", "Single Family", "Cabin"];
  const listings: DealFinderListing[] = [];
  for (let i = 0; i < 12; i++) {
    const price = Math.round((minPrice + rng() * (maxPrice - minPrice)) / 5000) * 5000;
    const br = Math.max(minBedrooms, minBedrooms + Math.floor(rng() * 3));
    const brMult = BR_MULTIPLIERS[Math.min(br, 6)] ?? 1;
    const estRevenue = Math.round(profile.baseRevenue3BR * brMult * (0.85 + rng() * 0.3));
    const mart = price / 7.5;
    const cashFlow = estRevenue - mart;
    const downPayment = price * 0.2;
    const closingCosts = price * 0.03;
    const totalCashIn = downPayment + closingCosts + 25000 + 5000;
    const depBasis = price * 0.8;
    const dep = depBasis * 0.3;
    const taxSavings = dep * 0.32;
    const roi = ((taxSavings + cashFlow) / totalCashIn) * 100;
    let score = 0;
    if (cashFlow > 0) score += 20;
    if (roi >= 25) score += 30;
    score += Math.min(50, Math.max(0, roi));
    score = Math.min(100, Math.round(score));
    listings.push({
      id: `deal-${i}`,
      address: `${100 + Math.floor(rng() * 8900)} ${streets[Math.floor(rng() * streets.length)]}`,
      city,
      price,
      bedrooms: br,
      bathrooms: Math.max(1, br - 1 + Math.floor(rng() * 2)),
      sqft: Math.round(800 + br * 350 + rng() * 600),
      propertyType: propTypes[Math.floor(rng() * propTypes.length)],
      estimatedRevenue: estRevenue,
      mart: Math.round(mart),
      cashFlow: Math.round(cashFlow),
      roi: parseFloat(roi.toFixed(1)),
      score,
      isGoodDeal: cashFlow > 0 && roi >= minROI,
      daysOnMarket: Math.floor(rng() * 90) + 1,
    });
  }
  return listings.sort((a, b) => b.score - a.score);
}
