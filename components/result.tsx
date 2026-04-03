'use client'
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { exportToExcel } from "@/excelfilelogic";
import {
  Download, ShieldX, ShieldAlert, ShieldCheck,
  Leaf, Heart, ChevronDown, ChevronUp,
  AlertTriangle,  Search, SlidersHorizontal, X, 
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const CC = {
  green:  { dot: "#22c55e", bg: "#f0fdf4", border: "#16a34a", label: "Safe",     text: "#15803d" },
  yellow: { dot: "#eab308", bg: "#fefce8", border: "#ca8a04", label: "Moderate", text: "#a16207" },
  red:    { dot: "#ef4444", bg: "#fff1f2", border: "#dc2626", label: "Caution",  text: "#b91c1c" },
} as const;

const CARD_SHADOW = "4px 4px 0px #111";
const CARD_BORDER = "2.5px solid #111";
const CARD_RADIUS = "14px";

 const messages = [
    "Loading analysis…",
    "Checking ingredients with AI…",
    "Analysing health effects…",
    "Cross-referencing EU regulations…",
    "Almost done…",
  ]; 
  
function SafetyDrop({ cc }: { cc: string }) {
  const color = (CC as any)[cc]?.dot ?? "#94a3b8";
  return (
    <svg width="30" height="38" viewBox="-2 -2 24 34" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0">
      <path
        d="M10 0.5C10 0.5 0.5 10.5 0.5 16.5a9.5 9.5 0 0 0 19 0C19.5 10.5 10 0.5 10 0.5Z"
        fill={color} stroke="#111" strokeWidth="2" strokeLinejoin="round"
      />
    </svg>
  );
}

type BadgeVariant = "banned" | "restricted" | "approved";
const BADGE_CFG: Record<BadgeVariant, { bg: string; label: string; Icon: any }> = {
  banned:     { bg: "#dc2626", label: "EU Banned",     Icon: ShieldX },
  restricted: { bg: "#d97706", label: "EU Restricted", Icon: ShieldAlert },
  approved:   { bg: "#2563eb", label: "EU Approved",   Icon: ShieldCheck },
};

function Pill({ variant }: { variant: BadgeVariant }) {
  const { bg, label, Icon } = BADGE_CFG[variant];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5  text-[15px] font-bold rounded text-white"
      style={{ background: bg, border: "1.5px solid #111" }}
    >
      <Icon size={15} strokeWidth={3} />
      {label}
    </span>
  );
}

function FuncTag({ label }: { label: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold text-slate-500 capitalize"
      style={{ border: "1.5px solid #cbd5e1", background: "#f8fafc" }}
    >
      {label}
    </span>
  );
}

