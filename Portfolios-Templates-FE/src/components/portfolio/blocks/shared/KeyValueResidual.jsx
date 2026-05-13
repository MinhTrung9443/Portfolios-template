
export function KeyValueResidual({ entries, p }) {
  if (!entries?.length) return null;
  return (
    <dl className="mt-5 grid gap-3 text-sm sm:gap-4">
      {entries.map(([k, v]) => (
        <div
          key={k}
          className={"grid gap-1 rounded-xl border border-white/[0.04] bg-black/25 px-4 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-6"}
        >
          <dt className={`font-mono text-[11px] uppercase tracking-wide ${p?.dt || ''}`}>{k.replace(/_/g, " ")}</dt>
          <dd className={`font-sans whitespace-pre-wrap break-words leading-relaxed ${p?.dd || ''}`}>{String(v ?? "")}</dd>
        </div>
      ))}
    </dl>
  );
}
