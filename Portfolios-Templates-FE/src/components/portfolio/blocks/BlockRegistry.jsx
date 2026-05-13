
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
  const exactMatchId = `${type}_${style}`;
  if (BlockRegistry[exactMatchId]) {
    return BlockRegistry[exactMatchId];
  }
  
  // 2. Try falling back to the general componentType
  if (BlockRegistry[type]) {
    return BlockRegistry[type];
  }
  
  return null;
};
