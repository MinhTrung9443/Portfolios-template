import { useMemo } from "react";
import { parseSkillEntries, asString } from "../../components/portfolio/parseBlockData";

function TerminalHeader({ title }) {
  return (
    <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-2 flex items-center gap-2">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <span className="ml-4 font-mono text-xs text-zinc-400">~/{title.toLowerCase().replace(/\s+/g, "_")}</span>
    </div>
  );
}

export default function MinimalDev({ view, templatesById }) {
  const { owner, title, description, blocks } = view;

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono flex flex-col md:flex-row selection:bg-zinc-800">
      {/* Sidebar */}
      <aside className="md:w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-6 sticky top-0 md:h-screen overflow-y-auto">
        <div className="flex flex-col items-center text-center gap-4">
          {owner?.avatarUrl ? (
            <img src={owner.avatarUrl} alt="" className="w-24 h-24 rounded-full grayscale border-2 border-zinc-700" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-2xl text-zinc-500">
              {owner?.fullName?.charAt(0) || "?"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-zinc-100">{owner?.fullName || "Developer"}</h1>
            <p className="text-xs text-zinc-500 mt-1">@dev</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2 mt-4">
          <a href="#about" className="text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 px-3 py-2 rounded transition">./about.sh</a>
          <a href="#portfolio" className="text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 px-3 py-2 rounded transition">./portfolio.sh</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-4xl space-y-12">
        <section id="about" className="space-y-6">
          <div className="border border-zinc-800 rounded overflow-hidden bg-black shadow-2xl">
            <TerminalHeader title="README.md" />
            <div className="p-6">
              <h2 className="text-2xl text-white font-bold mb-4">{title || "Portfolio"}</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-zinc-400">{description || owner?.bio || "No description provided."}</p>
            </div>
          </div>
        </section>

        <section id="portfolio" className="space-y-8">
          <h3 className="text-xl text-white font-bold border-b border-zinc-800 pb-2">ls -la portfolio/</h3>
          
          <div className="grid gap-6">
            {blocks?.map((block, i) => {
              const meta = templatesById[block.templateId];
              const type = meta?.componentType;
              const data = block.data || {};

              return (
                <div key={block.id} className="border border-zinc-800 rounded bg-zinc-900/30 p-5 hover:bg-zinc-900/50 transition">
                  <div className="text-xs text-zinc-500 mb-4 flex justify-between">
                    <span>drwxr-xr-x</span>
                    <span>{meta?.name || "Block"}</span>
                  </div>

                  {type === "skills" && (
                    <div className="flex flex-wrap gap-2">
                      {parseSkillEntries(data.skills || data.skillList).map((s, idx) => (
                        <span key={idx} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded border border-zinc-700">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {(type === "experience" || type === "education") && (
                    <div className="space-y-2">
                      <p className="text-zinc-100 font-bold">{data.title || data.position || data.degree} @ {data.company || data.institution}</p>
                      <p className="text-sm text-zinc-500">{data.startDate} - {data.endDate || "Present"}</p>
                      <p className="text-sm">{data.description}</p>
                    </div>
                  )}

                  {type === "projects" && (
                    <div>
                      <p className="text-zinc-100 font-bold mb-2">{(data.name || data.title)}</p>
                      <p className="text-sm text-zinc-400 mb-3">{data.description}</p>
                      <div className="flex gap-4">
                        {data.github && <a href={data.github} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">git clone</a>}
                        {data.liveUrl && <a href={data.liveUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:underline">curl -I</a>}
                      </div>
                    </div>
                  )}

                  {/* Fallback for other types */}
                  {(!["skills", "experience", "education", "projects"].includes(type)) && (
                    <pre className="text-xs text-zinc-500 overflow-x-auto">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
