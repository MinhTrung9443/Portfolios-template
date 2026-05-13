
import { asString } from '../../parseBlockData.js';

export default function TimelineExperience({ meta, data, accentDotClass, p, accentClassName }) {
  const style = meta?.defaultConfig?.style || "";
  const pairs = [
    ["company", "Company"],
    ["institution", "Institution"],
    ["position", "Role"],
    ["degree", "Degree"],
    ["year", "Year"],
    ["startDate", "Start"],
    ["endDate", "End"],
    ["gpa", "GPA"],
    ["description", "Notes"],
    ["title", "Title"],
  ];
  const rows = pairs.filter(([k]) => data[k]).map(([k, label]) => ({ label, value: data[k] }));

  const role = asString(data.position || data.degree);
  const place = data.institution ?? data.company;
  const titleLine =
    place && role
      ? `${role} · ${asString(place)}`
      : asString(place || role || data.title || data.degree || "");

  if (style === "cards") {
    return (
      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/35 p-5 sm:p-6 shadow-lg hover:bg-white/[0.02] transition-colors">
        {titleLine ? <h5 className="text-xl font-bold text-white mb-4">{titleLine}</h5> : null}
        <dl className="grid gap-3 sm:grid-cols-2 text-sm text-white/80">
          {rows.map((r, i) => (
            <div key={i} className="flex flex-col gap-1 bg-white/[0.03] p-3 rounded-lg border border-white/[0.05]">
              <dt className={`font-mono text-[10px] uppercase tracking-wide ${p?.monoMuted || ''}`}>{r.label}</dt>
              <dd className="whitespace-pre-wrap leading-relaxed font-medium text-white/90">{String(r.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (style === "minimal_list" || style === "minimal") {
    return (
      <div className="mt-6 flex flex-col gap-2 bg-black/20 p-4 rounded-xl border border-white/[0.04]">
        {titleLine ? <h5 className={`text-lg font-semibold ${accentClassName || ''}`}>{titleLine}</h5> : null}
        <div className="space-y-1 text-sm text-white/70 mt-2">
          {rows.map((r, i) => (
            <p key={i} className="flex gap-2">
              <span className="font-semibold text-white/90 min-w-[80px] shrink-0">{r.label}:</span> 
              <span className="whitespace-pre-wrap">{String(r.value)}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (style === "table") {
    return (
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/30">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-white/[0.08]">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-white/[0.04] transition-colors">
                <th className={`px-4 py-3 font-mono text-[11px] uppercase tracking-wide whitespace-nowrap ${p?.monoMuted || ''} w-1/4`}>{r.label}</th>
                <td className="px-4 py-3 text-white/90 whitespace-pre-wrap">{String(r.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // timeline / default
  return (
    <div className="relative mt-6 border-l border-white/15 pl-6 sm:pl-8">
      <div className={`absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full shadow-lg shadow-black/80 ${accentDotClass || ''}`} aria-hidden />
      {titleLine ? <h5 className="text-lg font-bold text-white">{titleLine}</h5> : null}
      <dl className="mt-3 space-y-2 text-sm text-white/80">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <dt className={`font-mono text-[11px] uppercase tracking-wide ${p?.monoMuted || ''}`}>{r.label}</dt>
            <dd className="min-w-0 flex-1 whitespace-pre-wrap leading-relaxed">{String(r.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
