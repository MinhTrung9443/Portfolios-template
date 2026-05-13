import { PortfolioBlockList } from "../../components/portfolio/PortfolioBlockDisplay";

const pCyberpunk = {
  block: "bg-[#020204] border-l-4 border-[#008f11] p-6 relative group hover:border-[#ff003c] transition-colors mb-8 last:mb-0 shadow-[0_0_10px_rgba(0,143,17,0.2)]",
  badgeCat: "bg-[#008f11] text-black border-none uppercase font-bold",
  monoMuted: "text-[#00ff41]/60 uppercase tracking-widest text-xs",
  monoLabel: "text-[#ff003c]",
  dt: "text-[#ff003c]",
  dd: "text-[#00ff41]",
};

export default function Cyberpunk({ view, templatesById }) {
  const { owner, title, description, blocks } = view;

  return (
    <div className="min-h-screen bg-[#0d0221] text-[#00ff41] font-mono selection:bg-[#ff003c] selection:text-white">
      {/* Glitch background effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
      
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <header className="border-b-4 border-[#ff003c] pb-8 mb-12 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00ff41] to-[#008f11] filter drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]">
              {owner?.fullName || "Netrunner"}
            </h1>
            <p className="text-2xl mt-2 text-[#ff003c] uppercase tracking-widest">{title || "Cyber Specialist"}</p>
          </div>
          {owner?.avatarUrl && (
            <img src={owner.avatarUrl} alt="" className="w-24 h-24 md:w-32 md:h-32 object-cover border-2 border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.5)]" style={{ clipPath: "polygon(20% 0%, 100% 0, 100% 80%, 80% 100%, 0 100%, 0% 20%)" }} />
          )}
        </header>

        <div className="space-y-12">
          {description && (
            <section className="bg-[#020204] border border-[#ff003c] p-6 shadow-[0_0_15px_rgba(255,0,60,0.3)] relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]"></div>
              <h2 className="text-[#ff003c] uppercase tracking-widest text-sm mb-4">&gt; INIT_BIO_SEQUENCE</h2>
              <p className="text-lg leading-relaxed text-[#00ff41]/80">{description}</p>
            </section>
          )}

          <div className="mt-12">
             <PortfolioBlockList blocks={blocks ?? []} templatesById={templatesById} p={pCyberpunk} accentKey="default" />
          </div>
        </div>
      </div>
    </div>
  );
}