// Generate SVG movie poster placeholders that look like actual posters
// These work completely offline with no external dependencies

const colors = [
  { bg: '#6D28D9', accent: '#8B5CF6', text: '#ffffff' }, // Purple
  { bg: '#8B5CF6', accent: '#A78BFA', text: '#ffffff' }, // Light Purple
  { bg: '#1a0933', accent: '#6D28D9', text: '#F5F3FF' }, // Dark Purple
  { bg: '#5B21B6', accent: '#7C3AED', text: '#ffffff' }, // Violet
  { bg: '#7C3AED', accent: '#9333EA', text: '#ffffff' }, // Medium Purple
  { bg: '#0B0616', accent: '#6D28D9', text: '#F5F3FF' }, // Very Dark
  { bg: '#2d1b4e', accent: '#8B5CF6', text: '#F5F3FF' }, // Mid Dark
  { bg: '#9333EA', accent: '#A855F7', text: '#ffffff' }, // Bright Purple
];

interface PosterConfig {
  title: string;
  subtitle?: string;
  year?: number;
  rating?: number;
  index?: number | string;
}

export function generateMoviePosterSVG({
  title,
  subtitle,
  year,
  rating,
  index = 0,
}: PosterConfig): string {
  const numIndex = typeof index === 'string' ? parseInt(index) || 0 : index;
  const colorScheme = colors[numIndex % colors.length];

  // Create a visually interesting poster with geometric shapes
  const svg = `
<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${numIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorScheme.accent};stop-opacity:1" />
    </linearGradient>
    <pattern id="grid${numIndex}" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="none" stroke="${colorScheme.accent}" stroke-width="0.5" opacity="0.1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="400" height="600" fill="url(#grad${numIndex})"/>

  <!-- Pattern overlay -->
  <rect width="400" height="600" fill="url(#grid${numIndex})"/>

  <!-- Decorative geometric shapes -->
  <circle cx="320" cy="80" r="60" fill="${colorScheme.accent}" opacity="0.15"/>
  <circle cx="80" cy="520" r="50" fill="${colorScheme.accent}" opacity="0.15"/>
  <rect x="150" y="200" width="100" height="100" fill="${colorScheme.accent}" opacity="0.1" transform="rotate(45 200 250)"/>

  <!-- Film strip decoration at top -->
  <rect width="400" height="8" fill="${colorScheme.accent}" opacity="0.3"/>
  <rect y="592" width="400" height="8" fill="${colorScheme.accent}" opacity="0.3"/>

  <!-- Title area with background -->
  <rect x="20" y="420" width="360" height="140" rx="10" fill="#000000" opacity="0.4"/>

  <!-- Title text -->
  <text x="200" y="465" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${colorScheme.text}" text-anchor="middle">
    ${escapeXml(truncate(title, 20))}
  </text>

  ${subtitle ? `
  <text x="200" y="495" font-family="Arial, sans-serif" font-size="16" fill="${colorScheme.text}" opacity="0.9" text-anchor="middle">
    ${escapeXml(truncate(subtitle, 30))}
  </text>
  ` : ''}

  ${year ? `
  <text x="200" y="${subtitle ? '525' : '505'}" font-family="Arial, sans-serif" font-size="14" fill="${colorScheme.text}" opacity="0.8" text-anchor="middle">
    ${year}
  </text>
  ` : ''}

  ${rating ? `
  <g transform="translate(200, ${subtitle ? '545' : '525'})">
    <circle r="20" fill="${colorScheme.accent}"/>
    <text y="7" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${colorScheme.text}" text-anchor="middle">
      ${rating.toFixed(1)}
    </text>
  </g>
  ` : ''}

  <!-- Cinema symbol -->
  <g transform="translate(200, 150)">
    <circle r="50" fill="none" stroke="${colorScheme.text}" stroke-width="3" opacity="0.3"/>
    <polygon points="0,-15 20,10 -20,10" fill="${colorScheme.text}" opacity="0.3"/>
  </g>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function generateActorPosterSVG({
  title,
  subtitle,
  index = 0,
}: PosterConfig): string {
  const numIndex = typeof index === 'string' ? parseInt(index) || 0 : index;
  const colorScheme = colors[numIndex % colors.length];

  const svg = `
<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="actorGrad${numIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorScheme.accent};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="600" fill="url(#actorGrad${numIndex})"/>

  <!-- Silhouette circle -->
  <circle cx="200" cy="200" r="100" fill="${colorScheme.text}" opacity="0.3"/>
  <circle cx="200" cy="180" r="40" fill="${colorScheme.text}" opacity="0.3"/>

  <!-- Name area -->
  <rect x="20" y="450" width="360" height="100" rx="10" fill="#000000" opacity="0.4"/>

  <text x="200" y="490" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${colorScheme.text}" text-anchor="middle">
    ${escapeXml(truncate(title, 20))}
  </text>

  ${subtitle ? `
  <text x="200" y="520" font-family="Arial, sans-serif" font-size="14" fill="${colorScheme.text}" opacity="0.8" text-anchor="middle">
    ${escapeXml(truncate(subtitle, 30))}
  </text>
  ` : ''}
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function generateBannerSVG({
  title,
  subtitle,
  index = 0,
}: PosterConfig): string {
  const numIndex = typeof index === 'string' ? parseInt(index) || 0 : index;
  const colorScheme = colors[numIndex % colors.length];

  const svg = `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bannerGrad${numIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${colorScheme.accent};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="spotlight${numIndex}">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bannerGrad${numIndex})"/>

  <!-- Spotlight effect -->
  <circle cx="960" cy="540" r="600" fill="url(#spotlight${numIndex})"/>

  <!-- Geometric decoration -->
  <circle cx="1600" cy="200" r="150" fill="${colorScheme.accent}" opacity="0.15"/>
  <circle cx="320" cy="880" r="120" fill="${colorScheme.accent}" opacity="0.15"/>

  <!-- Title area -->
  <rect x="160" y="400" width="1600" height="280" rx="20" fill="#000000" opacity="0.3"/>

  <text x="960" y="520" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="${colorScheme.text}" text-anchor="middle">
    ${escapeXml(truncate(title, 25))}
  </text>

  ${subtitle ? `
  <text x="960" y="610" font-family="Arial, sans-serif" font-size="40" fill="${colorScheme.text}" opacity="0.9" text-anchor="middle">
    ${escapeXml(truncate(subtitle, 40))}
  </text>
  ` : ''}
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function generateAvatarSVG({
  title,
  index = 0,
}: PosterConfig): string {
  const numIndex = typeof index === 'string' ? parseInt(index) || 0 : index;
  const colorScheme = colors[numIndex % colors.length];
  const initials = getInitials(title);

  const svg = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avatarGrad${numIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorScheme.accent};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="100" cy="100" r="100" fill="url(#avatarGrad${numIndex})"/>

  <!-- Initials -->
  <text x="100" y="125" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="${colorScheme.text}" text-anchor="middle">
    ${initials}
  </text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Helper functions
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1) + '…';
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
