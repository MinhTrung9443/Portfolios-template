
import { parseStringList, parseNumberList, asString } from '../../parseBlockData.js';
import { themedBarBg } from '../shared/utils.js';

export function BarChartWrapped({ data, accentClassName }) {
  const title = asString(data.title);
  const labels = parseStringList(data.labels);
  const vals = parseNumberList(data.values);
  const arr = vals.length ? [...vals] : [];
  while (labels.length > 0 && arr.length < labels.length) arr.push(45 + Math.random() * 35);
  let L = labels.length ? labels.slice(0, 8) : [];
  if (!L.length) {
    while (arr.length < 5) arr.push(30 + Math.random() * 50);
    L = ["Q1", "Q2", "Q3", "Q4", "Q5"].slice(0, arr.length);
  } else if (arr.length === 0) {
    L.forEach(() => arr.push(35 + Math.random() * 45));
  }
  const max = Math.max(...arr, 1);
  return (
    <div className="mt-6 space-y-4">
      {title ? <p className="text-lg font-semibold text-white/95">{title}</p> : null}
      <div className="flex items-end justify-between gap-2 rounded-xl border border-white/[0.08] bg-black/35 px-3 pb-6 pt-8 sm:gap-3 sm:px-5">
        {L.slice(0, 8).map((label, i) => (
          <div key={label + String(i)} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full max-w-[3.25rem] items-end justify-center rounded-md bg-white/[0.04] px-1 sm:h-40">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${(100 * (arr[i] ?? arr[Math.min(i, arr.length - 1)] ?? 0) / max).toFixed(1)}%`,
                  backgroundImage: themedBarBg(accentClassName),
                  minHeight: "12%",
                  boxShadow: "0 -8px 24px -4px rgba(255,255,255,0.08)",
                }}
              />
            </div>
            <span className="truncate text-center font-mono text-[10px] text-white/50">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChartLive({ data, accentClassName }) {
  const title = asString(data.title);
  const labels = parseStringList(data.labels);
  let series = parseNumberList(data.series);
  if (!series.length) series = labels.length ? labels.map(() => 30 + Math.random() * 50) : [45, 62, 38, 70, 55, 80];
  const w = 360;
  const h = 120;
  const pad = 12;
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const points = series.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(series.length - 1, 1);
    const y = h - pad - ((v - min) / (max - min + 0.0001)) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const stroke =
    accentClassName?.includes("emerald") ? "#34d399" : accentClassName?.includes("fuchsia") ? "#e879f9" : accentClassName?.includes("sky") ? "#38bdf8" : "#22d3ee";

  return (
    <div className="mt-6 space-y-4">
      {title ? <p className="text-lg font-semibold text-white/95">{title}</p> : null}
      <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/35 p-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full min-w-[280px]" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="lineGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M${points[0]} ${points.slice(1).map((pt) => `L ${pt}`).join(" ")}`} stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
          <path
            d={`M${points[0]} ${points.slice(1).map((pt) => `L ${pt}`).join(" ")} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`}
            fill="url(#lineGlow)"
          />
          {series.map((_v, i) => {
            const [xStr, yStr] = points[i].split(",");
            const x = Number.parseFloat(xStr);
            const y = Number.parseFloat(yStr);
            return <circle key={i} cx={x} cy={y} r="5" fill="#0f172acc" stroke={stroke} strokeWidth="2" />;
          })}
        </svg>
        {labels.length > 0 && (
          <div className="mt-3 flex justify-between gap-2 font-mono text-[10px] text-white/45">
            {labels.slice(0, series.length).map((lbl, i) => (
              <span key={i} className="min-w-0 flex-1 truncate text-center">
                {lbl}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function DonutLive({ data, accentClassName }) {
  const title = asString(data.title);
  let segs = [];
  const raw = asString(data.segments);
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) segs = parsed.map((x) => ({ label: String(x.label ?? x.name ?? ""), value: Number(x.value) || 0 }));
    } catch {
      /* */
    }
  }
  if (!segs.length) {
    parseStringList(raw).forEach((label, i) => segs.push({ label, value: 20 + (i % 5) * 12 }));
    if (!segs.length) segs = [{ label: "Ship", value: 40 }, { label: "Growth", value: 35 }, { label: "Rest", value: 25 }];
  }
  const total = segs.reduce((a, b) => a + b.value, 0) || 1;
  const colors =
    accentClassName?.includes("emerald") ? ["#34d399", "#059669", "#6ee7b7"] :
    accentClassName?.includes("fuchsia") ? ["#e879f9", "#a855f7", "#fdba74"] :
    accentClassName?.includes("sky") ? ["#38bdf8", "#6366f1", "#93c5fd"] :
    ["#22d3ee", "#818cf8", "#f472b6"];
  let angle = 0;
  const stops = segs
    .map((seg, i) => {
      const span = (seg.value / total) * 360;
      const start = angle;
      angle += span;
      return `${colors[i % colors.length]} ${start.toFixed(2)}deg ${angle.toFixed(2)}deg`;
    })
    .join(",");

  return (
    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto h-[9.5rem] w-[9.5rem] shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:mx-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundImage: `conic-gradient(${stops})` }}
        />
        <div className="absolute inset-[26%] flex items-center justify-center rounded-full border border-white/15 bg-[#09090f]/98 shadow-inner backdrop-blur-sm">
          <div className="flex flex-col items-center leading-none">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">whole</p>
            <p className="mt-2 text-xl font-black tracking-tighter text-white/95">{segs.length}</p>
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {title ? <p className="text-lg font-semibold text-white/95">{title}</p> : null}
        <ul className="space-y-2">
          {segs.map((s, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2">
              <span className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                <span>{s.label || `Part ${i + 1}`}</span>
              </span>
              <span className="font-mono text-xs text-white/55">{Math.round((s.value / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function StatsLive({ data, accentClassName }) {
  const raw = data.metrics ?? data.stats;
  let items = [];
  if (typeof raw === "string" && raw.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(raw.trim());
      if (Array.isArray(parsed)) items = parsed.map((x) => ({ label: String(x.label ?? x.title ?? ""), value: String(x.value ?? x.text ?? "") }));
    } catch {
      /**/
    }
  }
  if (!items.length && typeof raw === "string") items = [{ label: "", value: raw }];
  if (!items.length) items = [{ label: "Stacks", value: "12+" }, { label: "Uptime focus", value: "High" }];
  const borderAccent =
    accentClassName?.includes("emerald") ? "border-emerald-500/20 shadow-emerald-500/15" :
    accentClassName?.includes("fuchsia") ? "border-fuchsia-500/25 shadow-fuchsia-500/15" :
    accentClassName?.includes("sky") ? "border-sky-500/25 shadow-sky-500/15" :
    "border-cyan-400/25 shadow-cyan-500/15";

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.slice(0, 6).map((it, i) => (
        <div
          key={i}
          className={`rounded-2xl border bg-gradient-to-br from-white/[0.07] to-transparent px-5 py-4 shadow-lg ${borderAccent}`}
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">{it.label || `Metric ${i + 1}`}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">{it.value}</p>
        </div>
      ))}
    </div>
  );
}
