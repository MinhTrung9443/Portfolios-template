import { parseSkillEntries } from "../../components/portfolio/parseBlockData";

export default function CorporatePro({ view, templatesById }) {
  const { owner, title, description, blocks } = view;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-slate-900">{owner?.fullName || "Professional"}</div>
          <div className="flex gap-4">
            <a href="#experience" className="text-sm font-medium text-slate-600 hover:text-blue-600">Experience</a>
            <a href="#projects" className="text-sm font-medium text-slate-600 hover:text-blue-600">Projects</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {/* Left Column (Profile Card) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-24 bg-slate-200 relative">
              <img src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800&h=200" alt="cover" className="w-full h-full object-cover" />
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

          {/* Skills Block */}
          {blocks?.filter(b => templatesById[b.templateId]?.componentType === "skills").map(block => (
            <div key={block.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900 mb-4">Skills & Endorsements</h2>
              <div className="flex flex-wrap gap-2">
                {parseSkillEntries(block.data.skills || block.data.skillList).map((s, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded hover:bg-slate-200 transition">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (Experience & Projects) */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience / Education */}
          <div id="experience" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-xl text-slate-900 mb-6">Experience</h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent hidden-before-mobile">
              {blocks?.filter(b => ["experience", "education"].includes(templatesById[b.templateId]?.componentType)).map((block, idx) => {
                const data = block.data;
                return (
                  <div key={block.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-500 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-2 md:translate-x-0"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm ml-8 md:ml-0">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900">{data.title || data.position || data.degree}</div>
                        <time className="font-caveat font-medium text-blue-600 text-xs">{data.startDate}</time>
                      </div>
                      <div className="text-sm font-medium text-slate-500 mb-2">{data.company || data.institution}</div>
                      <div className="text-slate-600 text-sm">{data.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects */}
          <div id="projects" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-xl text-slate-900 mb-6">Featured Projects</h2>
            <div className="grid gap-6">
              {blocks?.filter(b => templatesById[b.templateId]?.componentType === "projects").map((block) => {
                const data = block.data;
                return (
                  <div key={block.id} className="flex flex-col sm:flex-row gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    {(data.image || data.imageUrl) && (
                      <img src={data.image || data.imageUrl} alt="" className="w-full sm:w-48 h-32 object-cover rounded-lg border border-slate-200" />
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{data.name || data.title}</h3>
                      <p className="text-sm text-slate-600 mt-2 mb-3">{data.description}</p>
                      {data.liveUrl && (
                        <a href={data.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                          View Project &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