function IngredientCard({ item }: { item: any }) {
  const [banOpen, setBanOpen] = useState(false);
  const styles = (CC as any)[item.cc] ?? CC.yellow;
  const hasBanReason = !!item.ban_r;
  const hasFunctions = Array.isArray(item.ingr?.fun) && item.ingr.fun.length > 0;
  const hasEuBadge = item.ban || item.res || item.eu_app;

  return (
    <div
      className="w-full md:w-[70%] mb-4 transition-all"
      style={{
        border: "1px solid",
        borderRadius: CARD_RADIUS,
        borderColor:"#000000",
        
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3"
        style={{ borderBottom: "2px solid #f1f5f9" }}>

        <div className="flex items-start gap-3 min-w-0 flex-1">
          <SafetyDrop cc={item.cc} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-extrabold text-[15px] text-gray-900 capitalize leading-tight tracking-tight">
                {item.input}
              </span>
              {item.ingr?.n && item.ingr.n.toLowerCase() !== item.input && (
                <span className="text-[11px] text-gray-400 font-medium">{item.ingr.n}</span>
              )}
            </div>

            {hasFunctions ? (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {item.ingr.fun.map((f: string) => <FuncTag key={f} label={f} />)}
              </div>
            ) : (
              null
            )}
          </div>
        </div>

        {hasEuBadge && (
          <div className="flex flex-col items-end gap-1 flex-shrink-0 pt-0.5">
            {item.ban      && <Pill variant="banned" />}
            {item.res && !item.ban && <Pill variant="restricted" />}
            {item.eu_app   && <Pill variant="approved" />}
          </div>
        )}
      </div>

      {item.exp && (
        <div className="px-4 py-3 flex gap-2 items-start" style={{ borderBottom: "2px solid #f1f5f9" }}>
          <p className="text-sm text-gray-600 leading-relaxed">{item.exp}</p>
        </div>
      )}

      <div className="grid grid-cols-2 divide-x divide-slate-100"
        style={{ borderBottom: hasBanReason ? "2px solid #f9f1f1" : "none" }}>
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Heart size={18} style={{ color: styles.dot }} className="flex-shrink-0" />
          <span className="text-xs text-gray-600 leading-snug">{item.h_e || "—"}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Leaf size={18} className="text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-gray-600 capitalize">{item.env || "—"}</span>
        </div>
      </div>

      {hasBanReason && (
        <div style={{ background: "#fff5f5" }}>
          <button
            onClick={() => setBanOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-red-700 font-bold text-[11px] bg-red-50 hover:bg-red-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ShieldX size={15} strokeWidth={2.5} />
              Why was this banned by the EU?
            </span>
            {banOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {banOpen && (
            <div className="px-4 pb-3">
              <p className="text-xs text-red-800 leading-relaxed bg-red-50 rounded-lg px-3 py-2"
                style={{ border: "1.5px solid #fca5a5" }}>
                {item.ban_r}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchFilterComponent({ onChange }: { onChange: (f: { search: string; filter1: string; filter2: string }) => void }) {
  const [search, setSearch] = useState("");
  const [filter1, setFilter1] = useState("All");
  const [filter2, setFilter2] = useState("All");

  useEffect(() => {
    const t = setTimeout(() => onChange({ search, filter1, filter2 }), 400);
    return () => clearTimeout(t);
  }, [search, filter1, filter2, onChange]);

  const clear = () => { setSearch(""); setFilter1("All"); setFilter2("All"); onChange({ search: "", filter1: "All", filter2: "All" }); };
  const active = filter1 !== "All" || filter2 !== "All" || search !== "";

  return (
    <div className="flex justify-center mb-2">
      <div
        className="w-full md:w-[70%] p-4"
        style={{ border: CARD_BORDER,  background: "#fff" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 mb-3 rounded-full"
          style={{ border: "2px solid #111", background: "#f8fafc" }}
        >
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search ingredient…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal size={15} className="text-gray-400" />

          <Select value={filter1} onValueChange={setFilter1}>
            <SelectTrigger className="w-[145px] rounded-full border-2 border-black font-semibold text-sm h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-black shadow-[3px_3px_0px_#111] rounded-xl">
              <SelectItem value="All">All Safety</SelectItem>
              <SelectItem value="green">Safe</SelectItem>
              <SelectItem value="yellow">Moderate</SelectItem>
              <SelectItem value="red">Caution</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter2} onValueChange={setFilter2}>
            <SelectTrigger className="w-[165px] rounded-full border-2 border-black font-semibold text-sm h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-black shadow-[3px_3px_0px_#111] rounded-xl">
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="EUbanned">EU Banned</SelectItem>
              <SelectItem value="EURestricted">EU Restricted</SelectItem>
              <SelectItem value="EUApproved">EU Approved</SelectItem>
            </SelectContent>
          </Select>

          {active && (
            <button
              onClick={clear}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white transition"
              style={{ background: "#ef4444", border: "2px solid #111" }}
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertBox({ bannedList = [] }: { bannedList: string[] }) {
  if (!bannedList.length) return null;
  return (
    <div className="flex justify-center my-5">
      <div
        className="w-full md:w-[70%] p-4"
        style={{  background: "#fff5f5" }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={20} strokeWidth={2.5} />
            <span className="font-extrabold text-red-800 text-sm md:text-base tracking-tight">
              {bannedList.length} EU-banned ingredient{bannedList.length > 1 ? "s" : ""} detected
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {bannedList.map(c => (
              <span
                key={c}
                className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold text-white capitalize"
                style={{ background: "#dc2626", border: "2px solid #111" }}
              >
                {c}
              </span>
            ))}
          </div>
          <p className="text-xs text-red-700 max-w-xl leading-relaxed">
            These ingredients are prohibited in the EU. Tap each card below to see why it was banned and review safer alternatives.
          </p>
        </div>
      </div>
    </div>
  );
}

const PIE_COLORS = ["#22c55e", "#eab308", "#ef4444"];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white px-3 py-2 text-sm font-bold"
      style={{ border: "2px solid #111", borderRadius: "8px", boxShadow: "3px 3px 0 #111" }}
    >
      {payload[0].name}: {payload[0].value}
    </div>
  );
}

function IngredientSafetyChart({ counts }: { counts: { Good: number; Moderate: number; Bad: number } }) {
  const data = [
    { name: "Safe",     value: counts.Good },
    { name: "Moderate", value: counts.Moderate },
    { name: "Caution",  value: counts.Bad },
  ];
  const total = counts.Good + counts.Moderate + counts.Bad;

  const renderLegend = () => (
    <div className="flex justify-center gap-5 mt-2 flex-wrap">
      {data.map((entry, i) => (
        <div key={entry.name} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i], border: "1.5px solid #111" }} />
          <span className="text-xs font-semibold text-gray-700">{entry.name} ({entry.value})</span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="w-full md:w-[70%] mb-5"
      style={{ border: CARD_BORDER, borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW, background: "#fff" }}
    >
      <div className="px-6 pt-5 pb-1 text-center">
        <h4 className="text-lg font-extrabold text-gray-900 tracking-tight">Safety Overview</h4>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">{total} ingredient{total !== 1 ? "s" : ""} analysed</p>
      </div>
      <div className="h-72 px-4 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data} dataKey="value" nameKey="name"
              cx="50%" cy="50%" innerRadius={55} outerRadius={95}
              paddingAngle={4} strokeWidth={2.5} stroke="#111"
            >
              {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function Result() {
  const [resultData, setResultData] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState({ search: "", filter1: "All", filter2: "All" });
  const [error, setError]           = useState<string | null>(null);
  const [timeoutExceeded, setTimeoutExceeded] = useState(false);
  const [msgIndex, setMsgIndex]     = useState(0);

 

  const handleFilterChange = useCallback(
    (f: { search: string; filter1: string; filter2: string }) => setFilters(f),
    []
  );

  useEffect(() => {
    const fetchResult = async () => {
      setError(null);
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You must be signed in to analyse ingredients. Please sign in first.");
        setLoading(false);
        return;
      }

      const storedInputs = localStorage.getItem("analyzeInputs");
      const inputs = storedInputs ? JSON.parse(storedInputs) : null;
      if (!inputs) { setLoading(false); return; }

      const cachedResults = localStorage.getItem("analyzeResults");
      if (cachedResults) {
        const parsedCache = JSON.parse(cachedResults);
        if (JSON.stringify(parsedCache.inputs) === JSON.stringify(inputs)) {
          setResultData(parsedCache.results);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await axios.post(
          `${API_BASE}/check-ingredients`,
          { ingredients: inputs },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const results = res.data.AI || [];
        setResultData(results);
        localStorage.setItem("analyzeResults", JSON.stringify({ inputs, results }));
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("auth_token");
          setError("Your session has expired. Please sign in again.");
        } else {
          setError(err.response?.data?.error || "Failed to fetch results. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, []);

  useEffect(() => {
    if (!loading || timeoutExceeded) return;
    const interval = setInterval(() => {
      setMsgIndex(p => (p < messages.length - 1 ? p + 1 : p));
    }, 2500);
    const timeout = setTimeout(() => {
      setTimeoutExceeded(true);
      setLoading(false);
      setError("Processing is taking too long. Please try again with fewer ingredients.");
    }, 2 * 60 * 1000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [loading, timeoutExceeded]);

  const { preFilteredData, counts, bannedList, unmatchedString } = useMemo(() => {
    const counts = { Good: 0, Moderate: 0, Bad: 0 };
    const bannedList: string[] = [];
    let unmatchedString = "";

   const preFilteredData = resultData.filter((item: any) => {
  if (item.match === "un" || item.match === "stopword") {
    unmatchedString += (unmatchedString ? ", " : "") + item.input;
    return false;
  }
  // Keep item as long as it has SOME data — ingr OR ban OR res
  if (!item.ingr && !item.ban && !item.res) return false;
  if (item.cc === "green")       counts.Good++;
  else if (item.cc === "yellow") counts.Moderate++;
  else if (item.cc === "red")    counts.Bad++;
  if (item.ban) bannedList.push(item.input);
  return true;
});

    return { preFilteredData, counts, bannedList, unmatchedString };
  }, [resultData]);

  const filteredResults = useMemo(() => {
    return preFilteredData.filter((item: any) => {
      let match = true;
      if (filters.filter1 !== "All")          match = match && item.cc === filters.filter1;
      if (filters.filter2 === "EUbanned")     match = match && !!item.ban;
      else if (filters.filter2 === "EURestricted") match = match && !!item.res;
      else if (filters.filter2 === "EUApproved")   match = match && item.eu_app === true;
      if (filters.search.trim())
        match = match && item.input.toLowerCase().includes(filters.search.toLowerCase());
      return match;
    });
  }, [preFilteredData, filters]);

  if (loading && !error && !timeoutExceeded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <div
          className="w-14 h-14 rounded-full border-4 animate-spin"
          style={{ borderColor: "#22c55e", borderTopColor: "transparent" }}
        />
        <p className="text-base font-bold text-gray-700 animate-pulse">{messages[msgIndex]}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div
          className="max-w-md w-full p-6 text-center"
          style={{ border: CARD_BORDER, borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW, background: "#fff" }}
        >
          <AlertTriangle className="mx-auto text-red-500 mb-3" size={36} />
          <h2 className="font-extrabold text-lg text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-5">{error}</p>
          {error.includes("sign in") ? (
            <button
              onClick={() => (window.location.href = "/sign-in")}
              className="px-5 py-2 rounded-full font-bold text-sm text-white"
              style={{ background: "#16a34a", border: "2px solid #111", boxShadow: "3px 3px 0 #111" }}
            >
              Go to Sign In
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-full font-bold text-sm text-white"
              style={{ background: "#ef4444", border: "2px solid #111", boxShadow: "3px 3px 0 #111" }}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-center pt-6 pb-2 px-4">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Ingredients Summary
        </h1>
      </div>

      <div className="px-3 md:px-8 md:mx-4 mt-2">
        <SearchFilterComponent onChange={handleFilterChange} />

        <AlertBox bannedList={bannedList} />

        {counts.Good + counts.Moderate + counts.Bad > 0 && (
          <div className="flex justify-center">
            <IngredientSafetyChart counts={counts} />
          </div>
        )}

        <div className="flex flex-col items-center">
          {filteredResults.map((item: any, idx: number) => (
            <IngredientCard key={idx} item={item} />
          ))}
          {filteredResults.length === 0 && (
            <p className="text-sm text-gray-400 font-medium my-10">
              No ingredients match the current filters.
            </p>
          )}
        </div>

        {unmatchedString && (
          <div className="flex justify-center my-6">
            <div
              className="w-full md:w-[70%] p-4"
              style={{ border: "2.5px solid #94a3b8", borderRadius: CARD_RADIUS, boxShadow: "4px 4px 0 #94a3b8", background: "#f8fafc" }}
            >
              <h3 className="text-sm font-extrabold text-slate-600 mb-2 text-center">
                Ingredients we couldn't find data for
              </h3>
              <p className="text-xs text-slate-500 text-center leading-relaxed break-words">
                {unmatchedString}
              </p>
            </div>
          </div>
        )}
      </div>

      {filteredResults.length > 0 && (
        <button
          onClick={() => {
            const data = filteredResults.map((item: any) => ({
              Ingredient:               item.input || "",
              Explanation:              item.exp || "",
              "Health Effect / Benefit": item.h_e || "",
              "Environmental Impact":   item.env || "",
              "EU Banned":              item.ban  ? "Yes" : "No",
              "EU Restricted":          item.res  ? "Yes" : "No",
              "EU Approved":            item.eu_app ? "Yes" : "No",
              "Ban Reason":             item.ban_r || "",
            }));
            exportToExcel(data, "Ingredient_Analysis_Report");
          }}
          className="fixed bottom-6 right-6 flex items-center gap-2 font-bold py-2.5 px-5 rounded-full text-sm text-white transition-transform hover:scale-105"
          style={{ background: "#16a34a", border: "2.5px solid #111", boxShadow: CARD_SHADOW }}
        >
          <Download size={16} />
          Download Excel
        </button>
      )}
    </div>
  );
}
