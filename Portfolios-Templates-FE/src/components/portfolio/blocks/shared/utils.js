
export function themedBarBg(accentClassName) {
  if (accentClassName?.includes("emerald")) return "linear-gradient(to top,#064e3b55,#34d399bb)";
  if (accentClassName?.includes("fuchsia")) return "linear-gradient(to top,#4a044ebb,#e879f9aa)";
  if (accentClassName?.includes("sky")) return "linear-gradient(to top,#0c4a6e55,#38bdf8bb)";
  return "linear-gradient(to top,#08334444,#22d3eebb)";
}

export const ACCENT_BY_THEME = {
  default: "text-cyan-400",
  minimal: "text-emerald-400",
  aurora: "text-fuchsia-300",
  midnight: "text-sky-400",
};

export const DOT_BY_THEME = {
  default: "bg-cyan-500 shadow-[0_0_16px_rgba(34,211,238,.55)]",
  minimal: "bg-emerald-500 shadow-[0_0_16px_rgba(52,211,153,.55)]",
  aurora: "bg-fuchsia-500 shadow-[0_0_16px_rgba(217,70,239,.55)]",
  midnight: "bg-sky-500 shadow-[0_0_16px_rgba(14,165,233,.55)]",
};
