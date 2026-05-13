const fs = require('fs');
const path = require('path');

const baseDir = 'd:/TeraBoxDownload/Personal-PJ/Portfolios/Portfolios-Templates-FE/src/components/portfolio/blocks';

// Creating separate components for personal_info styles
const filesToCreate = {
  'personal_info/HeroBanner.jsx': `
import { asString } from '../../parseBlockData.js';

export default function HeroBanner({ data, accentClassName }) {
  const headline = asString(data.fullName || data.headline);
  const sub = asString(data.tagline || data.title || data.email || "");
  const bio = asString(data.bio || data.summary || "");

  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/[0.1]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-fuchsia-500/10 to-violet-600/25 opacity-90" aria-hidden />
      <div className={\`relative px-8 py-12 md:py-14 \${accentClassName || ''}\`}>
        <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/85">Introducing</h3>
        <p className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{headline || sub || "Portfolio owner"}</p>
        {(sub || bio) ? <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{bio || sub}</p> : null}
      </div>
    </div>
  );
}
`,
  'personal_info/ProfilePhoto.jsx': `
import { asString } from '../../parseBlockData.js';

export default function ProfilePhoto({ data, accentClassName }) {
  const headline = asString(data.fullName || data.headline);
  const sub = asString(data.tagline || data.title || data.email || "");
  const bio = asString(data.bio || data.summary || "");
  const avatarUrl = data.avatar ?? data.photoUrl ?? data.avatarUrl;
  const listKeys = [["email", data.email], ["phone", data.phone], ["address", data.address]];

  return (
    <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
      <div className="mx-auto shrink-0 sm:mx-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-32 w-32 rounded-2xl border border-white/15 object-cover shadow-lg" loading="lazy" />
        ) : (
          <div className={\`flex h-32 w-32 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] font-mono text-4xl font-bold \${accentClassName || ''}\`}>
            {(headline || "?").charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {headline ? <h3 className="text-2xl font-bold tracking-tight text-white">{headline}</h3> : null}
        {bio ? <p className={\`text-sm leading-relaxed text-white/70 \${accentClassName || ''}\`}>{bio}</p> : sub ? <p className={\`text-white/65 \${accentClassName || ''}\`}>{sub}</p> : null}
        <ul className="space-y-2 border-t border-white/10 pt-4 font-mono text-sm text-white/75">
          {listKeys.filter(([, v]) => asString(v)).map(([k, v]) => (
            <li key={k} className="flex gap-3">
              <span className="w-28 shrink-0 uppercase text-[11px] text-white/35">{k}</span>
              <span className="break-all">{asString(v)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
`,
  'personal_info/SimpleCard.jsx': `
import ProfilePhoto from './ProfilePhoto';

// Reusing ProfilePhoto layout for now as they share similar styling in the original
export default function SimpleCard(props) {
  return <ProfilePhoto {...props} />;
}
`,
  'personal_info/MinimalList.jsx': `
import ProfilePhoto from './ProfilePhoto';

// Reusing layout for minimal_list as it was grouped together originally
export default function MinimalList(props) {
  return <ProfilePhoto {...props} />;
}
`,
  'personal_info/PersonalInfoDefault.jsx': `
import { KeyValueResidual } from '../shared/KeyValueResidual';

const PERSON_CARD_KEYS = [
  "fullName",
  "headline",
  "tagline",
  "title",
  "email",
  "phone",
  "address",
  "bio",
  "summary",
  "avatar",
  "photoUrl",
  "avatarUrl",
];

export default function PersonalInfoDefault({ data, p }) {
  return <KeyValueResidual entries={Object.entries(data).filter(([k]) => !PERSON_CARD_KEYS.includes(k))} p={p} />;
}
`
};

for (const [relPath, content] of Object.entries(filesToCreate)) {
  fs.writeFileSync(path.join(baseDir, relPath), content);
}

// Update Registry
const registryFile = `
// Import individual styles
import HeroBanner from './personal_info/HeroBanner';
import ProfilePhoto from './personal_info/ProfilePhoto';
import SimpleCard from './personal_info/SimpleCard';
import MinimalList from './personal_info/MinimalList';
import PersonalInfoDefault from './personal_info/PersonalInfoDefault';

// Import grouped blocks
import SkillsBlock from './skills/SkillsBlock';
import TimelineExperience from './experience/TimelineExperience';
import ProjectsBlock from './projects/ProjectsBlock';
import CertificatesBlock from './certificates/CertificatesBlock';
import ContactBlock from './contact/ContactBlock';
import { BarChartWrapped, LineChartLive, DonutLive, StatsLive } from './charts/ChartsBlocks';

// Now registry can map specific styles or fall back to component types
export const BlockRegistry = {
  // --- By Specific Style (componentType_style) ---
  "personal_info_hero_banner": HeroBanner,
  "personal_info_profile_photo": ProfilePhoto,
  "personal_info_simple_card": SimpleCard,
  "personal_info_minimal_list": MinimalList,
  
  // --- Fallbacks by Component Type ---
  "personal_info": PersonalInfoDefault,
  "skills": SkillsBlock,
  "experience": TimelineExperience,
  "education": TimelineExperience,
  "projects": ProjectsBlock,
  "certificates": CertificatesBlock,
  "contact": ContactBlock,
  
  "chart_bar": BarChartWrapped,
  "chart_line": LineChartLive,
  "chart_donut": DonutLive,
  "stats_row": StatsLive,
};

export const getComponentForBlock = (meta) => {
  if (!meta) return null;
  const type = meta.componentType || "";
  const style = meta.defaultConfig?.style || "";
  
  // 1. Try finding an exact match (e.g. personal_info_hero_banner)
  const exactMatchId = \`\${type}_\${style}\`;
  if (BlockRegistry[exactMatchId]) {
    return BlockRegistry[exactMatchId];
  }
  
  // 2. Try falling back to the general componentType
  if (BlockRegistry[type]) {
    return BlockRegistry[type];
  }
  
  return null;
};
`;

fs.writeFileSync(path.join(baseDir, 'BlockRegistry.jsx'), registryFile);

// Remove the old combined PersonalInfoBlock.jsx
try {
  fs.unlinkSync(path.join(baseDir, 'personal_info/PersonalInfoBlock.jsx'));
} catch(e) {}

console.log("Personal info split complete.");
