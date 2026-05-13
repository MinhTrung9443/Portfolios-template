
import { asString } from '../../parseBlockData.js';

export default function HeroBanner({ data, accentClassName }) {
  const headline = asString(data.fullName || data.headline);
  const sub = asString(data.tagline || data.title || data.email || "");
  const bio = asString(data.bio || data.summary || "");

  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/[0.1]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-fuchsia-500/10 to-violet-600/25 opacity-90" aria-hidden />
      <div className={`relative px-8 py-12 md:py-14 ${accentClassName || ''}`}>
        <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/85">Introducing</h3>
        <p className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{headline || sub || "Portfolio owner"}</p>
        {(sub || bio) ? <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{bio || sub}</p> : null}
      </div>
    </div>
  );
}
