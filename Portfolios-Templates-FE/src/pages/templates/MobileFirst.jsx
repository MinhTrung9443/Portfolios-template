import { parseSkillEntries } from "../../components/portfolio/parseBlockData";

export default function MobileFirst({ view, templatesById }) {
  const { owner, title, description, blocks } = view;

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex justify-center selection:bg-indigo-100">
      {/* Mobile Device Container */}
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* App Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {owner?.avatarUrl ? (
              <img src={owner.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                {owner?.fullName?.charAt(0) || "M"}
              </div>
            )}
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">{owner?.fullName || "User Profile"}</h1>
              <p className="text-xs text-gray-500">{title || "Portfolio"}</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-5 py-6 space-y-8 bg-gray-50 pb-24">
          {/* Bio Story */}
          {description && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-wide mb-2">About Me</h2>
              <p className="text-gray-700 leading-relaxed text-[15px]">{description}</p>
            </div>
          )}

          {/* Cards */}
          <div className="space-y-5">
            {blocks?.map((block) => {
              const meta = templatesById[block.templateId];
              const type = meta?.componentType;
              const data = block.data || {};

              if (type === "skills") {
                return (
                  <div key={block.id} className="bg-white rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{meta?.name || "Skills"}</h3>
                    <div className="flex flex-wrap gap-2">
                      {parseSkillEntries(data.skills || data.skillList).map((s, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[13px] font-semibold">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              if (type === "projects") {
                return (
                  <div key={block.id} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                    {(data.image || data.imageUrl) && (
                      <img src={data.image || data.imageUrl} alt="" className="w-full h-48 object-cover" />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900">{data.name || data.title}</h3>
                      <p className="text-gray-600 mt-2 text-sm line-clamp-3">{data.description}</p>
                      {data.liveUrl && (
                        <a href={data.liveUrl} target="_blank" rel="noreferrer" className="mt-4 block w-full py-3 bg-gray-900 text-white text-center rounded-xl font-semibold">
                          View Site
                        </a>
                      )}
                    </div>
                  </div>
                );
              }

              if (type === "experience" || type === "education") {
                return (
                  <div key={block.id} className="bg-white rounded-3xl p-6 shadow-sm border-l-4 border-indigo-500">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{data.startDate}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-3">{data.title || data.position || data.degree}</h3>
                    <p className="text-indigo-600 font-semibold text-sm mt-1">{data.company || data.institution}</p>
                    <p className="text-gray-600 mt-3 text-sm">{data.description}</p>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </main>
        
        {/* Bottom Nav App Style */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.47 3.84a.75.75 0 011.06 0l8.99 14.99a.75.75 0 01-.67 1.11H3.15a.75.75 0 01-.67-1.11l8.99-14.99z" /></svg>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg>
            <span className="text-[10px] font-medium">Network</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>
            <span className="text-[10px] font-medium">Contact</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
