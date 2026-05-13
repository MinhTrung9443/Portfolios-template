import { PortfolioBlockList } from "../../components/portfolio/PortfolioBlockDisplay";

const pCorporatePro = {
  block: "bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 mb-6 last:mb-0",
  badgeCat: "bg-slate-100 text-slate-700 border border-slate-200",
  monoMuted: "text-slate-500 font-medium",
  monoLabel: "text-blue-600",
  dt: "text-slate-500",
  dd: "text-slate-900 font-medium",
};

export default function CorporatePro({ view, templatesById }) {
  const { owner, title, description, blocks } = view;
  
  const leftBlocks = blocks?.filter(b => ["skills", "contact", "personal_info"].includes(templatesById[b.templateId]?.componentType));
  const rightBlocks = blocks?.filter(b => !["skills", "contact", "personal_info"].includes(templatesById[b.templateId]?.componentType));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-slate-900">{owner?.fullName || "Professional"}</div>
          <div className="flex gap-4">
            <a href="#portfolio" className="text-sm font-medium text-slate-600 hover:text-blue-600">Portfolio</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {/* Left Column (Profile Card & Skills) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-24 bg-slate-200 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80" />
            </div>
            <div className="px-6 pb-6 relative">
              <div className="relative -mt-12 mb-4 w-24 h-24 mx-auto rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
                {owner?.avatarUrl ? (
                  <img src={owner.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
                    {owner?.fullName?.charAt(0) || "P"}
                  </div>
                )}
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-slate-900">{owner?.fullName || "Full Name"}</h1>
                <p className="text-sm text-slate-600 mt-1">{title || "Professional Title"}</p>
                <p className="text-xs text-slate-500 mt-3 whitespace-pre-wrap">{description || owner?.bio}</p>
              </div>
            </div>
          </div>

          <PortfolioBlockList blocks={leftBlocks ?? []} templatesById={templatesById} p={pCorporatePro} accentKey="default" />
        </div>

        {/* Right Column (Experience & Projects) */}
        <div className="md:col-span-2 space-y-6" id="portfolio">
          <PortfolioBlockList blocks={rightBlocks ?? []} templatesById={templatesById} p={pCorporatePro} accentKey="default" />
        </div>
      </main>
    </div>
  );
}