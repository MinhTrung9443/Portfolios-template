import { PortfolioBlockList } from "../../components/portfolio/PortfolioBlockDisplay";

const pGlassmorphism = {
  block: "p-8 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition duration-300 shadow-xl relative overflow-hidden group mb-8 last:mb-0",
  badgeCat: "bg-white/10 text-cyan-300 border border-white/20",
  monoMuted: "text-blue-100/60 font-medium",
  monoLabel: "text-cyan-400",
  dt: "text-blue-100/60",
  dd: "text-white/90",
};

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
        <div className="max-w-4xl mx-auto">
          <PortfolioBlockList blocks={blocks ?? []} templatesById={templatesById} p={pGlassmorphism} accentKey="midnight" />
        </div>
      </main>
    </div>
  );
}