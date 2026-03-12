"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, TrendingUp, AlertCircle } from "lucide-react";
import { predictRevenue, CITY_PROFILES } from "@/lib/mockData";
import { formatCurrency } from "@/lib/calculations";

type Prediction = ReturnType<typeof predictRevenue>;

const CITY_LIST = Object.keys(CITY_PROFILES);

export default function PredictPage() {
  const [city, setCity] = useState("Gatlinburg, TN");
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [nightlyRate, setNightlyRate] = useState(285);
  const [sqft, setSqft] = useState(1800);
  const [reviewScore, setReviewScore] = useState(4.7);
  const [hasPool, setHasPool] = useState(false);
  const [hasHotTub, setHasHotTub] = useState(false);
  const [hasGameRoom, setHasGameRoom] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);

  function predict() {
    setResult(predictRevenue({
      bedrooms,
      bathrooms,
      city,
      nightly_rate: nightlyRate,
      review_score: reviewScore,
      has_pool: hasPool,
      has_hot_tub: hasHotTub,
      has_game_room: hasGameRoom,
      pet_friendly: petFriendly,
      sqft,
    }));
  }

  const confidencePct = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="p-4 md:p-8" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Revenue Predictor</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>ML-powered annual revenue prediction based on property attributes</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Input Form */}
        <div className="w-full md:w-[480px] flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4" style={{ border: "1px solid #E2E8F0" }}>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4" style={{ color: "#2563EB" }} />
              <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>Property Inputs</h2>
            </div>

            <div>
              <label className="field-label">City</label>
              <input
                list="predict-city-list"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input"
                placeholder="Select or type a city"
              />
              <datalist id="predict-city-list">
                {CITY_LIST.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Bedrooms</label>
                <select value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="input">
                  {[1, 2, 3, 4, 5, 6].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Bathrooms</label>
                <select value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className="input">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Nightly Rate ($)</label>
                <div className="input-prefix">
                  <span>$</span>
                  <input type="number" value={nightlyRate} onChange={(e) => setNightlyRate(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div>
                <label className="field-label">Square Footage</label>
                <div className="input-suffix">
                  <input type="number" value={sqft} onChange={(e) => setSqft(parseFloat(e.target.value) || 0)} />
                  <span>sqft</span>
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Review Score (0–5)</label>
              <div className="input-suffix w-40">
                <input type="number" value={reviewScore} onChange={(e) => setReviewScore(parseFloat(e.target.value) || 0)} step="0.1" min="0" max="5" />
                <span>★</span>
              </div>
            </div>

            <div>
              <label className="field-label">Amenities</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { label: "Pool", value: hasPool, set: setHasPool },
                  { label: "Hot Tub", value: hasHotTub, set: setHasHotTub },
                  { label: "Game Room", value: hasGameRoom, set: setHasGameRoom },
                  { label: "Pet Friendly", value: petFriendly, set: setPetFriendly },
                ].map(({ label, value, set }) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => set(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: "#2563EB", cursor: "pointer" }}
                    />
                    <span className="text-sm" style={{ color: "#0F172A" }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={predict}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-white text-sm font-medium rounded-lg"
              style={{ background: "#2563EB" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
            >
              <Brain className="w-4 h-4" />
              Predict Revenue
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 space-y-5">
          {!result ? (
            <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm text-center" style={{ border: "1px solid #E2E8F0" }}>
              <Brain className="w-14 h-14 mb-3" style={{ color: "#E2E8F0" }} />
              <p className="font-semibold" style={{ color: "#0F172A" }}>Ready to Predict</p>
              <p className="text-sm mt-1 max-w-xs" style={{ color: "#64748B" }}>
                Fill in property details and click "Predict Revenue" to run the ML model.
              </p>
            </div>
          ) : (
            <>
              {/* Prediction Card */}
              <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0", borderTop: "3px solid #2563EB" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#64748B" }}>Predicted Annual Revenue</p>
                <p className="text-5xl font-bold mb-4" style={{ color: "#0F172A" }}>{formatCurrency(result.predicted)}</p>

                {/* Confidence range */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: "#64748B" }}>
                    <span>{formatCurrency(result.low)}</span>
                    <span className="font-semibold" style={{ color: "#2563EB" }}>{formatCurrency(result.predicted)}</span>
                    <span>{formatCurrency(result.high)}</span>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                    <div
                      className="absolute h-full rounded-full"
                      style={{ left: "0%", right: "0%", background: "linear-gradient(90deg, #BFDBFE, #2563EB, #BFDBFE)" }}
                    />
                    <div
                      className="absolute top-0 w-1 h-full rounded-full"
                      style={{ left: "50%", background: "#1D4ED8", transform: "translateX(-50%)" }}
                    />
                  </div>
                  <p className="text-xs mt-1 text-center" style={{ color: "#64748B" }}>Revenue range: {formatCurrency(result.low)} – {formatCurrency(result.high)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: "#22C55E" }} />
                  <span className="text-sm font-semibold" style={{ color: "#22C55E" }}>{confidencePct}% confidence</span>
                  <span className="text-xs" style={{ color: "#64748B" }}>based on {city} comparable listings</span>
                </div>
              </div>

              {/* Model Comparison */}
              <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: "#0F172A" }}>Model Comparison</h3>
                <div className="space-y-3">
                  {result.modelComparison.map((m) => {
                    const pct = Math.round((m.prediction / result.high) * 100);
                    const isTop = m.rmse === Math.min(...result.modelComparison.map(x => x.rmse));
                    return (
                      <div key={m.model}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm" style={{ color: "#0F172A" }}>{m.model}</span>
                            {isTop && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#DCFCE7", color: "#15803D" }}>Best</span>}
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>{formatCurrency(m.prediction)}</span>
                            <span className="text-xs ml-2" style={{ color: "#64748B" }}>RMSE ${m.rmse.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: isTop ? "#2563EB" : "#93C5FD" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feature Importance */}
              <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: "1px solid #E2E8F0" }}>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "#0F172A" }}>Revenue Driver Analysis</h3>
                <p className="text-xs mb-4" style={{ color: "#64748B" }}>Feature importance from Gradient Boosting model</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[...result.featureImportance].sort((a, b) => b.importance - a.importance)}
                    layout="vertical"
                    margin={{ top: 0, right: 60, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} domain={[0, 40]} />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = result.featureImportance.find(f => f.importance === payload[0]?.value);
                          return (
                            <div className="bg-white border rounded-lg p-3 shadow-lg text-sm" style={{ borderColor: "#E2E8F0" }}>
                              <p className="font-semibold" style={{ color: "#0F172A" }}>{payload[0]?.value}% importance</p>
                              {item && <p style={{ color: "#64748B" }}>Value: {item.value}</p>}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="importance" name="Importance" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 flex items-start gap-2 p-3 rounded-lg" style={{ background: "#EFF6FF" }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#2563EB" }} />
                  <p className="text-xs" style={{ color: "#1D4ED8" }}>
                    Location accounts for {result.featureImportance.find(f => f.feature === "Location")?.importance ?? 0}% of revenue variance. Bedroom count and nightly rate are the next most impactful factors.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
