import { MiniTemplatePreview } from "./MiniTemplatePreview.jsx";
import { parseNumberList, parseSkillEntries, parseStringList, asString } from "./parseBlockData.js";

/** Accent class for previews + svg currentColor aligned with SharedPortfolio theme preset */
export const ACCENT_BY_THEME = {
  default: "text-cyan-400",
  minimal: "text-emerald-400",
  aurora: "text-fuchsia-300",
  midnight: "text-sky-400",
};

const DOT_BY_THEME = {
  default: "bg-cyan-500 shadow-[0_0_16px_rgba(34,211,238,.55)]",
  minimal: "bg-emerald-500 shadow-[0_0_16px_rgba(52,211,153,.55)]",
  aurora: "bg-fuchsia-500 shadow-[0_0_16px_rgba(217,70,239,.55)]",
  midnight: "bg-sky-500 shadow-[0_0_16px_rgba(14,165,233,.55)]",
};

const PERSON_CARD_KEYS = [
  "fullName",
  "headline",
  "tagline",
  "title",
  "email",
  "phone",
  "address",
  "bio",
  "summary",
  "avatar",
  "photoUrl",
  "avatarUrl",
];

function HoverTemplateTitle({ meta, accentClassName, children }) {
  return (
    <span className="group/tooltip relative isolate inline-flex max-w-full">
      <span
        className={`cursor-help border-b border-dotted pb-px transition-colors border-white/35 group-hover/tooltip:border-current ${accentClassName}`}
      >
        {children}
      </span>
      <div
        role="tooltip"
        className="invisible absolute left-0 top-[calc(100%+10px)] z-[120] w-[min(284px,calc(100vw-3rem))] origin-top scale-[0.98] opacity-0 transition-all duration-200 ease-out pointer-events-none border border-white/[0.14] rounded-2xl bg-zinc-950/[0.98] p-3 shadow-[0_20px_70px_-10px_rgba(0,0,0,.9)] backdrop-blur-2xl group-hover/tooltip:pointer-events-none group-hover/tooltip:visible group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100"
      >
        <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40">Layout blueprint</p>
        <div className={accentClassName}>
          <MiniTemplatePreview meta={meta} />
        </div>
        {meta?.description ? <p className="mt-2 text-[11px] leading-snug text-slate-400">{meta.description}</p> : null}
      </div>
    </span>
  );
}

