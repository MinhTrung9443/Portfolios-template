/**
 * Normalise user-entered field values into arrays / objects for visuals.
 */

export function asString(raw) {
  if (raw == null) return "";
  return String(raw).trim();
}

/** JSON array or comma-separated */
export function parseStringList(raw) {
  const s = asString(raw);
  if (!s) return [];
  if (s.startsWith("[")) {
    try {
      const parsed = JSON.parse(s);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      /* fallthrough */
    }
  }
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

export function parseNumberList(raw) {
  return parseStringList(raw)
    .map((x) => Number.parseFloat(x))
    .filter((n) => !Number.isNaN(n));
}

/** Try JSON array of { name, label, value, ... } else fall back strings */
export function parseSkillEntries(raw) {
  const s = asString(raw);
  if (!s) return [];
  if (s.startsWith("[")) {
    try {
      const parsed = JSON.parse(s);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => {
        if (item && typeof item === "object") {
          const name = item.name ?? item.label ?? item.skill ?? "";
          const level = item.level ?? item.percent ?? item.percentage ?? item.score;
          return { name: String(name || ""), level: level != null ? Number(level) : null };
        }
        return { name: String(item), level: null };
      });
    } catch {
      /* fallthrough */
    }
  }
  return parseStringList(raw).map((name) => ({ name, level: null }));
}

export function omitKeys(obj, keys) {
  const k = new Set(keys);
  return Object.fromEntries(Object.entries(obj || {}).filter(([key]) => !k.has(key)));
}
