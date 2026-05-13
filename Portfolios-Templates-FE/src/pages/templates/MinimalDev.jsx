import { PortfolioBlockList } from "../../components/portfolio/PortfolioBlockDisplay";

const pMinimalDev = {
  block: "border border-zinc-800 rounded bg-zinc-900/30 p-5 hover:bg-zinc-900/50 transition-all duration-300",
  badgeCat: "bg-zinc-800 text-zinc-300 border border-zinc-700",
  monoMuted: "text-zinc-500",
  monoLabel: "text-zinc-400",
  dt: "text-zinc-500",
  dd: "text-zinc-300",
};

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
          
          <PortfolioBlockList blocks={blocks ?? []} templatesById={templatesById} p={pMinimalDev} accentKey="minimal" />
        </section>
      </main>
    </div>
  );
}
