
import { asString } from '../../parseBlockData.js';

export default function ContactBlock({ meta, data, accentClassName }) {
  const style = meta?.defaultConfig?.style || "";

  const items = [["email", data.email], ["phone", data.phone], ["linkedin", data.linkedin]].filter(([, v]) => asString(v));

  if (style === "direct_info") {
    return (
      <div className="mt-6 flex flex-col gap-3 bg-black/20 p-5 rounded-2xl border border-white/[0.06]">
        {items.map(([label, val]) => (
          <div key={label} className="flex items-center gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
             <span className={`font-mono text-xs uppercase ${accentClassName || ''} w-20 opacity-80`}>{label}</span>
             <span className="text-white text-sm font-medium">{asString(val)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, val]) => (
          <a key={label} href={label === "email" ? `mailto:${val}` : label === "phone" ? `tel:${val}` : asString(val)} className={`group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/35 px-4 py-4 transition hover:border-current/35 ${accentClassName || ''}`}>
            <span className={`rounded-lg border px-2 py-1 font-mono text-[10px] uppercase opacity-75 border-current/25`}>{label}</span>
            <span className="break-all font-medium text-white/95 group-hover:text-white">{asString(val)}</span>
          </a>
        ))}
      </div>
      {style === "form" && (
        <div className="rounded-xl border border-white/10 border-dashed px-6 py-8 text-center text-sm text-white/45 bg-white/[0.02]">
          <span className="font-mono text-xs font-semibold text-white/70">Interactive Form Widget Area</span>
          <p className="mt-2 text-xs">Recruiters can use the direct links above to contact you today.</p>
        </div>
      )}
    </div>
  );
}
