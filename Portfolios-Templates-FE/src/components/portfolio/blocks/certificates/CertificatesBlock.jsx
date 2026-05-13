
import { asString } from '../../parseBlockData.js';

export default function CertificatesBlock({ meta, data, accentClassName, accentDotClass }) {
  const style = meta?.defaultConfig?.style || "";
  const name = asString(data.name ?? data.title);
  const issuer = asString(data.issuer);
  const date = asString(data.date);

  const inner = (
    <>
      <p className="text-base font-semibold text-white">{name || "Credential"}</p>
      {(issuer || date) && (
        <p className={`mt-1 font-mono text-xs ${accentClassName || ''}`}>
          {[issuer, date].filter(Boolean).join(" · ")}
        </p>
      )}
    </>
  );

  if (style === "badge") {
    return (
      <div className="mt-6 flex justify-center rounded-2xl border border-white/10 bg-black/35 p-8 shadow-inner">
        <div className="flex aspect-square max-w-[220px] flex-col items-center justify-center rounded-full border border-dashed border-white/20 px-8 py-12 text-center bg-gradient-to-b from-white/[0.02] to-transparent relative">
          <div className={`absolute -top-4 rounded-full border p-3 ${accentClassName || ''} border-current/40 bg-black shadow-lg text-2xl`}>★</div>
          {inner}
        </div>
      </div>
    );
  }

  if (style === "timeline") {
    return (
      <div className="relative mt-6 border-l border-white/15 pl-6 sm:pl-8 py-2">
        <div className={`absolute left-[-5px] top-3 h-2.5 w-2.5 rounded-full shadow-lg shadow-black/80 ${accentDotClass || ''}`} aria-hidden />
        {inner}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-black/40 to-black/20 p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
      <div className={`text-2xl opacity-80 ${accentClassName || ''}`}>✦</div>
      <div>{inner}</div>
    </div>
  );
}
