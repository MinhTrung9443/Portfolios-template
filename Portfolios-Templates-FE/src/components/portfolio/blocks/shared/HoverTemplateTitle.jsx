
import { MiniTemplatePreview } from "../../MiniTemplatePreview.jsx";

export function HoverTemplateTitle({ meta, accentClassName, children }) {
  return (
    <span className="group/tooltip relative isolate inline-flex max-w-full">
      <span
        className={`cursor-help border-b border-dotted pb-px transition-colors border-white/35 group-hover/tooltip:border-current ${accentClassName || ''}`}
      >
        {children}
      </span>
      <div
        role="tooltip"
        className="invisible absolute left-0 top-[calc(100%+10px)] z-[120] w-[min(284px,calc(100vw-3rem))] origin-top scale-[0.98] opacity-0 transition-all duration-200 ease-out pointer-events-none border border-white/[0.14] rounded-2xl bg-zinc-950/[0.98] p-3 shadow-[0_20px_70px_-10px_rgba(0,0,0,.9)] backdrop-blur-2xl group-hover/tooltip:pointer-events-none group-hover/tooltip:visible group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100"
      >
        <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40">Layout blueprint</p>
        <div className={accentClassName || ''}>
          <MiniTemplatePreview meta={meta} />
        </div>
        {meta?.description ? <p className="mt-2 text-[11px] leading-snug text-slate-400">{meta.description}</p> : null}
      </div>
    </span>
  );
}
