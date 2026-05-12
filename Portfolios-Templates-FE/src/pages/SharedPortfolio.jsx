import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { portfolioAPI, templateAPI } from "../api";
import { PortfolioBlockList } from "../components/portfolio/PortfolioBlockDisplay.jsx";

import MinimalDev from "./templates/MinimalDev";
import CreativeDesigner from "./templates/CreativeDesigner";
import CorporatePro from "./templates/CorporatePro";
import Glassmorphism from "./templates/Glassmorphism";
import Cyberpunk from "./templates/Cyberpunk";
import MobileFirst from "./templates/MobileFirst";

const CUSTOM_TEMPLATES = {
  minimal_dev: MinimalDev,
  creative_designer: CreativeDesigner,
  corporate_pro: CorporatePro,
  glassmorphism: Glassmorphism,
  cyberpunk: Cyberpunk,
  mobile_first: MobileFirst,
};

const THEME_IDS = [
  "default", "minimal", "aurora", "midnight",
  "minimal_dev", "creative_designer", "corporate_pro",
  "glassmorphism", "cyberpunk", "mobile_first"
];

/** Visual tokens per preset — tech-forward dark shells, accents shift by theme */
const PALETTE = {
  default: {
    page: "font-sans min-h-screen bg-[#050508] text-slate-100 antialiased selection:bg-cyan-500/30",
    orb1: "bg-cyan-500/35",
    orb2: "bg-violet-600/35",
    orb3: "bg-fuchsia-500/20",
    nav: "rounded-2xl border border-white/[0.1] bg-black/40 backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_20px_50px_-20px_rgba(0,0,0,.8)]",
    kicker: "text-cyan-400",
    stripe: "from-cyan-500 to-violet-600",
    nameGradient: "from-white via-cyan-50 to-slate-400",
    card: "rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl",
    innerGlow: "shadow-[0_0_80px_-20px_rgba(34,211,238,.25)_inset]",
    badgeCat: "bg-cyan-500/10 text-cyan-300 border border-cyan-400/20",
    block: "rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md hover:border-cyan-400/25 hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.2)] transition-all duration-500",
    monoMuted: "text-slate-500",
    monoLabel: "text-cyan-400/80",
    btn: "rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.98] transition-all",
    dt: "text-slate-500 font-medium",
    dd: "text-slate-100",
    gridOpacity: "[mask-image:radial-gradient(ellipse_85%_65%_at_50%_0%,black,transparent)]",
  },
  minimal: {
    page: "font-sans min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500/25",
    orb1: "bg-emerald-500/25",
    orb2: "bg-teal-600/25",
    orb3: "bg-zinc-500/15",
    nav: "rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-xl shadow-black/50",
    kicker: "text-emerald-400",
    stripe: "from-emerald-400 to-teal-600",
    nameGradient: "from-white via-zinc-100 to-zinc-500",
    card: "rounded-3xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-xl",
    innerGlow: "",
    badgeCat: "bg-emerald-500/10 text-emerald-300 border border-emerald-400/25",
    block: "rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/35 hover:shadow-[0_0_32px_-8px_rgba(16,185,129,.2)] transition-all duration-500",
    monoMuted: "text-zinc-500",
    monoLabel: "text-emerald-400/80",
    btn: "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition-all active:scale-[0.98]",
    dt: "text-zinc-500",
    dd: "text-zinc-50",
    gridOpacity: "[mask-image:radial-gradient(ellipse_90%_60%_at_50%_0%,black,transparent)]",
  },
  aurora: {
    page: "font-sans min-h-screen bg-[#0c0618] text-slate-100 antialiased selection:bg-fuchsia-500/30",
    orb1: "bg-violet-500/40",
    orb2: "bg-fuchsia-500/35",
    orb3: "bg-orange-400/15",
    nav: "rounded-2xl border border-white/15 bg-gradient-to-r from-violet-950/60 to-fuchsia-950/50 backdrop-blur-2xl",
    kicker: "text-fuchsia-300",
    stripe: "from-violet-500 via-fuchsia-500 to-orange-400",
    nameGradient: "from-white via-fuchsia-100 to-orange-100",
    card: "rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-2xl",
    innerGlow: "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
    badgeCat: "bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-400/30",
    block: "rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md hover:border-fuchsia-400/40 transition-all duration-500",
    monoMuted: "text-purple-300/50",
    monoLabel: "text-fuchsia-300/90",
    btn: "rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-110 active:scale-[0.98] transition-all",
    dt: "text-purple-300/70",
    dd: "text-slate-50",
    gridOpacity: "[mask-image:radial-gradient(ellipse_80%_70%_at_50%_-10%,black,transparent)]",
  },
  midnight: {
    page: "font-sans min-h-screen bg-[#020617] text-slate-100 antialiased selection:bg-sky-500/30",
    orb1: "bg-sky-500/35",
    orb2: "bg-indigo-600/30",
    orb3: "bg-blue-400/15",
    nav: "rounded-2xl border border-sky-900/60 bg-slate-950/80 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(56,189,248,0.15)]",
    kicker: "text-sky-400",
    stripe: "from-sky-500 to-indigo-600",
    nameGradient: "from-white via-sky-100 to-slate-500",
    card: "rounded-3xl border border-sky-900/40 bg-slate-900/60 backdrop-blur-xl",
    innerGlow: "",
    badgeCat: "bg-sky-500/15 text-sky-200 border border-sky-400/25",
    block: "rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-sky-500/40 hover:shadow-[0_0_40px_-12px_rgba(14,165,233,.35)] transition-all duration-500",
    monoMuted: "text-slate-500",
    monoLabel: "text-sky-400/85",
    btn: "rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/50 hover:brightness-110 active:scale-[0.98]",
    dt: "text-slate-500",
    dd: "text-slate-100",
    gridOpacity: "[mask-image:radial-gradient(ellipse_85%_65%_at_50%_0%,black,transparent)]",
  },
};

