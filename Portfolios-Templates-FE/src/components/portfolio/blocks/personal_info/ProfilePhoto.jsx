
import { asString } from '../../parseBlockData.js';

export default function ProfilePhoto({ data, accentClassName }) {
  const headline = asString(data.fullName || data.headline);
  const sub = asString(data.tagline || data.title || data.email || "");
  const bio = asString(data.bio || data.summary || "");
  const avatarUrl = data.avatar ?? data.photoUrl ?? data.avatarUrl;
  const listKeys = [["email", data.email], ["phone", data.phone], ["address", data.address]];

  return (
    <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
      <div className="mx-auto shrink-0 sm:mx-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-32 w-32 rounded-2xl border border-white/15 object-cover shadow-lg" loading="lazy" />
        ) : (
          <div className={`flex h-32 w-32 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] font-mono text-4xl font-bold ${accentClassName || ''}`}>
            {(headline || "?").charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {headline ? <h3 className="text-2xl font-bold tracking-tight text-white">{headline}</h3> : null}
        {bio ? <p className={`text-sm leading-relaxed text-white/70 ${accentClassName || ''}`}>{bio}</p> : sub ? <p className={`text-white/65 ${accentClassName || ''}`}>{sub}</p> : null}
        <ul className="space-y-2 border-t border-white/10 pt-4 font-mono text-sm text-white/75">
          {listKeys.filter(([, v]) => asString(v)).map(([k, v]) => (
            <li key={k} className="flex gap-3">
              <span className="w-28 shrink-0 uppercase text-[11px] text-white/35">{k}</span>
              <span className="break-all">{asString(v)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
