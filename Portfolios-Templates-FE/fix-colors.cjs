const fs = require('fs');
const file = 'd:/TeraBoxDownload/Personal-PJ/Portfolios/Portfolios-Templates-FE/src/components/portfolio/PortfolioBlockDisplay.jsx';
let content = fs.readFileSync(file, 'utf8');

// The strategy is to wrap className strings in template literals where needed.
// First, we need to ensure all className="..." are converted to className={`...`}
content = content.replace(/className="([^"]+)"/g, 'className={`$1`}');

// Then replace specific text-white / bg-black classes with ${p?.textMain || 'text-white'} etc.
// But some classes are already inside template literals. 
content = content.replace(/text-white\/95/g, '${p?.textMain || \'text-white/95\'}');
content = content.replace(/text-white\/90/g, '${p?.textMain || \'text-white/90\'}');
content = content.replace(/text-white\/85/g, '${p?.textMain || \'text-white/85\'}');
content = content.replace(/text-white\/80/g, '${p?.textMuted || \'text-white/80\'}');
content = content.replace(/text-white\/75/g, '${p?.textMuted || \'text-white/75\'}');
content = content.replace(/text-white\/70/g, '${p?.textMuted || \'text-white/70\'}');
content = content.replace(/text-white\/65/g, '${p?.textMuted || \'text-white/65\'}');
content = content.replace(/text-white\/55/g, '${p?.textMuted || \'text-white/55\'}');
content = content.replace(/text-white\/50/g, '${p?.textMuted || \'text-white/50\'}');
content = content.replace(/text-white\/45/g, '${p?.textMuted || \'text-white/45\'}');
content = content.replace(/text-white\/35/g, '${p?.textMuted || \'text-white/35\'}');
content = content.replace(/\btext-white\b(?!\/)/g, '${p?.textMain || \'text-white\'}');

content = content.replace(/bg-black\/35/g, '${p?.bgCard || \'bg-black/35\'}');
content = content.replace(/bg-black\/30/g, '${p?.bgCard || \'bg-black/30\'}');
content = content.replace(/bg-black\/25/g, '${p?.bgCard || \'bg-black/25\'}');
content = content.replace(/bg-black\/20/g, '${p?.bgCard || \'bg-black/20\'}');

content = content.replace(/border-white\/\[0\.08\]/g, '${p?.borderCard || \'border-white/[0.08]\'}');
content = content.replace(/border-white\/\[0\.06\]/g, '${p?.borderCard || \'border-white/[0.06]\'}');
content = content.replace(/border-white\/\[0\.04\]/g, '${p?.borderCard || \'border-white/[0.04]\'}');
content = content.replace(/border-white\/10/g, '${p?.borderCard || \'border-white/10\'}');
content = content.replace(/border-white\/15/g, '${p?.borderCard || \'border-white/15\'}');

fs.writeFileSync(file, content);
console.log('Replaced styling classes successfully.');
