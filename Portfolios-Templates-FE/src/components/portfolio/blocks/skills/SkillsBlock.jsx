
import { parseSkillEntries, asString, parseStringList } from '../../parseBlockData.js';
import { themedBarBg } from '../shared/utils';

export default function SkillsBlock({ meta, data, accentClassName, p }) {
  const style = meta?.defaultConfig?.style || "";
  const entries = parseSkillEntries(data.skills ?? data.skillList ?? "");
  const names = entries.some((e) => asString(e.name)) ? entries : [];

  const emptySkills = (
    <p className={`mt-6 font-mono text-sm leading-relaxed ${p?.monoMuted || ''}`}>
      // Add skill data — JSON array with name / level objects, or comma-separated list.
    </p>
  );

  if (style === "tag_cloud") {
    if (!names.length) return emptySkills;
    return (
      <div className="mt-6 flex flex-wrap gap-2">
        {names.slice(0, 20).map((e, i) => (
          <span
            key={e.name + i}
            className={`rounded-xl border px-3 py-1.5 text-sm font-medium backdrop-blur-sm border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.08] transition-colors ${accentClassName || ''}`}
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
                <p className={`font-semibold ${accentClassName || ''}`}>{e.name}</p>
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
            <h5 className={`mb-3 text-xs font-semibold uppercase tracking-widest opacity-65 ${accentClassName || ''}`}>{cat.title}</h5>
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
