import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { portfolioAPI, templateAPI, userAPI } from "../api";

const THEME_OPTIONS = [
  { id: "minimal_dev", label: "Minimal Developer" },
  { id: "creative_designer", label: "Creative Designer" },
  { id: "corporate_pro", label: "Corporate Professional" },
  { id: "glassmorphism", label: "Modern Glassmorphism" },
  { id: "cyberpunk", label: "Retro / Cyberpunk" },
  { id: "mobile_first", label: "Mobile First" },
];

function newBlock(template) {
  const data = {};
  (template.requiredFields || []).forEach((field) => {
    data[field] = "";
  });
  return {
    id: crypto.randomUUID(),
    templateId: template.id,
    data,
  };
}

function Portfolio() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    themeKey: "default",
    blocks: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const templatesById = useMemo(() => Object.fromEntries(templates.map((t) => [t.id, t])), [templates]);

  const groupedTemplates = useMemo(() => {
    const groups = {};
    templates.forEach((t) => {
      const cat = t.category || "other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    Object.values(groups).forEach((arr) => arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)));
    return groups;
  }, [templates]);

  useEffect(() => {
    fetchTemplates();
    if (portfolioId) {
      fetchPortfolio();
    } else {
      setIsLoading(false);
    }
  }, [portfolioId]);

  const fetchTemplates = async () => {
    try {
      const response = await templateAPI.getAllTemplates();
      setTemplates(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio(portfolioId);
      const portfolio = response.data.data;
      setFormData({
        title: portfolio.title || "",
        description: portfolio.description || "",
        themeKey: portfolio.themeKey || "default",
        blocks: portfolio.blocks?.length ? portfolio.blocks : [],
      });
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addBlock = (template) => {
    const block = newBlock(template);
    setFormData({ ...formData, blocks: [...formData.blocks, block] });
    setPickerOpen(false);
  };

  const removeBlock = (blockId) => {
    setFormData({
      ...formData,
      blocks: formData.blocks.filter((b) => b.id !== blockId),
    });
  };

  const moveBlock = (index, delta) => {
    const next = index + delta;
    if (next < 0 || next >= formData.blocks.length) return;
    const copy = [...formData.blocks];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setFormData({ ...formData, blocks: copy });
  };

  const updateBlockField = (blockId, fieldKey, value) => {
    setFormData({
      ...formData,
      blocks: formData.blocks.map((b) =>
        b.id === blockId ? { ...b, data: { ...b.data, [fieldKey]: value } } : b
      ),
    });
  };

  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...formData,
        themeKey: formData.themeKey || "default",
        blocks: formData.blocks,
      };
      if (portfolioId) {
        await portfolioAPI.updatePortfolio(portfolioId, payload);
        setMessage({ type: "success", text: "Portfolio updated successfully!" });
      } else {
        await portfolioAPI.createPortfolio(payload);
        setMessage({ type: "success", text: "Portfolio created successfully!" });
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to save portfolio." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      await portfolioAPI.deletePortfolio(portfolioId);
      navigate("/dashboard");
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete portfolio." });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{portfolioId ? "Edit Portfolio" : "Create Portfolio"}</h1>

      {message.text && (
        <div className={`mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Info</h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Page theme</h2>
          <p className="text-gray-600 text-sm mb-4">
            Applies global styling presets to your portfolio. Individual sections keep their layout template below.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFormData({ ...formData, themeKey: t.id })}
                className={`border rounded-lg p-3 text-left text-sm transition ${
                  formData.themeKey === t.id ? "border-primary bg-indigo-50 ring-2 ring-primary/40" : "hover:shadow-md border-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap justify-between gap-4 items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">Content blocks</h2>
              <p className="text-gray-600 text-sm mt-1">
                Stack multiple sections — hero, charts, timelines, skills, and more — in the order you prefer.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 transition whitespace-nowrap"
            >
              + Add block
            </button>
          </div>

          {formData.blocks.length === 0 ? (
            <p className="text-gray-500 py-8 text-center border border-dashed rounded-lg">
              No blocks yet. Tap &quot;Add block&quot; and pick a catalog layout.
            </p>
          ) : (
            <ul className="space-y-4">
              {formData.blocks.map((block, idx) => {
                const meta = templatesById[block.templateId];
                const fields = meta?.requiredFields?.length ? meta.requiredFields : Object.keys(block.data || {});
                return (
                  <li key={block.id} className="border rounded-lg p-4 bg-gray-50/80">
                    <div className="flex flex-wrap justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{meta?.name || "Unknown template"}</h3>
                        <p className="text-xs text-gray-500">
                          {meta?.category} · <span className="font-mono">{block.templateId}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, -1)}
                          disabled={idx === 0}
                          className="px-2 py-1 text-sm border rounded disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 1)}
                          disabled={idx === formData.blocks.length - 1}
                          className="px-2 py-1 text-sm border rounded disabled:opacity-40"
                        >
                          Down
                        </button>
                        <button type="button" onClick={() => removeBlock(block.id)} className="px-2 py-1 text-sm text-red-600 border border-red-200 rounded">
                          Remove
                        </button>
                      </div>
                    </div>

                    {!meta && (
                      <p className="text-amber-700 text-sm mb-2">
                        Catalog entry missing — saving may still persist this template id until you swap the block out.
                      </p>
                    )}

                    <div className="space-y-3">
                      {fields.map((key) => (
                        <div key={`${block.id}-${key}`}>
                          <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wide mb-1">{key}</label>
                            {(() => {
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
                            })()}
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {pickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pick a layout</h3>
                <button type="button" onClick={() => setPickerOpen(false)} className="text-gray-500 hover:text-gray-800">
                  Close
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-6">
                {Object.entries(groupedTemplates).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">{category.replace(/_/g, " ")}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {items.map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => addBlock(template)}
                          className="text-left border rounded-lg p-3 hover:border-primary hover:bg-indigo-50/60 transition"
                        >
                          <div className="font-medium text-gray-900">{template.name}</div>
                          <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          <span className="inline-block mt-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded">{template.componentType}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <div>
            {portfolioId && (
              <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={() => navigate("/dashboard")} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Portfolio;
