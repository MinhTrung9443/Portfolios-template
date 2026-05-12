import { parseSkillEntries } from "../../components/portfolio/parseBlockData";

export default function Glassmorphism({ view, templatesById }) {
  const { owner, title, description, blocks } = view;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden relative">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/30 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[100px] animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        {/* Hero Card */}
        <section className="relative p-10 md:p-16 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-8 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium tracking-wide">
                {title || "Welcome to my portfolio"}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-300">
                {owner?.fullName || "John Doe"}
              </h1>
              <p className="text-xl text-blue-100/70 max-w-2xl leading-relaxed">
                {description || owner?.bio}
              </p>
            </div>
            <div className="md:col-span-4 flex justify-center">
              {owner?.avatarUrl ? (
                <img src={owner.avatarUrl} alt="" className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]" />
              ) : (
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/10 border-4 border-white/20 backdrop-blur-xl flex items-center justify-center text-7xl font-bold">
                  {owner?.fullName?.charAt(0) || "G"}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Blocks */}
        <div className="grid md:grid-cols-2 gap-8">
          {blocks?.map((block) => {
            const meta = templatesById[block.templateId];
            const type = meta?.componentType;
            const data = block.data || {};

            const CardWrapper = ({ children }) => (
              <div className="p-8 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition duration-300 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {children}
              </div>
            );

            if (type === "skills") {
              return (
                <CardWrapper key={block.id}>
                  <h3 className="text-2xl font-bold mb-6 text-white/90">{meta?.name || "Skills"}</h3>
                  <div className="flex flex-wrap gap-3">
                    {parseSkillEntries(data.skills || data.skillList).map((s, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 shadow-inner text-sm font-medium text-blue-100/90">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </CardWrapper>
              );
            }

            if (type === "experience" || type === "education") {
              return (
                <CardWrapper key={block.id}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{data.title || data.position || data.degree}</h3>
                        <p className="text-cyan-300/80 font-medium mt-1">{data.company || data.institution}</p>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium border border-white/5">
                        {data.startDate} - {data.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-blue-100/60 text-sm leading-relaxed">{data.description}</p>
                  </div>
                </CardWrapper>
              );
            }

            if (type === "projects") {
              return (
                <div key={block.id} className="md:col-span-2 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl relative overflow-hidden group">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1 space-y-6">
                      <h3 className="text-3xl font-bold text-white">{data.name || data.title}</h3>
                      <p className="text-blue-100/70 leading-relaxed text-lg">{data.description}</p>
                      {data.liveUrl && (
                        <a href={data.liveUrl} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition hover:-translate-y-0.5">
                          Launch Project
                        </a>
                      )}
                    </div>
                    <div className="order-1 md:order-2 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                      {data.image || data.imageUrl ? (
                        <img src={data.image || data.imageUrl} alt="" className="w-full h-[300px] object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
                      ) : (
                        <div className="w-full h-[300px] flex items-center justify-center text-white/20">No Image</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </main>
    </div>
  );
}
