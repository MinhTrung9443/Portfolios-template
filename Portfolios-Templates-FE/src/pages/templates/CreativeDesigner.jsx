import { parseSkillEntries } from "../../components/portfolio/parseBlockData";

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
        <section className="space-y-32">
          {blocks?.map((block) => {
            const meta = templatesById[block.templateId];
            const type = meta?.componentType;
            const data = block.data || {};

            if (type === "projects") {
              return (
                <div key={block.id} className="grid md:grid-cols-12 gap-8 items-center group">
                  <div className="md:col-span-7 overflow-hidden rounded-3xl shadow-xl transition duration-500 group-hover:scale-[1.02]">
                    {data.image || data.imageUrl ? (
                      <img src={data.image || data.imageUrl} alt="" className="w-full h-[400px] object-cover" />
                    ) : (
                      <div className="w-full h-[400px] bg-gradient-to-br from-indigo-400 to-purple-400"></div>
                    )}
                  </div>
                  <div className="md:col-span-5 space-y-6 md:pl-8">
                    <h3 className="text-4xl font-black">{data.name || data.title}</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">{data.description}</p>
                    <div className="flex gap-4 pt-4">
                      {data.liveUrl && (
                        <a href={data.liveUrl} className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-rose-500 transition">View Project</a>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            if (type === "skills") {
              return (
                <div key={block.id} className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100">
                  <h3 className="text-2xl font-black mb-8 text-center">{meta?.name || "Expertise"}</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {parseSkillEntries(data.skills || data.skillList).map((s, idx) => (
                      <span key={idx} className="px-6 py-3 bg-slate-50 text-slate-900 font-bold rounded-full text-sm hover:bg-rose-100 hover:text-rose-600 transition">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            if (type === "experience" || type === "education") {
              return (
                <div key={block.id} className="max-w-3xl mx-auto space-y-4 text-center">
                  <span className="text-rose-500 font-bold tracking-widest uppercase text-sm">{data.startDate} — {data.endDate || "Present"}</span>
                  <h3 className="text-3xl font-black">{data.title || data.position || data.degree}</h3>
                  <p className="text-xl font-medium text-slate-500">{data.company || data.institution}</p>
                  <p className="text-slate-600 max-w-2xl mx-auto mt-4">{data.description}</p>
                </div>
              );
            }

            return null;
          })}
        </section>
      </main>
    </div>
  );
}