function KeyValueResidual({ entries, p }) {
  if (!entries.length) return null;
  return (
    <dl className="mt-5 grid gap-3 text-sm sm:gap-4">
      {entries.map(([k, v]) => (
        <div
          key={k}
          className="grid gap-1 rounded-xl border border-white/[0.04] bg-black/25 px-4 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-6"
        >
          <dt className={`font-mono text-[11px] uppercase tracking-wide ${p.dt}`}>{k.replace(/_/g, " ")}</dt>
          <dd className={`font-sans whitespace-pre-wrap break-words leading-relaxed ${p.dd}`}>{String(v ?? "")}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Simpler bar gradient fallback */
function themedBarBg(accentClassName) {
  if (accentClassName.includes("emerald")) return "linear-gradient(to top,#064e3b55,#34d399bb)";
  if (accentClassName.includes("fuchsia")) return "linear-gradient(to top,#4a044ebb,#e879f9aa)";
  if (accentClassName.includes("sky")) return "linear-gradient(to top,#0c4a6e55,#38bdf8bb)";
  return "linear-gradient(to top,#08334444,#22d3eebb)";
}

function BarChartWrapped({ data, accentClassName }) {
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

/** fix BarChartWrapped reference to i bug - replace while arr.length loops */
function LineChartLive({ data, accentClassName }) {
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
    accentClassName.includes("emerald") ? "#34d399" : accentClassName.includes("fuchsia") ? "#e879f9" : accentClassName.includes("sky") ? "#38bdf8" : "#22d3ee";

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

function DonutLive({ data, accentClassName }) {
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
    accentClassName.includes("emerald") ? ["#34d399", "#059669", "#6ee7b7"] :
    accentClassName.includes("fuchsia") ? ["#e879f9", "#a855f7", "#fdba74"] :
    accentClassName.includes("sky") ? ["#38bdf8", "#6366f1", "#93c5fd"] :
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

function StatsLive({ data, accentClassName }) {
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
    accentClassName.includes("emerald") ? "border-emerald-500/20 shadow-emerald-500/15" :
    accentClassName.includes("fuchsia") ? "border-fuchsia-500/25 shadow-fuchsia-500/15" :
    accentClassName.includes("sky") ? "border-sky-500/25 shadow-sky-500/15" :
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

function SkillsLive({ meta, data, accentClassName, p }) {
  const style = meta?.defaultConfig?.style || "";
  const entries = parseSkillEntries(data.skills ?? data.skillList ?? "");
  const names = entries.some((e) => asString(e.name)) ? entries : [];

  const emptySkills = (
    <p className={`mt-6 font-mono text-sm leading-relaxed ${p.monoMuted}`}>
      // Add skill data — JSON array with name / level objects, or comma-separated list (edited in Portfolio).
    </p>
  );

  if (style === "tag_cloud") {
    if (!names.length) return emptySkills;
    return (
      <div className="mt-6 flex flex-wrap gap-2">
        {names.slice(0, 20).map((e, i) => (
          <span
            key={e.name + i}
            className={`rounded-xl border px-3 py-1.5 text-sm font-medium backdrop-blur-sm border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.08] transition-colors ${accentClassName}`}
          >
            {e.name}
          </span>
        ))}
      </div>
    );
  }

  if (style === "progress_bars" || style === "cards_grid") {
    if (!names.length) return emptySkills;
    return (
      <div className={`mt-6 grid gap-3 ${style === "cards_grid" ? "sm:grid-cols-2" : ""}`}>
        {names.slice(0, 8).map((e, i) => {
          const level = typeof e.level === "number" && !Number.isNaN(e.level) ? Math.min(100, Math.max(0, e.level)) : 55 + ((i * 13) % 45);
          if (style === "cards_grid") {
            return (
              <div key={i} className="rounded-2xl border border-white/[0.08] bg-black/35 p-4">
                <p className={`font-semibold ${accentClassName}`}>{e.name}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-gradient-to-r from-white/40 to-transparent" style={{ width: `${level}%`, backgroundImage: themedBarBg(accentClassName) }} />
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-black/25 px-4 py-3">
              <div className="flex justify-between gap-2 text-sm font-medium">
                <span>{e.name}</span>
                <span className="font-mono text-xs opacity-55">{level}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full transition-all" style={{ width: `${level}%`, backgroundImage: themedBarBg(accentClassName) }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (style === "category_list") {
    const categories = [
      { title: String(data.categoryA || "Stack"), tags: parseStringList(data.stack || data.tech || "") },
      { title: String(data.categoryB || "Tools"), tags: parseStringList(data.tools || "") },
    ].filter((c) => c.tags.length > 0);
    if (!categories.length) return emptySkills;
    return (
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {categories.map((cat, ci) => (
          <div key={ci}>
            <h5 className={`mb-3 text-xs font-semibold uppercase tracking-widest opacity-65 ${accentClassName}`}>{cat.title}</h5>
            <div className="flex flex-wrap gap-2">
              {cat.tags.map((t, i) => (
                <span key={t + i} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-white/80">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* default skill chips */
  if (!names.length) return emptySkills;
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {names.slice(0, 16).map((e, i) => (
        <span key={i} className="rounded-lg border border-white/15 bg-white/[0.05] px-3 py-1 text-sm font-medium text-white/90">
          {e.name}
        </span>
      ))}
    </div>
  );
}

function TimelineExperience({ style, data, accentDotClass, p }) {
  const pairs = [
    ["company", "Company"],
    ["institution", "Institution"],
    ["position", "Role"],
    ["degree", "Degree"],
    ["year", "Year"],
    ["startDate", "Start"],
    ["endDate", "End"],
    ["gpa", "GPA"],
    ["description", "Notes"],
    ["title", "Title"],
  ];
  const rows = pairs.filter(([k]) => data[k]).map(([k, label]) => ({ label, value: data[k] }));
  if (!rows.length && style === "table") return <KeyValueResidual entries={Object.entries(data)} p={p} />;

  const role = asString(data.position || data.degree);
  const place = data.institution ?? data.company;
  const titleLine =
    place && role
      ? `${role} · ${asString(place)}`
      : asString(place || role || data.title || data.degree || "");

  return (
    <div className="relative mt-6 border-l border-white/15 pl-6 sm:pl-8">
      <div className={`absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full shadow-lg shadow-black/80 ${accentDotClass}`} aria-hidden />
      {titleLine ? <h5 className="text-lg font-bold text-white">{titleLine}</h5> : null}
      <dl className="mt-3 space-y-2 text-sm text-white/80">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <dt className={`font-mono text-[11px] uppercase tracking-wide ${p.monoMuted}`}>{r.label}</dt>
            <dd className="min-w-0 flex-1 whitespace-pre-wrap leading-relaxed">{String(r.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ProjectsHighlight({ meta, data, accentClassName }) {
  const title = asString(data.name ?? data.projectName ?? data.title);
  const desc = asString(data.description ?? "");
  const img = asString(data.image ?? data.thumbnail ?? data.imageUrl ?? data.screenshot ?? "");
  const style = meta?.defaultConfig?.style || "";
  const isList = style === "list";

  return (
    <div className={`mt-6 rounded-2xl border border-white/[0.08] bg-black/35 ${isList ? "p-4" : ""}`}>
      <div className={isList ? "" : "grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,10rem)] sm:gap-8"}>
        {!isList && img ? (
          <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:aspect-square sm:h-full">
            <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        ) : null}
        <div className="min-w-0 p-4 sm:p-5">
          <h5 className={`text-xl font-bold tracking-tight text-white ${isList ? "text-lg" : ""}`}>{title || "Project"}</h5>
          {desc ? <p className={`mt-3 leading-relaxed text-white/65 ${isList ? "text-sm line-clamp-4" : ""}`}>{desc}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
            {[data.linkLive, data.github, data.liveUrl].map((u, i) =>
              asString(u) ? (
                <a key={i} href={u} target="_blank" rel="noreferrer" className={`rounded-full border px-3 py-1 transition hover:bg-white/[0.08] ${accentClassName} border-current/30 bg-current/[0.08]`}>
                  Open link →
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificatesStrip({ meta, data, accentClassName }) {
  const style = meta?.defaultConfig?.style || "";
  const name = asString(data.name ?? data.title);
  const issuer = asString(data.issuer);
  const date = asString(data.date);

  const inner = (
    <>
      <p className="text-base font-semibold text-white">{name || "Credential"}</p>
      {(issuer || date) && (
        <p className={`mt-1 font-mono text-xs ${accentClassName}`}>
          {[issuer, date].filter(Boolean).join(" · ")}
        </p>
      )}
    </>
  );

  if (style === "badge") {
    return (
      <div className="mt-6 flex justify-center rounded-2xl border border-white/10 bg-black/35 p-8">
        <div className="flex aspect-square max-w-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 px-8 py-12 text-center">
          <div className={`mb-3 rounded-full border p-5 ${accentClassName} border-current/40 bg-current/10 text-4xl`}>★</div>
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/35 p-6">{inner}</div>
  );
}

function ContactStyled({ meta, data, accentClassName }) {
  const style = meta?.defaultConfig?.style || "";

  const items = [["email", data.email], ["phone", data.phone], ["linkedin", data.linkedin]].filter(([, v]) => asString(v));

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, val]) => (
          <a key={label} href={label === "email" ? `mailto:${val}` : label === "phone" ? `tel:${val}` : asString(val)} className={`group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/35 px-4 py-4 transition hover:border-current/35 ${accentClassName}`}>
            <span className={`rounded-lg border px-2 py-1 font-mono text-[10px] uppercase opacity-75 border-current/25`}>{label}</span>
            <span className="break-all font-medium text-white/95 group-hover:text-white">{asString(val)}</span>
          </a>
        ))}
      </div>
      {style === "form" && (
        <div className="rounded-xl border border-white/10 border-dashed px-6 py-8 text-center text-sm text-white/45">
          <span className="font-mono text-xs">Interactive form widgets can attach here · </span>
          recruiter can use links above today
        </div>
      )}
    </div>
  );
}

function PersonalStyled({ meta, data, accentClassName, p }) {
  const style = meta?.defaultConfig?.style || "";
  const headline = asString(data.fullName || data.headline);
  const sub = asString(data.tagline || data.title || data.email || "");
  const bio = asString(data.bio || data.summary || "");

  if (style === "hero_banner") {
    return (
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/[0.1]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-fuchsia-500/10 to-violet-600/25 opacity-90" aria-hidden />
        <div className={`relative px-8 py-12 md:py-14 ${accentClassName}`}>
          <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/85">Introducing</h3>
          <p className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{headline || sub || "Portfolio owner"}</p>
          {(sub || bio) ? <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{bio || sub}</p> : null}
        </div>
      </div>
    );
  }

  const avatarUrl = data.avatar ?? data.photoUrl ?? data.avatarUrl;
  const listKeys = [["email", data.email], ["phone", data.phone], ["address", data.address]];

  if (style === "minimal_list" || style === "simple_card" || style === "profile_photo") {
    return (
      <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
        {(style === "profile_photo" || avatarUrl) && (
          <div className="mx-auto shrink-0 sm:mx-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-32 w-32 rounded-2xl border border-white/15 object-cover shadow-lg" loading="lazy" />
            ) : (
              <div className={`flex h-32 w-32 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] font-mono text-4xl font-bold ${accentClassName}`}>
                {(headline || "?").charAt(0)}
              </div>
            )}
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          {headline ? <h3 className="text-2xl font-bold tracking-tight text-white">{headline}</h3> : null}
          {bio ? <p className={`text-sm leading-relaxed text-white/70 ${accentClassName}`}>{bio}</p> : sub ? <p className={`text-white/65 ${accentClassName}`}>{sub}</p> : null}
          <ul className="space-y-2 border-t border-white/10 pt-4 font-mono text-sm text-white/75">
            {listKeys.filter(([, v]) => asString(v)).map(([k, v]) => (
              <li key={k} className="flex gap-3">
                <span className="w-28 shrink-0 uppercase text-[11px] text-white/35">{k}</span>
                <span className="break-all">{asString(v)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  /* fallback: show all pairs */
  return <KeyValueResidual entries={Object.entries(data)} p={p} />;
}

function renderStructured({ meta, data, accentClassName, p, accentDotClass }) {
  const type = meta?.componentType || "";
  const style = meta?.defaultConfig?.style || "";
  let omit = [];

  switch (type) {
    case "chart_bar":
      omit = ["title", "labels", "values"];
      return { node: <BarChartWrapped data={data} accentClassName={accentClassName} />, omit };
    case "chart_line":
      omit = ["title", "labels", "series"];
      return { node: <LineChartLive data={data} accentClassName={accentClassName} />, omit };
    case "chart_donut":
      omit = ["title", "segments"];
      return { node: <DonutLive data={data} accentClassName={accentClassName} />, omit };
    case "stats_row":
      omit = ["metrics", "stats"];
      return { node: <StatsLive data={data} accentClassName={accentClassName} />, omit };
    case "skills":
      omit = ["skills", "skillList"];
      if (style === "category_list") omit.push("categoryA", "categoryB", "stack", "tech", "tools");
      return {
        node: <SkillsLive meta={meta} data={data} accentClassName={accentClassName} p={p} />,
        omit,
      };
    case "experience":
    case "education": {
      const keysFlat = ["company", "institution", "position", "degree", "year", "startDate", "endDate", "description", "gpa", "title"];
      omit = keysFlat.filter((k) => data[k] != null && data[k] !== "");
      return { node: <TimelineExperience style={style} data={data} accentDotClass={accentDotClass} p={p} />, omit: keysFlat };
    }
    case "projects": {
      const keysProj = ["name", "projectName", "title", "description", "image", "thumbnail", "imageUrl", "screenshot", "linkLive", "github", "liveUrl"];
      return { node: <ProjectsHighlight meta={meta} data={data} accentClassName={accentClassName} />, omit: keysProj };
    }
    case "certificates": {
      omit = ["name", "title", "issuer", "date"];
      return { node: <CertificatesStrip meta={meta} data={data} accentClassName={accentClassName} />, omit };
    }
    case "contact": {
      omit = ["email", "phone", "linkedin"];
      return { node: <ContactStyled meta={meta} data={data} accentClassName={accentClassName} />, omit };
    }
    case "personal_info":
      return {
        node: <PersonalStyled meta={meta} data={data} accentClassName={accentClassName} p={p} />,
        omit: [...PERSON_CARD_KEYS],
      };
    default:
      return { node: null, omit: [] };
  }
}

export function PortfolioBlockList({ blocks, templatesById, p, accentKey }) {
  const accentClassName = ACCENT_BY_THEME[accentKey] || ACCENT_BY_THEME.default;
  const accentDotClass = DOT_BY_THEME[accentKey] || DOT_BY_THEME.default;

  if (!blocks?.length) {
    return <p className={`py-14 text-center font-mono text-sm ${p.monoMuted}`}>// No blocks yet · owner can add sections in edit mode</p>;
  }

  return (
    <ul className="mt-10 space-y-6">
      {blocks.map((block, idx) => {
        const meta = templatesById[block.templateId];
        const blockNum = String(idx + 1).padStart(2, "0");

        let structured = { node: null, omit: [] };
        try {
          structured = meta
            ? renderStructured({ meta, data: block.data || {}, accentClassName, p, accentDotClass })
            : { node: null, omit: [] };
        } catch {
          structured = { node: null, omit: [] };
        }

        const dataEntries = Object.entries(block.data || {});
        const omitSet = new Set(structured.omit || []);
        const residualEntries =
          omitSet.size > 0 ? dataEntries.filter(([k]) => !omitSet.has(k)) : structured.node != null ? [] : dataEntries;

        return (
          <li key={block.id} className={`relative isolate rounded-2xl p-6 sm:p-8 ${p.block}`}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent"
            />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs tabular-nums text-white/35">{blockNum}</span>
                <h4 className="max-w-full text-xl font-bold text-white">
                  <HoverTemplateTitle meta={{ ...meta, category: meta?.category, defaultConfig: meta?.defaultConfig }} accentClassName={accentClassName}>
                    {meta?.name || "Untitled section"}
                  </HoverTemplateTitle>
                </h4>
                {meta?.category ? (
                  <span className={`rounded-full px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider ${p.badgeCat}`}>
                    {meta.category.replace(/_/g, " ")}
                  </span>
                ) : null}
              </div>
              {meta?.componentType ? (
                <span className={`rounded-lg border border-white/10 px-2 py-1 font-mono text-[10px] ${p.monoMuted}`}>{meta.componentType}</span>
              ) : null}
            </div>

            {structured.node}
            {structured.node != null && residualEntries.length > 0 ? <KeyValueResidual entries={residualEntries} p={p} /> : null}
            {structured.node == null && dataEntries.length > 0 ? <KeyValueResidual entries={dataEntries} p={p} /> : null}
            {structured.node == null && dataEntries.length === 0 ? (
              <p className={`mt-6 font-mono text-sm ${p.monoMuted}`}>// empty section payload</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
