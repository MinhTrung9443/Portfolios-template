
import { asString } from '../../parseBlockData.js';

export default function ProjectsBlock({ meta, data, accentClassName }) {
  const title = asString(data.name ?? data.projectName ?? data.title);
  const desc = asString(data.description ?? "");
  const img = asString(data.image ?? data.thumbnail ?? data.imageUrl ?? data.screenshot ?? "");
  const style = meta?.defaultConfig?.style || "";

  if (style === "list") {
    return (
      <div className="mt-6 flex flex-col sm:flex-row gap-5 items-start border-b border-white/10 pb-6 last:border-0 hover:bg-white/[0.02] p-4 rounded-xl transition-colors">
        {img ? (
          <div className="w-full sm:w-40 shrink-0 aspect-video rounded-lg overflow-hidden border border-white/10">
            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ) : null}
        <div className="flex-1 min-w-0">
          <h5 className="text-lg font-bold text-white">{title || "Project"}</h5>
          {desc ? <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p> : null}
          <div className="mt-3 flex gap-4 font-mono text-[11px]">
            {[data.linkLive, data.github, data.liveUrl].map((u, i) =>
              asString(u) ? <a key={i} href={u} target="_blank" rel="noreferrer" className={`hover:underline ${accentClassName || ''} font-semibold flex items-center gap-1`}>Link {i+1} <span aria-hidden>↗</span></a> : null
            )}
          </div>
        </div>
      </div>
    );
  }

  // card_grid and masonry
  return (
    <div className={`mt-6 rounded-2xl border border-white/[0.08] bg-black/35 overflow-hidden hover:border-white/20 transition-colors`}>
      <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)]">
        {img ? (
          <div className="aspect-video sm:aspect-auto overflow-hidden bg-white/[0.04] sm:h-full sm:order-2 border-b sm:border-b-0 sm:border-l border-white/10">
            <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        ) : null}
        <div className="min-w-0 p-5 sm:p-6 sm:order-1 flex flex-col justify-center">
          <h5 className="text-xl font-bold tracking-tight text-white">{title || "Project"}</h5>
          {desc ? <p className="mt-3 text-sm leading-relaxed text-white/65">{desc}</p> : null}
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
            {[data.linkLive, data.github, data.liveUrl].map((u, i) =>
              asString(u) ? (
                <a key={i} href={u} target="_blank" rel="noreferrer" className={`rounded-full border px-4 py-1.5 transition hover:bg-white/[0.08] ${accentClassName || ''} border-current/30 bg-current/[0.08] font-medium`}>
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
