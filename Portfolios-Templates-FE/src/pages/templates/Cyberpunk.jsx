import { parseSkillEntries } from "../../components/portfolio/parseBlockData";

export default function Cyberpunk({ view, templatesById }) {
  const { owner, title, description, blocks } = view;

  return (
    <div className="min-h-screen bg-[#0d0221] text-[#00ff41] font-mono selection:bg-[#ff003c] selection:text-white">
      {/* Glitch background effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
      
      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
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

          <div className="grid md:grid-cols-2 gap-8">
            {blocks?.map((block) => {
              const meta = templatesById[block.templateId];
              const type = meta?.componentType;
              const data = block.data || {};

              const CyberBox = ({ children, title }) => (
                <div className="bg-[#020204] border-l-4 border-[#008f11] p-6 relative group hover:border-[#ff003c] transition-colors">
                  <div className="absolute top-0 right-0 bg-[#008f11] text-black text-xs font-bold px-2 py-1 group-hover:bg-[#ff003c] transition-colors uppercase">
                    SYS.{title}
                  </div>
                  {children}
                </div>
              );

              if (type === "skills") {
                return (
                  <CyberBox key={block.id} title="AUGMENTATIONS">
                    <div className="flex flex-wrap gap-3 mt-4">
                      {parseSkillEntries(data.skills || data.skillList).map((s, idx) => (
                        <span key={idx} className="px-3 py-1 bg-transparent border border-[#00ff41] text-[#00ff41] text-sm uppercase shadow-[0_0_5px_rgba(0,255,65,0.4)]">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </CyberBox>
                );
              }

              if (type === "experience" || type === "education") {
                return (
                  <CyberBox key={block.id} title="DATALOG">
                    <div className="mt-4 space-y-2">
                      <h3 className="text-xl font-bold text-white uppercase">{data.title || data.position || data.degree}</h3>
                      <p className="text-[#ff003c] font-bold">{data.company || data.institution} // {data.startDate}-{data.endDate || "PRESENT"}</p>
                      <p className="text-[#00ff41]/70 text-sm mt-2">{data.description}</p>
                    </div>
                  </CyberBox>
                );
              }

              if (type === "projects") {
                return (
                  <div key={block.id} className="md:col-span-2 bg-[#020204] border border-[#008f11] p-1 shadow-[0_0_10px_rgba(0,143,17,0.2)]">
                    <div className="border border-[#008f11] p-6 relative flex flex-col md:flex-row gap-6">
                      <div className="absolute -top-3 left-4 bg-[#0d0221] px-2 text-[#ff003c] font-bold uppercase tracking-widest text-sm">
                        EXECUTABLE // {data.name || data.title}
                      </div>
                      {(data.image || data.imageUrl) && (
                        <div className="w-full md:w-1/3 shrink-0">
                          <img src={data.image || data.imageUrl} alt="" className="w-full h-full object-cover border border-[#00ff41]/50 grayscale hover:grayscale-0 transition duration-300" />
                        </div>
                      )}
                      <div className="flex-1 space-y-4 pt-2">
                        <p className="text-[#00ff41]/80">{data.description}</p>
                        {data.liveUrl && (
                          <a href={data.liveUrl} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-[#008f11] text-black font-bold uppercase hover:bg-[#00ff41] transition shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                            RUN_APP.EXE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
