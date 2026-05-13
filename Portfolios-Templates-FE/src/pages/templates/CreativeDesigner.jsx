import { PortfolioBlockList } from "../../components/portfolio/PortfolioBlockDisplay";

const pCreativeDesigner = {
  block: "bg-white rounded-3xl p-8 shadow-sm border border-rose-100 hover:shadow-lg transition-all duration-500",
  badgeCat: "bg-rose-50 text-rose-600 border border-rose-200 font-bold",
  monoMuted: "text-slate-400 font-bold uppercase tracking-widest",
  monoLabel: "text-rose-500",
  dt: "text-slate-500",
  dd: "text-slate-900 font-medium",
};

export default function CreativeDesigner({ view, templatesById }) {
  const { owner, title, description, blocks } = view;

  return (
    <div className="min-h-screen bg-rose-50 text-slate-900 font-sans selection:bg-rose-200">
      <header className="p-8 md:p-12 flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tighter">
          {owner?.fullName?.split(" ")[0] || "Creative"}
          <span className="text-rose-500">.</span>
        </h1>
        <a href="mailto:hello@example.com" className="font-bold text-sm uppercase tracking-widest hover:text-rose-500 transition">
          Let's Talk
        </a>
      </header>

      <main className="max-w-6xl mx-auto px-8 md:px-12 pb-24 space-y-32">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              {title || "Digital Designer & Art Director"}
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-lg">
              {description || owner?.bio || "Crafting digital experiences with a focus on bold typography and vibrant colors."}
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            {owner?.avatarUrl ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-orange-300 rounded-[3rem] rotate-6 scale-105 opacity-50 blur-xl"></div>
                <img src={owner.avatarUrl} alt="" className="relative w-64 h-64 md:w-96 md:h-96 object-cover rounded-[3rem] shadow-2xl" />
              </div>
            ) : (
              <div className="w-64 h-64 md:w-96 md:h-96 rounded-[3rem] bg-gradient-to-tr from-rose-400 to-orange-300 shadow-2xl flex items-center justify-center text-8xl text-white font-black">
                {owner?.fullName?.charAt(0) || "C"}
              </div>
            )}
          </div>
        </section>

        {/* Blocks mapping */}
        <section className="space-y-16">
          <PortfolioBlockList blocks={blocks ?? []} templatesById={templatesById} p={pCreativeDesigner} accentKey="aurora" />
        </section>
      </main>
    </div>
  );
}