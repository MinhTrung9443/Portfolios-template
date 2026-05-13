
import { HoverTemplateTitle } from "./blocks/shared/HoverTemplateTitle";
import { KeyValueResidual } from "./blocks/shared/KeyValueResidual";
import { ACCENT_BY_THEME, DOT_BY_THEME } from "./blocks/shared/utils";
import { getComponentForBlock } from "./blocks/BlockRegistry";

export function PortfolioBlockList({ blocks, templatesById, p, accentKey }) {
  const accentClassName = ACCENT_BY_THEME[accentKey] || ACCENT_BY_THEME.default;
  const accentDotClass = DOT_BY_THEME[accentKey] || DOT_BY_THEME.default;

  if (!blocks?.length) {
    return <p className={`py-14 text-center font-mono text-sm ${p?.monoMuted || ''}`}>// No blocks yet · owner can add sections in edit mode</p>;
  }

  return (
    <ul className="mt-10 space-y-6">
      {blocks.map((block, idx) => {
        const meta = templatesById[block.templateId];
        const blockNum = String(idx + 1).padStart(2, "0");

        const BlockComponent = meta ? getComponentForBlock(meta) : null;
        
        // Excluded keys from KeyValueResidual are typically handled within the component.
        // We can pass data to KeyValueResidual directly if BlockComponent is missing.
        const dataEntries = Object.entries(block.data || {});

        return (
          <li key={block.id} className={`relative isolate rounded-2xl p-6 sm:p-8 ${p?.block || ''}`}>
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
                  <span className={`rounded-full px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider ${p?.badgeCat || ''}`}>
                    {meta.category.replace(/_/g, " ")}
                  </span>
                ) : null}
              </div>
              {meta?.componentType ? (
                <span className={`rounded-lg border border-white/10 px-2 py-1 font-mono text-[10px] ${p?.monoMuted || ''}`}>{meta.componentType}</span>
              ) : null}
            </div>

            {BlockComponent ? (
              <BlockComponent meta={meta} data={block.data || {}} accentClassName={accentClassName} accentDotClass={accentDotClass} p={p} />
            ) : (
              dataEntries.length > 0 ? <KeyValueResidual entries={dataEntries} p={p} /> : (
                <p className={`mt-6 font-mono text-sm ${p?.monoMuted || ''}`}>// empty section payload</p>
              )
            )}
          </li>
        );
      })}
    </ul>
  );
}
