"use client";

import { Deal, DealInputs } from "./types";
import { calculateDeal } from "./calculations";

const STORAGE_KEY = "str_deals";

export function getDeals(): Deal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDeal(inputs: DealInputs): Deal {
  const deals = getDeals();
  const results = calculateDeal(inputs);
  const deal: Deal = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    inputs,
    results,
  };
  deals.push(deal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  return deal;
}

export function updateDeal(id: string, inputs: DealInputs): Deal {
  const deals = getDeals();
  const results = calculateDeal(inputs);
  const idx = deals.findIndex((d) => d.id === id);
  const deal: Deal = { id, createdAt: deals[idx]?.createdAt ?? new Date().toISOString(), inputs, results };
  if (idx >= 0) deals[idx] = deal;
  else deals.push(deal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  return deal;
}

export function deleteDeal(id: string): void {
  const deals = getDeals().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
}

export function getDealById(id: string): Deal | undefined {
  return getDeals().find((d) => d.id === id);
}
