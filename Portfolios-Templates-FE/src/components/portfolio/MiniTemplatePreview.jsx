/**
 * Hover wireframes — schematic of each catalog layout (not tied to live data).
 */
export function MiniTemplatePreview({ meta }) {
  const type = meta?.componentType || "";
  const style = meta?.defaultConfig?.style || "";

  const frame = (
    svgsWrap
  ) => (
    <div className="flex h-[100px] w-full items-center justify-center rounded-lg border border-white/10 bg-black/40 p-2 text-current">
      <svg viewBox="0 0 200 112" className="h-full w-full max-h-[92px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="192" height="104" rx="6" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.2" />
        {svgsWrap}
      </svg>
    </div>
  );

  switch (type) {
    case "chart_bar":
      return frame(
        <>
          {[40, 70, 45, 90, 55].map((h, i) => (
            <rect
              key={i}
              x={38 + i * 28}
              y={94 - h * 0.7}
              width="14"
              height={h * 0.7}
              rx="2"
              className={style.includes("horizontal") ? "fill-none" : "fill-current"}
              fillOpacity={0.45}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth="1"
            />
          ))}
        </>
      );

    case "chart_line":
      return frame(
        <>
          <path
            d="M28 76 L54 62 L82 74 L112 42 L138 54 L164 38 L178 52"
            stroke="currentColor"
            strokeOpacity="0.85"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="112" cy="42" r="3.5" className="fill-current" opacity="0.9" />
        </>
      );

    case "chart_donut":
      return frame(
        <>
          <circle cx="100" cy="56" r="38" stroke="currentColor" strokeOpacity="0.12" strokeWidth="18" />
          <circle
            cx="100"
            cy="56"
            r="38"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="18"
            strokeDasharray="80 159"
            strokeLinecap="round"
            transform="rotate(-88 100 56)"
          />
          <circle cx="100" cy="56" r="18" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1.5" fill="rgba(0,0,0,0.4)" />
        </>
      );

    case "stats_row":
      return (
        <div className="flex h-[100px] w-full gap-2 rounded-lg border border-white/10 bg-black/40 p-3 text-current">
          {[["12+", " yrs"], ["40", " libs"], ["24/7"]].map((t, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-center rounded-md border border-white/10 bg-white/[0.04] py-2">
              <span className="text-sm font-bold text-white/95">{t[0]}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-50">{t[1] ?? " "} </span>
            </div>
          ))}
        </div>
      );

    case "skills": {
      if (style === "tag_cloud") {
        return (
          <div className="flex h-[100px] flex-wrap content-center gap-1.5 rounded-lg border border-white/10 bg-black/40 p-2 text-current">
            {["Rust", "K8s", "Go", "UI", "API", "ML"].map((t) => (
              <span key={t} className="rounded-full border border-current/30 bg-current/15 px-2 py-0.5 text-[9px] font-medium">
                {t}
              </span>
            ))}
          </div>
        );
      }
      if (style === "progress_bars") {
        return frame(
          <>
            {[80, 55, 95].map((w, i) => (
              <g key={i}>
                <rect x="28" y={34 + i * 24} width="146" height="9" rx="3" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" fill="rgba(255,255,255,0.05)" />
                <rect x="28" y={34 + i * 24} width={(146 * w) / 100} height="9" rx="3" className="fill-current" opacity={0.7} />
              </g>
            ))}
          </>
        );
      }
      if (style === "cards_grid") {
        return (
          <div className="grid h-[100px] grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/40 p-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded border border-white/10 bg-white/[0.05]" />
            ))}
          </div>
        );
      }
      if (style === "category_list") {
        return (
          <div className="flex h-[100px] flex-col gap-2 rounded-lg border border-white/10 bg-black/40 p-3 text-current">
            {["Frontend", "Infra"].map((c) => (
              <div key={c}>
                <p className="text-[9px] font-semibold opacity-65">{c}</p>
                <div className="mt-1 flex gap-1">
                  <span className="rounded bg-current/20 px-2 py-0.5 text-[8px]">A</span>
                  <span className="rounded bg-current/15 px-2 py-0.5 text-[8px]">B</span>
                </div>
              </div>
            ))}
          </div>
        );
      }
      break;
    }

    case "experience":
    case "education": {
      if (style === "timeline") {
        return frame(
          <>
            <path d="M36 96 V20" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5" />
            {[32, 58, 84].map((y, i) => (
              <g key={i}>
                <circle cx="36" cy={36 + i * 26} r="5" fill="currentColor" fillOpacity={0.5} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                <rect x="52" y={28 + i * 26} width="138" height="18" rx="4" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.2" fill="rgba(255,255,255,0.04)" />
              </g>
            ))}
          </>
        );
      }
      if (style === "cards" || style === "minimal_list") {
        return frame(
          <>
            {[0, 1].map((i) => (
              <rect key={i} x="28" y={28 + i * 38} width="146" height="28" rx="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" fill="rgba(255,255,255,0.04)" />
            ))}
          </>
        );
      }
      if (style === "minimal" || style === "table") {
        return frame(
          <>
            {[0, 1, 2].map((i) => (
              <line key={i} x1="28" x2="172" y1={42 + i * 22} y2={42 + i * 22} stroke="currentColor" strokeOpacity={0.12} strokeWidth="1.2" />
            ))}
          </>
        );
      }
      break;
    }

    case "certificates":
      return frame(
        <>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={42 + i * 44} y="36" width="36" height="44" rx="4" stroke="currentColor" strokeOpacity={0.4} strokeWidth="1.3" fill="rgba(255,255,255,0.05)" />
          ))}
        </>
      );

    case "projects":
      if (style === "list") {
        return frame(
          <>
            {[0, 1, 2].map((i) => (
              <rect key={i} x="28" y={34 + i * 26} width="146" height="16" rx="3" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" fill="rgba(255,255,255,0.04)" />
            ))}
          </>
        );
      }
      return (
        <div className="grid h-[100px] grid-cols-3 gap-2 rounded-lg border border-white/10 bg-black/40 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`rounded-lg border border-white/10 bg-gradient-to-br from-white/10 ${i === 1 ? "row-span-1 h-full" : ""} to-transparent`} />
          ))}
        </div>
      );

    case "contact":
      return frame(
        <>
          {[0, 1, 2].map((i) => (
            <rect key={i} x="36" y={30 + i * 22} width="132" height="12" rx="3" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.1" fill="rgba(255,255,255,0.05)" />
          ))}
          <rect x="144" y="88" width="52" height="14" rx="4" fill="currentColor" fillOpacity="0.42" stroke="white" strokeOpacity="0.2" strokeWidth="0.8" />
        </>
      );

    case "personal_info":
      return frame(
        <>
          <rect x="28" y="28" width="56" height="56" rx="12" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" fill="rgba(255,255,255,0.06)" />
          <rect x="96" y="36" width="88" height="10" rx="3" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.1" fill="rgba(255,255,255,0.06)" />
          <rect x="96" y="54" width="72" height="8" rx="2" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.1" fill="rgba(255,255,255,0.04)" />
          {style === "hero_banner" && <rect x="20" y="86" width="160" height="18" rx="4" opacity="0.45" stroke="currentColor" strokeOpacity="0.3" />}
        </>
      );

    default:
      return frame(
        <>
          {[0, 1, 2].map((i) => (
            <rect key={i} x="36" y={36 + i * 22} width="132" height="10" rx="2" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.1" fill="rgba(255,255,255,0.04)" />
          ))}
        </>
      );
  }

  /* fallback */
  return frame(
    <>
      {[0, 1, 2].map((i) => (
        <rect key={i} x="36" y={38 + i * 20} width="132" height="10" rx="2" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.1" fill="rgba(255,255,255,0.04)" />
      ))}
    </>
  );
}