function ThemeBackdrop({ p }) {
  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 overflow-hidden ${p.gridOpacity}`}>
      <div className="absolute inset-0 bg-grid-tech bg-grid opacity-70" />
      <div className={`absolute -left-[20%] top-[-10%] h-[520px] w-[520px] rounded-full blur-[120px] ${p.orb1} animate-shimmer`} />
      <div className={`absolute right-[-15%] top-[20%] h-[460px] w-[460px] rounded-full blur-[110px] ${p.orb2} animate-float`} />
      <div className={`absolute bottom-[-20%] left-[25%] h-[380px] w-[380px] rounded-full blur-[100px] ${p.orb3}`} />
    </div>
  );
}

function SharedPortfolio() {
  const { portfolioId, sharedId } = useParams();
  const publicId = portfolioId || sharedId;

  const [view, setView] = useState(null);
  const [templatesById, setTemplatesById] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const themeKey = THEME_IDS.includes(view?.themeKey) ? view.themeKey : "default";
  const p = PALETTE[themeKey];

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- publicId-driven
  }, [publicId]);

  const fetchPage = async () => {
    setError("");
    setIsLoading(true);
    try {
      const [portfolioRes, templatesRes] = await Promise.all([
        portfolioAPI.getSharedPortfolio(publicId),
        templateAPI.getAllTemplates().catch(() => null),
      ]);

      const body = portfolioRes.data;
      if (!body.success) {
        throw new Error(body.message || "Portfolio not found");
      }
      const data = body.data;
      if (!data?.portfolioId) {
        throw new Error("Invalid response");
      }
      setView(data);

      const tmplBody = templatesRes?.data;
      if (tmplBody?.success && tmplBody.data?.length) {
        const map = Object.fromEntries(tmplBody.data.map((t) => [t.id, t]));
        setTemplatesById(map);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Portfolio not found");
    } finally {
      setIsLoading(false);
    }
  };

  const ownerInitial = useMemo(() => view?.owner?.fullName?.charAt(0) || "?", [view?.owner?.fullName]);

  const copyShareLink = () => {
    const url = `${window.location.origin}/p/${publicId}`;
    navigator.clipboard.writeText(url);
    alert("Public link copied. Share it with recruiters.");
  };

  if (isLoading) {
    return (
      <div className="font-sans flex min-h-screen items-center justify-center bg-[#050508]">
        <div className="flex flex-col items-center gap-5">
          <div className="h-14 w-14 rounded-2xl border border-cyan-400/40 border-t-cyan-400 animate-spin" />
          <p className="font-mono text-sm tracking-wider text-slate-500">LOADING_PREVIEW…</p>
        </div>
      </div>
    );
  }

  if (error || !view) {
    return (
      <div className="font-sans flex min-h-screen items-center justify-center bg-[#050508] px-4">
        <div className="max-w-md text-center rounded-3xl border border-white/10 bg-white/[0.04] p-10 backdrop-blur-xl">
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-400/80 mb-4">404</p>
          <h1 className="text-2xl font-bold text-white mb-3">Portfolio unavailable</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">{error || "We couldn't load this page."}</p>
          <Link to="/login" className={`inline-block rounded-xl px-6 py-3 text-sm font-semibold ${PALETTE.default.btn}`}>
            Owner sign in
          </Link>
        </div>
      </div>
    );
  }

  const CustomTemplate = CUSTOM_TEMPLATES[view.themeKey];
  if (CustomTemplate) {
    return <CustomTemplate view={view} templatesById={templatesById} />;
  }

  return (
    <div className={p.page}>
      <ThemeBackdrop p={p} />

      {/* Top bar */}
      <header className="relative z-20 px-4 pt-6 pb-2 sm:px-6 lg:px-8">
        <div className={`mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4 ${p.nav}`}>
          <div className="min-w-0">
            <p className={`font-mono text-[10px] font-medium uppercase tracking-[0.35em] ${p.kicker}`}>Live portfolio</p>
            <h1 className="mt-1 truncate text-lg font-bold text-white sm:text-xl">{view.title || "Portfolio"}</h1>
          </div>
          <button type="button" onClick={copyShareLink} className={p.btn}>
            Share link
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className={`relative overflow-hidden px-8 py-12 sm:px-10 sm:py-14 ${p.card} ${p.innerGlow}`}>
          <div className={`absolute left-8 top-0 h-1 w-24 rounded-full bg-gradient-to-r ${p.stripe} sm:w-40`} />
          <div className="relative flex flex-col gap-10 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              {view.owner?.avatarUrl ? (
                <img
                  src={view.owner.avatarUrl}
                  alt=""
                  className="relative z-10 h-36 w-36 rounded-[1.75rem] object-cover ring-2 ring-white/25 shadow-[0_0_50px_-5px_rgba(255,255,255,.15)] sm:h-40 sm:w-40"
                />
              ) : (
                <div
                  className={`relative z-10 flex h-36 w-36 items-center justify-center rounded-[1.75rem] bg-gradient-to-br ${p.stripe} text-4xl font-extrabold text-white shadow-2xl sm:h-40 sm:w-40`}
                >
                  {ownerInitial}
                </div>
              )}
              <div
                aria-hidden
                className={`absolute -inset-2 -z-0 rounded-[2rem] opacity-70 blur-xl bg-gradient-to-br ${p.stripe}`}
              />
            </div>
            <div className="min-w-0 flex-1 pt-4 sm:pt-0">
              <p className={`font-mono text-xs uppercase tracking-[0.3em] ${p.monoMuted}`}>Candidate</p>
              <h2
                className={`mt-2 bg-gradient-to-r bg-clip-text text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl lg:text-[2.75rem] ${p.nameGradient}`}
              >
                {view.owner?.fullName || "Anonymous talent"}
              </h2>
              {view.owner?.bio ? (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-[1.05rem] whitespace-pre-wrap">
                  {view.owner.bio}
                </p>
              ) : null}
              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs">
                <div>
                  <dt className={p.monoMuted}>THEME</dt>
                  <dd className={`mt-1 font-semibold capitalize ${p.kicker}`}>{view.themeKey || "default"}</dd>
                </div>
                <div>
                  <dt className={p.monoMuted}>SECTIONS</dt>
                  <dd className="mt-1 font-semibold text-white">{view.blocks?.length ?? 0}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {view.description ? (
          <section className={`mt-10 px-8 py-9 sm:px-10 ${p.card} ${p.innerGlow}`}>
            <span className={`font-mono text-[10px] font-semibold uppercase tracking-[0.35em] ${p.monoLabel}`}>01 · About</span>
            <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl whitespace-pre-wrap">{view.description}</p>
          </section>
        ) : null}

        <section className={`mt-10 px-8 py-9 sm:px-10 ${p.card} ${p.innerGlow}`}>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.07] pb-8">
            <div>
              <span className={`font-mono text-[10px] font-semibold uppercase tracking-[0.35em] ${p.monoLabel}`}>
                {view.description ? "02" : "01"} · Work &amp; data
              </span>
              <h3 className="mt-3 text-2xl font-bold text-white tracking-tight">Highlights</h3>
              <p className={`mt-2 max-w-xl text-sm leading-relaxed ${p.monoMuted}`}>
                Sections you configured — optimized for recruiter scanning.
              </p>
            </div>
          </div>

          <PortfolioBlockList blocks={view.blocks ?? []} templatesById={templatesById} p={p} accentKey={themeKey} />
        </section>

        <footer className={`relative z-10 mt-16 pb-10 text-center font-mono text-[11px] ${p.monoMuted}`}>
          <span className="opacity-70">Portfolio preview · Built for sharing</span>
        </footer>
      </main>
    </div>
  );
}

export default SharedPortfolio;
