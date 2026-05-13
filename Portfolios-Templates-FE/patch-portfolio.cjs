const fs = require('fs');
const file = 'd:/TeraBoxDownload/Personal-PJ/Portfolios/Portfolios-Templates-FE/src/pages/Portfolio.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('userAPI')) {
    content = content.replace('import { portfolioAPI, templateAPI } from "../api";', 'import { portfolioAPI, templateAPI, userAPI } from "../api";');
}

const uploaderLogic = `
  const handleImageUpload = async (e, blockId, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await userAPI.uploadAvatar(formData);
      const url = res.data?.data?.url;
      if (url) {
        updateBlockField(blockId, key, url);
      }
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Failed to upload image: " + (err.response?.data?.message || err.message));
    }
  };

  const SkillBuilder = ({ value, onChange }) => {
    let parsed = [];
    try {
      if (typeof value === "string" && value.startsWith("[")) {
        parsed = JSON.parse(value);
      } else if (typeof value === "string" && value.trim()) {
        parsed = value.split(",").map(s => ({ name: s.trim(), level: null }));
      }
    } catch (e) {
      parsed = [];
    }
    if (!Array.isArray(parsed)) parsed = [];

    const updateSkill = (index, field, val) => {
      const next = [...parsed];
      if (typeof next[index] !== 'object') next[index] = { name: String(next[index]) };
      next[index] = { ...next[index], [field]: val };
      onChange(JSON.stringify(next));
    };
    const removeSkill = (index) => {
      const next = parsed.filter((_, i) => i !== index);
      onChange(JSON.stringify(next));
    };
    const addSkill = () => {
      const next = [...parsed, { name: "", level: 50 }];
      onChange(JSON.stringify(next));
    };

    return (
      <div className="space-y-2 border border-gray-200 p-3 rounded-md bg-gray-50/50">
        {parsed.map((sk, i) => {
           const name = typeof sk === 'object' && sk !== null ? (sk.name || sk.label || sk.skill || "") : String(sk || "");
           const level = typeof sk === 'object' && sk !== null ? sk.level : null;
           return (
             <div key={i} className="flex gap-2 items-center">
               <input type="text" placeholder="Skill name" value={name} onChange={e => updateSkill(i, 'name', e.target.value)} className="flex-1 px-2 py-1 text-sm border rounded" />
               <input type="number" placeholder="%" min="0" max="100" value={level || ""} onChange={e => updateSkill(i, 'level', e.target.value ? Number(e.target.value) : null)} className="w-20 px-2 py-1 text-sm border rounded" />
               <button type="button" onClick={() => removeSkill(i)} className="text-red-500 text-sm px-2 font-bold hover:bg-red-50 rounded">X</button>
             </div>
           );
        })}
        <button type="button" onClick={addSkill} className="text-xs bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300 font-medium">+ Add Skill</button>
      </div>
    );
  };
`;

if (!content.includes('handleImageUpload')) {
    content = content.replace('const handleSubmit = async (e) => {', uploaderLogic + '\n  const handleSubmit = async (e) => {');
}

const inputLogic = `                            {(() => {
                              const lower = key.toLowerCase();
                              const isImage = ["avatar", "image", "thumbnail", "photourl", "avatarurl", "screenshot", "logo"].includes(lower);
                              const isSkills = ["skills", "skilllist"].includes(lower);
                              const long =
                                ["bio", "body", "summary", "markdown"].includes(lower) ||
                                lower.endsWith("description");

                              if (isImage) {
                                return (
                                  <div className="flex items-center gap-3">
                                    {block.data?.[key] && <img src={block.data[key]} alt="preview" className="h-12 w-12 object-cover rounded border bg-gray-100" />}
                                    <div className="flex flex-col gap-2 flex-1">
                                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, block.id, key)} className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary hover:file:bg-indigo-100" />
                                      <input type="text" value={block.data?.[key] ?? ""} onChange={(e) => updateBlockField(block.id, key, e.target.value)} placeholder="Or paste image URL" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                                    </div>
                                  </div>
                                );
                              }

                              if (isSkills) {
                                return <SkillBuilder value={block.data?.[key] ?? ""} onChange={(val) => updateBlockField(block.id, key, val)} />;
                              }

                              return long ? (
                                <textarea
                                  value={block.data?.[key] ?? ""}
                                  onChange={(e) => updateBlockField(block.id, key, e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={block.data?.[key] ?? ""}
                                  onChange={(e) => updateBlockField(block.id, key, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                  placeholder={
                                    ["labels", "values", "series", "segments", "metrics"].includes(lower)
                                      ? "JSON array or comma-separated values"
                                      : ""
                                  }
                                />
                              );
                            })()}`;

const oldInputLogic = `                            {(() => {
                              const lower = key.toLowerCase();
                              const long =
                                ["bio", "skills", "body", "summary", "markdown"].includes(lower) ||
                                lower.endsWith("description");
                              return long ? (
                                <textarea
                                  value={block.data?.[key] ?? ""}
                                  onChange={(e) => updateBlockField(block.id, key, e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={block.data?.[key] ?? ""}
                                  onChange={(e) => updateBlockField(block.id, key, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                  placeholder={
                                    ["labels", "values", "series", "segments", "metrics"].includes(lower)
                                      ? "JSON array or comma-separated values"
                                      : ""
                                  }
                                />
                              );
                            })()}`;

content = content.replace(oldInputLogic, inputLogic);

fs.writeFileSync(file, content);
console.log('Patched Portfolio.jsx successfully.');
