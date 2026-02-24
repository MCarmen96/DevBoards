/**
 * Generates SVG component preview images for seed pins.
 * No external dependencies -- only Node.js built-ins.
 * Usage: node prisma/generate-seed-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'uploads', 'seeds');
fs.mkdirSync(OUT, { recursive: true });

const W = 800, H = 600;

const images = {

'glassmorphism-button.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#667eea"/>
    <stop offset="50%" stop-color="#764ba2"/>
    <stop offset="100%" stop-color="#f093fb"/>
  </linearGradient>
  <filter id="blur"><feGaussianBlur stdDeviation="10"/></filter>
  <linearGradient id="btn2" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#667eea"/>
    <stop offset="100%" stop-color="#764ba2"/>
  </linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<circle cx="200" cy="150" r="130" fill="#f093fb" opacity="0.3" filter="url(#blur)"/>
<circle cx="600" cy="440" r="110" fill="#667eea" opacity="0.35" filter="url(#blur)"/>
<rect x="200" y="170" width="400" height="260" rx="28" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
<text x="400" y="250" font-family="system-ui" font-size="15" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-weight="500">Glass UI Component</text>
<rect x="260" y="265" width="280" height="62" rx="14" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
<text x="400" y="304" font-family="'Segoe UI',system-ui" font-size="20" font-weight="700" fill="white" text-anchor="middle">✨  Get Started</text>
<rect x="260" y="350" width="280" height="58" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
<text x="400" y="386" font-family="'Segoe UI',system-ui" font-size="19" font-weight="600" fill="rgba(255,255,255,0.65)" text-anchor="middle">Learn More</text>
<rect x="200" y="460" width="400" height="90" rx="14" fill="rgba(0,0,0,0.25)"/>
<text x="220" y="485" font-family="monospace" font-size="13" fill="rgba(102,126,234,0.9)">.glass-button {</text>
<text x="236" y="504" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.55)">background: rgba(255,255,255,0.15);</text>
<text x="236" y="521" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.55)">backdrop-filter: blur(12px);</text>
<text x="220" y="540" font-family="monospace" font-size="13" fill="rgba(102,126,234,0.9)">}</text>
</svg>`,

'neon-button.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <filter id="neon"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="neonBig"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="${W}" height="${H}" fill="#06060a"/>
<circle cx="400" cy="300" r="220" fill="#0ff" opacity="0.025" filter="url(#neonBig)"/>
<text x="400" y="60" font-family="monospace" font-size="13" fill="rgba(0,255,255,0.25)" text-anchor="middle">/* CSS Neon Glow Effect */</text>
<rect x="185" y="120" width="430" height="88" rx="10" fill="none" stroke="#0ff" stroke-width="8" opacity="0.08"/>
<rect x="185" y="120" width="430" height="88" rx="10" fill="none" stroke="#0ff" stroke-width="2" filter="url(#neon)"/>
<text x="400" y="176" font-family="'Courier New',monospace" font-size="34" font-weight="900" text-anchor="middle" fill="#0ff" filter="url(#neon)" letter-spacing="9">LAUNCH APP</text>
<rect x="185" y="235" width="430" height="88" rx="10" fill="none" stroke="#f0f" stroke-width="8" opacity="0.08"/>
<rect x="185" y="235" width="430" height="88" rx="10" fill="none" stroke="#f0f" stroke-width="2" filter="url(#neon)"/>
<text x="400" y="290" font-family="'Courier New',monospace" font-size="34" font-weight="900" text-anchor="middle" fill="#f0f" filter="url(#neon)" letter-spacing="7">CONNECT</text>
<rect x="185" y="350" width="430" height="88" rx="10" fill="rgba(255,240,0,0.04)" stroke="#ff0" stroke-width="2" filter="url(#neon)"/>
<text x="400" y="404" font-family="'Courier New',monospace" font-size="34" font-weight="900" text-anchor="middle" fill="#ff0" filter="url(#neon)" letter-spacing="5">EXPLORE</text>
<rect x="100" y="468" width="600" height="96" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(0,255,255,0.12)" stroke-width="1"/>
<text x="120" y="492" font-family="monospace" font-size="12" fill="rgba(0,255,255,0.6)">.neon-btn {</text>
<text x="136" y="511" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.4)">border: 2px solid #0ff;</text>
<text x="136" y="530" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.4)">box-shadow: 0 0 10px #0ff, 0 0 30px #0ff, 0 0 60px #0ff;</text>
<text x="120" y="549" font-family="monospace" font-size="12" fill="rgba(0,255,255,0.6)">}</text>
</svg>`,

'3d-card.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="scene" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#0f3460"/></linearGradient>
  <linearGradient id="imgG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient>
  <filter id="sh"><feDropShadow dx="20" dy="28" stdDeviation="22" flood-color="rgba(0,0,0,0.55)"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#scene)"/>
<text x="400" y="46" font-family="system-ui" font-size="16" font-weight="700" fill="rgba(255,255,255,0.45)" text-anchor="middle">CSS 3D Transform on Hover</text>
<rect x="460" y="90" width="240" height="310" rx="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
<rect x="480" y="108" width="200" height="130" rx="12" fill="url(#imgG)" opacity="0.55"/>
<text x="580" y="280" font-family="system-ui" font-size="16" font-weight="600" fill="rgba(255,255,255,0.35)" text-anchor="middle">Default</text>
<text x="580" y="302" font-family="system-ui" font-size="13" fill="rgba(255,255,255,0.2)" text-anchor="middle">transform: none</text>
<text x="418" y="250" font-family="system-ui" font-size="32" fill="rgba(255,255,255,0.15)" text-anchor="middle">←</text>
<g filter="url(#sh)" transform="matrix(0.965,0,-0.09,0.985,20,12)">
  <rect x="66" y="82" width="272" height="338" rx="20" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
  <rect x="84" y="100" width="236" height="148" rx="12" fill="url(#imgG)"/>
  <circle cx="130" cy="174" r="32" fill="rgba(255,255,255,0.15)"/>
  <text x="200" y="170" font-family="system-ui" font-size="18" fill="rgba(255,255,255,0.5)">◆◆</text>
  <text x="202" y="185" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.35)">Component</text>
  <text x="202" y="270" font-family="system-ui" font-size="18" font-weight="700" fill="white">3D Hover Card</text>
  <text x="202" y="294" font-family="system-ui" font-size="13" fill="rgba(255,255,255,0.5)">perspective: 1000px</text>
  <rect x="88" y="312" width="90" height="34" rx="9" fill="#667eea"/>
  <text x="133" y="334" font-family="system-ui" font-size="13" fill="white" text-anchor="middle" font-weight="600">View</text>
  <rect x="192" y="312" width="90" height="34" rx="9" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <text x="237" y="334" font-family="system-ui" font-size="13" fill="rgba(255,255,255,0.7)" text-anchor="middle">Save</text>
</g>
<rect x="60" y="468" width="680" height="100" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
<text x="80" y="494" font-family="monospace" font-size="13" fill="rgba(102,126,234,0.9)">.card:hover {</text>
<text x="96" y="514" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.5)">transform: perspective(1000px) rotateY(-12deg) rotateX(5deg);</text>
<text x="96" y="534" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.5)">box-shadow: 20px 20px 60px rgba(0,0,0,0.5);</text>
<text x="80" y="554" font-family="monospace" font-size="13" fill="rgba(102,126,234,0.9)">}</text>
</svg>`,

'gradient-text.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="t1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff0080"/><stop offset="35%" stop-color="#7928ca"/><stop offset="70%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#ff0080"/></linearGradient>
  <linearGradient id="t2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f9a825"/><stop offset="50%" stop-color="#ef5350"/><stop offset="100%" stop-color="#7b1fa2"/></linearGradient>
  <linearGradient id="t3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#1de9b6"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="#080808"/>
<text x="400" y="168" font-family="'Segoe UI',system-ui" font-size="96" font-weight="900" fill="url(#t1)" text-anchor="middle" letter-spacing="-3">Gradient</text>
<text x="400" y="270" font-family="'Segoe UI',system-ui" font-size="72" font-weight="800" fill="url(#t2)" text-anchor="middle" letter-spacing="-1">Text Magic</text>
<text x="400" y="344" font-family="'Courier New',monospace" font-size="30" fill="url(#t3)" text-anchor="middle" letter-spacing="9">ANIMATED CSS</text>
<rect x="120" y="376" width="560" height="140" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
<text x="144" y="406" font-family="monospace" font-size="13" fill="rgba(153,90,255,0.9)">.gradient-text {</text>
<text x="160" y="427" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.5)">background: linear-gradient(90deg, #ff0080, #7928ca, #00d4ff);</text>
<text x="160" y="448" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.5)">background-size: 300% 100%;</text>
<text x="160" y="469" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.5)">-webkit-background-clip: text;</text>
<text x="160" y="490" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.5)">-webkit-text-fill-color: transparent;</text>
<text x="144" y="509" font-family="monospace" font-size="13" fill="rgba(153,90,255,0.9)">}</text>
</svg>`,

'loading-spinner.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="#0f172a"/>
<text x="400" y="44" font-family="system-ui" font-size="19" font-weight="700" fill="rgba(255,255,255,0.65)" text-anchor="middle">CSS Loading Animations</text>
<text x="120" y="112" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.35)" text-anchor="middle">Ring</text>
<circle cx="120" cy="196" r="52" fill="none" stroke="rgba(102,126,234,0.15)" stroke-width="10"/>
<path d="M 120 144 A 52 52 0 0 1 172 196" fill="none" stroke="url(#sg)" stroke-width="10" stroke-linecap="round"/>
<text x="300" y="112" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.35)" text-anchor="middle">Dots</text>
<circle cx="260" cy="196" r="15" fill="#f093fb"/>
<circle cx="300" cy="196" r="15" fill="#f093fb" opacity="0.55"/>
<circle cx="340" cy="196" r="15" fill="#f093fb" opacity="0.2"/>
<text x="490" y="112" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.35)" text-anchor="middle">Pulse</text>
<circle cx="490" cy="196" r="58" fill="#4facfe" opacity="0.09"/>
<circle cx="490" cy="196" r="40" fill="#4facfe" opacity="0.18"/>
<circle cx="490" cy="196" r="24" fill="#4facfe" opacity="0.85"/>
<text x="668" y="112" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.35)" text-anchor="middle">Bars</text>
<rect x="638" y="162" width="10" height="68" rx="5" fill="#10b981"/>
<rect x="654" y="172" width="10" height="48" rx="5" fill="#10b981" opacity="0.75"/>
<rect x="670" y="180" width="10" height="32" rx="5" fill="#10b981" opacity="0.5"/>
<rect x="686" y="186" width="10" height="20" rx="5" fill="#10b981" opacity="0.3"/>
<rect x="702" y="180" width="10" height="32" rx="5" fill="#10b981" opacity="0.18"/>
<line x1="48" y1="288" x2="752" y2="288" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
<rect x="48" y="306" width="704" height="234" rx="14" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
<text x="72" y="338" font-family="monospace" font-size="14" fill="rgba(102,126,234,0.9)">@keyframes spin {</text>
<text x="90" y="362" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.4)">from { transform: rotate(0deg); }</text>
<text x="90" y="385" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.4)">to   { transform: rotate(360deg); }</text>
<text x="72" y="408" font-family="monospace" font-size="14" fill="rgba(102,126,234,0.9)">}</text>
<text x="72" y="438" font-family="monospace" font-size="14" fill="rgba(102,126,234,0.9)">@keyframes pulse {</text>
<text x="90" y="462" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.4)">0%, 100% { transform: scale(1); opacity: 1; }</text>
<text x="90" y="485" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.4)">50%      { transform: scale(1.4); opacity: 0.5; }</text>
<text x="72" y="508" font-family="monospace" font-size="14" fill="rgba(102,126,234,0.9)">}</text>
<text x="72" y="530" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.4)">.spinner { animation: spin 1s linear infinite; }</text>
</svg>`,

'navbar.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="nb" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
  <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="#f1f5f9"/>
<text x="50" y="42" font-family="system-ui" font-size="13" font-weight="700" fill="#64748b">DESKTOP — sticky navbar</text>
<rect x="32" y="56" width="736" height="60" rx="12" fill="url(#nb)"/>
<rect x="54" y="72" width="30" height="30" rx="7" fill="url(#lg)"/>
<text x="69" y="93" font-family="system-ui" font-size="17" font-weight="900" fill="white" text-anchor="middle">D</text>
<text x="98" y="91" font-family="system-ui" font-size="16" font-weight="700" fill="white">DevSite</text>
<text x="248" y="91" font-family="system-ui" font-size="14" font-weight="700" fill="white">Home</text>
<line x1="248" y1="109" x2="282" y2="109" stroke="#667eea" stroke-width="2.5" stroke-linecap="round"/>
<text x="316" y="91" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.5)">Projects</text>
<text x="398" y="91" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.5)">Blog</text>
<text x="466" y="91" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.5)">About</text>
<rect x="626" y="72" width="118" height="30" rx="8" fill="url(#lg)"/>
<text x="685" y="92" font-family="system-ui" font-size="13" font-weight="600" fill="white" text-anchor="middle">Sign Up →</text>
<text x="50" y="172" font-family="system-ui" font-size="13" font-weight="700" fill="#64748b">MOBILE — collapsed</text>
<rect x="32" y="186" width="736" height="54" rx="12" fill="url(#nb)"/>
<rect x="54" y="200" width="26" height="26" rx="6" fill="url(#lg)"/>
<text x="67" y="219" font-family="system-ui" font-size="15" font-weight="900" fill="white" text-anchor="middle">D</text>
<text x="92" y="220" font-family="system-ui" font-size="15" font-weight="700" fill="white">DevSite</text>
<line x1="698" y1="205" x2="724" y2="205" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
<line x1="698" y1="213" x2="724" y2="213" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
<line x1="698" y1="221" x2="724" y2="221" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
<text x="50" y="292" font-family="system-ui" font-size="13" font-weight="700" fill="#64748b">MOBILE — open dropdown</text>
<rect x="32" y="306" width="736" height="194" rx="12" fill="url(#nb)"/>
<rect x="54" y="318" width="26" height="26" rx="6" fill="url(#lg)"/>
<text x="94" y="338" font-family="system-ui" font-size="15" font-weight="700" fill="white">DevSite</text>
<line x1="32" y1="352" x2="768" y2="352" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
<text x="64" y="380" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.85)">🏠  Home</text>
<text x="64" y="406" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.5)">💼  Projects</text>
<text x="64" y="432" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.5)">📝  Blog</text>
<text x="64" y="458" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.5)">👤  About</text>
<rect x="634" y="434" width="110" height="34" rx="8" fill="url(#lg)"/>
<text x="689" y="456" font-family="system-ui" font-size="13" font-weight="600" fill="white" text-anchor="middle">Sign Up</text>
<rect x="32" y="520" width="736" height="52" rx="10" fill="rgba(0,0,0,0.055)" stroke="#e2e8f0" stroke-width="1"/>
<text x="400" y="544" font-family="monospace" font-size="12" fill="#64748b" text-anchor="middle">position: sticky; top: 0; backdrop-filter: blur(8px); z-index: 100;</text>
<text x="400" y="561" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">@media (max-width: 768px) { .nav-links { display: none; } .hamburger { display: flex; } }</text>
</svg>`,

'toggle-switch.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="on1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient>
  <linearGradient id="on2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/></linearGradient>
  <filter id="glo"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="sh2"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.15)"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="#f0f4f8"/>
<text x="400" y="46" font-family="system-ui" font-size="22" font-weight="800" fill="#1e293b" text-anchor="middle">CSS Toggle Switches</text>
<text x="400" y="106" font-family="system-ui" font-size="13" fill="#94a3b8" text-anchor="middle">size and state variants</text>
<rect x="116" y="124" width="50" height="26" rx="13" fill="#cbd5e1"/>
<circle cx="129" cy="137" r="11" fill="white" filter="url(#sh2)"/>
<text x="141" y="170" font-family="system-ui" font-size="12" fill="#94a3b8" text-anchor="middle">Off</text>
<rect x="218" y="120" width="60" height="32" rx="16" fill="url(#on1)" filter="url(#glo)"/>
<circle cx="262" cy="136" r="13" fill="white" filter="url(#sh2)"/>
<text x="248" y="170" font-family="system-ui" font-size="12" fill="#7c3aed" text-anchor="middle" font-weight="600">On</text>
<rect x="336" y="116" width="72" height="40" rx="20" fill="url(#on2)" filter="url(#glo)"/>
<circle cx="388" cy="136" r="17" fill="white" filter="url(#sh2)"/>
<text x="372" y="170" font-family="system-ui" font-size="12" fill="#059669" text-anchor="middle" font-weight="600">Active</text>
<rect x="476" y="120" width="60" height="32" rx="16" fill="#f87171" opacity="0.8"/>
<circle cx="516" cy="136" r="13" fill="white" filter="url(#sh2)"/>
<text x="506" y="170" font-family="system-ui" font-size="12" fill="#dc2626" text-anchor="middle">Error</text>
<rect x="596" y="120" width="82" height="44" rx="22" fill="#e2e8f0"/>
<circle cx="619" cy="142" r="19" fill="white" filter="url(#sh2)"/>
<text x="637" y="170" font-family="system-ui" font-size="12" fill="#94a3b8" text-anchor="middle">xl Off</text>
<line x1="48" y1="200" x2="752" y2="200" stroke="#e2e8f0" stroke-width="1"/>
<rect x="48" y="218" width="704" height="110" rx="16" fill="#0f172a"/>
<text x="80" y="252" font-family="system-ui" font-size="13" fill="rgba(255,255,255,0.4)">Dark UI</text>
<rect x="140" y="258" width="54" height="28" rx="14" fill="rgba(255,255,255,0.1)"/>
<circle cx="154" cy="272" r="12" fill="rgba(255,255,255,0.55)" filter="url(#sh2)"/>
<rect x="240" y="254" width="66" height="36" rx="18" fill="url(#on1)" filter="url(#glo)"/>
<circle cx="288" cy="272" r="15" fill="white" filter="url(#sh2)"/>
<rect x="356" y="254" width="66" height="36" rx="18" fill="url(#on2)" filter="url(#glo)"/>
<circle cx="404" cy="272" r="15" fill="white" filter="url(#sh2)"/>
<rect x="472" y="254" width="66" height="36" rx="18" fill="rgba(239,68,68,0.75)"/>
<circle cx="520" cy="272" r="15" fill="white" filter="url(#sh2)"/>
<rect x="584" y="258" width="60" height="28" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
<circle cx="598" cy="272" r="12" fill="rgba(255,255,255,0.5)" filter="url(#sh2)"/>
<rect x="48" y="346" width="704" height="150" rx="14" fill="rgba(15,23,42,0.07)" stroke="#e2e8f0" stroke-width="1"/>
<text x="72" y="376" font-family="monospace" font-size="13" fill="#7c3aed">.toggle input:checked + .track {</text>
<text x="88" y="398" font-family="monospace" font-size="13" fill="#475569">  background: var(--color-primary);</text>
<text x="72" y="420" font-family="monospace" font-size="13" fill="#7c3aed">}</text>
<text x="72" y="448" font-family="monospace" font-size="13" fill="#7c3aed">.toggle input:checked + .track .thumb {</text>
<text x="88" y="470" font-family="monospace" font-size="13" fill="#475569">  transform: translateX(calc(100% + 6px));</text>
<text x="72" y="492" font-family="monospace" font-size="13" fill="#7c3aed">}</text>
</svg>`,

'css-grid-dashboard.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient>
  <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f093fb"/><stop offset="100%" stop-color="#f5576c"/></linearGradient>
  <linearGradient id="cg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4facfe"/><stop offset="100%" stop-color="#00f2fe"/></linearGradient>
  <linearGradient id="cg4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="#0f172a"/>
<text x="28" y="33" font-family="system-ui" font-size="15" font-weight="700" fill="rgba(255,255,255,0.65)">CSS Grid Dashboard Layout</text>
<rect x="28" y="46" width="160" height="80" rx="12" fill="url(#cg1)"/>
<text x="46" y="70" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.7)">Users</text>
<text x="46" y="100" font-family="system-ui" font-size="24" font-weight="800" fill="white">2,847</text>
<text x="46" y="118" font-family="system-ui" font-size="11" fill="#86efac">↑ 12.5%</text>
<rect x="200" y="46" width="160" height="80" rx="12" fill="url(#cg2)"/>
<text x="218" y="70" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.7)">Revenue</text>
<text x="218" y="100" font-family="system-ui" font-size="24" font-weight="800" fill="white">$48K</text>
<text x="218" y="118" font-family="system-ui" font-size="11" fill="#fde68a">↑ 8.2%</text>
<rect x="372" y="46" width="160" height="80" rx="12" fill="url(#cg3)"/>
<text x="390" y="70" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.7)">Orders</text>
<text x="390" y="100" font-family="system-ui" font-size="24" font-weight="800" fill="white">1,024</text>
<text x="390" y="118" font-family="system-ui" font-size="11" fill="#fde68a">↓ 3.1%</text>
<rect x="544" y="46" width="228" height="80" rx="12" fill="url(#cg4)"/>
<text x="562" y="70" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.7)">Growth</text>
<text x="562" y="100" font-family="system-ui" font-size="24" font-weight="800" fill="white">+23%</text>
<text x="562" y="118" font-family="system-ui" font-size="11" fill="#86efac">↑ 5.7%</text>
<rect x="28" y="142" width="492" height="192" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
<text x="48" y="170" font-family="system-ui" font-size="13" font-weight="600" fill="rgba(255,255,255,0.75)">Weekly Overview</text>
<rect x="56"  y="268" width="34" height="52" rx="5" fill="url(#cg1)" opacity="0.8"/>
<rect x="102" y="248" width="34" height="72" rx="5" fill="url(#cg1)"/>
<rect x="148" y="280" width="34" height="40" rx="5" fill="url(#cg1)" opacity="0.7"/>
<rect x="194" y="240" width="34" height="80" rx="5" fill="url(#cg1)"/>
<rect x="240" y="260" width="34" height="60" rx="5" fill="url(#cg2)"/>
<rect x="286" y="256" width="34" height="64" rx="5" fill="url(#cg1)" opacity="0.75"/>
<rect x="332" y="244" width="34" height="76" rx="5" fill="url(#cg1)" opacity="0.9"/>
<rect x="544" y="142" width="228" height="192" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
<text x="564" y="170" font-family="system-ui" font-size="13" font-weight="600" fill="rgba(255,255,255,0.75)">Activity</text>
<circle cx="574" cy="206" r="11" fill="url(#cg1)"/>
<text x="594" y="210" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.5)">User signed up</text>
<circle cx="574" cy="238" r="11" fill="url(#cg2)"/>
<text x="594" y="242" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.5)">Payment received</text>
<circle cx="574" cy="270" r="11" fill="url(#cg3)"/>
<text x="594" y="274" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.5)">Order placed</text>
<circle cx="574" cy="302" r="11" fill="url(#cg4)"/>
<text x="594" y="306" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.5)">New comment</text>
<rect x="28" y="350" width="744" height="130" rx="12" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
<text x="50" y="380" font-family="monospace" font-size="13" fill="rgba(99,102,241,0.9)">.dashboard {</text>
<text x="68" y="402" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.5)">display: grid;  grid-template-columns: repeat(4, 1fr);  gap: 16px;</text>
<text x="50" y="424" font-family="monospace" font-size="13" fill="rgba(99,102,241,0.9)">}</text>
<text x="50" y="450" font-family="monospace" font-size="13" fill="rgba(99,102,241,0.9)">.chart-area {</text>
<text x="68" y="470" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.5)">grid-column: 1 / 4;  grid-row: 2 / 3;</text>
<text x="50" y="490" font-family="monospace" font-size="13" fill="rgba(99,102,241,0.9)">}</text>
<rect x="28" y="498" width="744" height="72" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
<text x="50" y="524" font-family="monospace" font-size="13" fill="rgba(99,102,241,0.9)">.sidebar {</text>
<text x="68" y="544" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.5)">grid-column: 4 / 5;  grid-row: 2 / 4;</text>
<text x="50" y="563" font-family="monospace" font-size="13" fill="rgba(99,102,241,0.9)">}</text>
</svg>`,

// ── Modal Component ─────────────────────────────────────────────────────────
'modal-component.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="mgBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#mgBg)"/>
  <!-- Overlay backdrop -->
  <rect width="${W}" height="${H}" fill="rgba(0,0,0,0.55)"/>
  <!-- Modal box -->
  <rect x="180" y="80" width="440" height="320" rx="16" fill="#1e293b" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <!-- Header bar -->
  <rect x="180" y="80" width="440" height="56" rx="16" fill="#334155"/>
  <rect x="180" y="112" width="440" height="24" fill="#334155"/>
  <text x="210" y="114" font-family="system-ui" font-size="16" font-weight="700" fill="white">Confirmar acción</text>
  <circle cx="595" cy="108" r="12" fill="rgba(255,255,255,0.1)"/>
  <text x="589" y="113" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.7)">✕</text>
  <!-- Body text lines -->
  <rect x="210" y="150" width="300" height="10" rx="4" fill="rgba(255,255,255,0.15)"/>
  <rect x="210" y="172" width="360" height="10" rx="4" fill="rgba(255,255,255,0.1)"/>
  <rect x="210" y="194" width="240" height="10" rx="4" fill="rgba(255,255,255,0.1)"/>
  <!-- Warning icon + box -->
  <rect x="210" y="220" width="380" height="60" rx="10" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.3)" stroke-width="1"/>
  <text x="230" y="256" font-family="system-ui" font-size="13" fill="#fbbf24">⚠  Esta acción no se puede deshacer.</text>
  <!-- Footer btns -->
  <rect x="210" y="300" width="130" height="40" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="265" y="325" font-family="system-ui" font-size="13" text-anchor="middle" fill="rgba(255,255,255,0.7)">Cancelar</text>
  <rect x="360" y="300" width="230" height="40" rx="8" fill="#ef4444"/>
  <text x="475" y="325" font-family="system-ui" font-size="13" font-weight="600" text-anchor="middle" fill="white">Sí, eliminar</text>
  <!-- Code snippet below -->
  <rect x="28" y="430" width="744" height="150" rx="12" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <text x="50" y="458" font-family="monospace" font-size="12" fill="#60a5fa">// HTML</text>
  <text x="50" y="476" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.55)">&lt;dialog id="myModal" class="modal"&gt;</text>
  <text x="62" y="492" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.45)">  &lt;div class="modal-header"&gt;...&lt;/div&gt;</text>
  <text x="50" y="508" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.55)">&lt;/dialog&gt;</text>
  <text x="50" y="530" font-family="monospace" font-size="12" fill="#a78bfa">// JS  — document.getElementById('myModal').showModal();</text>
  <text x="50" y="548" font-family="monospace" font-size="12" fill="#34d399">// CSS — .modal { border-radius: 16px; padding: 0; }</text>
  <text x="50" y="566" font-family="monospace" font-size="12" fill="#34d399">         .modal::backdrop { background: rgba(0,0,0,0.5); }</text>
</svg>`,

// ── Accordion Component ─────────────────────────────────────────────────────
'accordion-component.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0f172a"/>
  <text x="40" y="44" font-family="system-ui" font-size="18" font-weight="700" fill="white">Accordion Component</text>
  <text x="40" y="64" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.4)">HTML + CSS + JavaScript</text>
  <!-- Panel 1 open -->
  <rect x="40" y="82" width="460" height="54" rx="10" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="68" y="115" font-family="system-ui" font-size="14" font-weight="600" fill="white">¿Qué es CSS Grid?</text>
  <text x="470" y="115" font-family="system-ui" font-size="18" fill="#60a5fa" text-anchor="middle">▲</text>
  <rect x="40" y="136" width="460" height="72" rx="0,0,10,10" fill="#0f2440"/>
  <rect x="40" y="196" width="460" height="12" rx="0,0,10,10" fill="#0f2440"/>
  <rect x="58" y="148" width="350" height="9" rx="4" fill="rgba(255,255,255,0.2)"/>
  <rect x="58" y="165" width="300" height="9" rx="4" fill="rgba(255,255,255,0.15)"/>
  <rect x="58" y="182" width="200" height="9" rx="4" fill="rgba(255,255,255,0.1)"/>
  <!-- Panel 2 closed -->
  <rect x="40" y="216" width="460" height="54" rx="10" fill="#1e293b" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="68" y="249" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.75)">¿Cuándo usar Flexbox?</text>
  <text x="470" y="249" font-family="system-ui" font-size="18" fill="rgba(255,255,255,0.35)" text-anchor="middle">▼</text>
  <!-- Panel 3 closed -->
  <rect x="40" y="280" width="460" height="54" rx="10" fill="#1e293b" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="68" y="313" font-family="system-ui" font-size="14" fill="rgba(255,255,255,0.75)">¿Qué son las CSS Variables?</text>
  <text x="470" y="313" font-family="system-ui" font-size="18" fill="rgba(255,255,255,0.35)" text-anchor="middle">▼</text>
  <!-- Code -->
  <rect x="520" y="82" width="260" height="260" rx="12" fill="#111827" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="520" y="82" width="260" height="30" rx="12" fill="#1e293b"/>
  <rect x="520" y="97" width="260" height="15" fill="#1e293b"/>
  <text x="535" y="102" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">accordion.js</text>
  <text x="535" y="130" font-family="monospace" font-size="11" fill="#60a5fa">const</text>
  <text x="571" y="130" font-family="monospace" font-size="11" fill="white"> toggles = document</text>
  <text x="535" y="148" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">  .querySelectorAll('.acc-btn');</text>
  <text x="535" y="168" font-family="monospace" font-size="11" fill="#60a5fa">toggles.forEach</text>
  <text x="535" y="184" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">  (btn =&gt; {</text>
  <text x="535" y="200" font-family="monospace" font-size="11" fill="#60a5fa">  btn.</text>
  <text x="556" y="200" font-family="monospace" font-size="11" fill="white">addEventListener(</text>
  <text x="535" y="216" font-family="monospace" font-size="11" fill="#f59e0b">    'click'</text>
  <text x="535" y="232" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">    , () =&gt; {</text>
  <text x="535" y="250" font-family="monospace" font-size="11" fill="white">      btn.classList</text>
  <text x="535" y="266" font-family="monospace" font-size="11" fill="#34d399">        .toggle('open');</text>
  <text x="535" y="282" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">    });</text>
  <text x="535" y="298" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">  });</text>
  <!-- CSS snippet -->
  <rect x="40" y="355" width="744" height="100" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <text x="60" y="380" font-family="monospace" font-size="12" fill="#a78bfa">.acc-content { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }</text>
  <text x="60" y="400" font-family="monospace" font-size="12" fill="#a78bfa">.acc-btn.open + .acc-content { max-height: 400px; }</text>
  <text x="60" y="420" font-family="monospace" font-size="12" fill="#60a5fa">.acc-btn { width: 100%; background: #1e293b; border: none; }</text>
  <text x="60" y="440" font-family="monospace" font-size="12" fill="#34d399">/* panel body padding */</text>
  <text x="60" y="460" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.5)">.acc-content &gt; div { padding: 1rem 1.25rem; }</text>
  <!-- HTML snippet -->
  <rect x="40" y="468" width="744" height="100" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <text x="60" y="492" font-family="monospace" font-size="12" fill="#f97316">&lt;div class="accordion"&gt;</text>
  <text x="60" y="510" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.5)">  &lt;button class="acc-btn"&gt;¿Qué es CSS Grid?&lt;/button&gt;</text>
  <text x="60" y="528" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.5)">  &lt;div class="acc-content"&gt;&lt;p&gt;...&lt;/p&gt;&lt;/div&gt;</text>
  <text x="60" y="546" font-family="monospace" font-size="12" fill="#f97316">&lt;/div&gt;</text>
</svg>`,

// ── Toast Notifications ─────────────────────────────────────────────────────
'toast-notification.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0f172a"/>
  <text x="40" y="44" font-family="system-ui" font-size="18" font-weight="700" fill="white">Toast Notifications</text>
  <text x="40" y="64" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.4)">HTML + CSS + JavaScript</text>
  <!-- Success toast -->
  <rect x="40" y="82" width="400" height="62" rx="12" fill="#052e16" stroke="#16a34a" stroke-width="1.5"/>
  <rect x="40" y="82" width="6" height="62" rx="3,0,0,3" fill="#16a34a"/>
  <text x="68" y="107" font-family="system-ui" font-size="13" font-weight="700" fill="#4ade80">✓  Guardado correctamente</text>
  <text x="68" y="127" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.5)">Los cambios han sido aplicados.</text>
  <text x="418" y="107" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.3)">ahora</text>
  <!-- Error toast -->
  <rect x="40" y="160" width="400" height="62" rx="12" fill="#450a0a" stroke="#dc2626" stroke-width="1.5"/>
  <rect x="40" y="160" width="6" height="62" rx="3,0,0,3" fill="#dc2626"/>
  <text x="68" y="185" font-family="system-ui" font-size="13" font-weight="700" fill="#f87171">✕  Error al procesar</text>
  <text x="68" y="205" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.5)">Inténtalo de nuevo más tarde.</text>
  <text x="418" y="185" font-family="system-ui" font-size="11" fill="rgba(255,255,255,0.3)">2s</text>
  <!-- Warning toast -->
  <rect x="40" y="238" width="400" height="62" rx="12" fill="#431407" stroke="#d97706" stroke-width="1.5"/>
  <rect x="40" y="238" width="6" height="62" rx="3,0,0,3" fill="#d97706"/>
  <text x="68" y="263" font-family="system-ui" font-size="13" font-weight="700" fill="#fbbf24">⚠  Sesión próxima a expirar</text>
  <text x="68" y="283" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.5)">Tu sesión expira en 5 minutos.</text>
  <!-- Info toast -->
  <rect x="40" y="315" width="400" height="62" rx="12" fill="#0c1a2e" stroke="#2563eb" stroke-width="1.5"/>
  <rect x="40" y="315" width="6" height="62" rx="3,0,0,3" fill="#2563eb"/>
  <text x="68" y="340" font-family="system-ui" font-size="13" font-weight="700" fill="#60a5fa">ℹ  Nueva versión disponible</text>
  <text x="68" y="360" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.5)">Actualiza para nuevas mejoras.</text>
  <!-- Progress bar on last toast -->
  <rect x="40" y="371" width="400" height="6" rx="0,0,12,12" fill="rgba(37,99,235,0.2)"/>
  <rect x="40" y="371" width="260" height="6" rx="0,0,12,12" fill="#2563eb"/>
  <!-- Code panel -->
  <rect x="460" y="82" width="330" height="310" rx="12" fill="#111827" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="460" y="82" width="330" height="30" rx="12" fill="#1e293b"/>
  <rect x="460" y="97" width="330" height="15" fill="#1e293b"/>
  <text x="475" y="102" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">toast.js</text>
  <text x="475" y="128" font-family="monospace" font-size="11" fill="#60a5fa">function</text>
  <text x="521" y="128" font-family="monospace" font-size="11" fill="#fbbf24"> showToast</text>
  <text x="589" y="128" font-family="monospace" font-size="11" fill="white">(msg, type) {</text>
  <text x="475" y="146" font-family="monospace" font-size="11" fill="#60a5fa">  const</text>
  <text x="506" y="146" font-family="monospace" font-size="11" fill="white"> t = document</text>
  <text x="475" y="162" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">    .createElement('div');</text>
  <text x="475" y="180" font-family="monospace" font-size="11" fill="white">  t.className =</text>
  <text x="475" y="196" font-family="monospace" font-size="11" fill="#f59e0b">    \`toast toast-\${type}\`;</text>
  <text x="475" y="214" font-family="monospace" font-size="11" fill="white">  t.textContent = msg;</text>
  <text x="475" y="232" font-family="monospace" font-size="11" fill="white">  document.body</text>
  <text x="475" y="248" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">    .appendChild(t);</text>
  <text x="475" y="266" font-family="monospace" font-size="11" fill="#60a5fa">  setTimeout</text>
  <text x="536" y="266" font-family="monospace" font-size="11" fill="white">(() =&gt;</text>
  <text x="475" y="282" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">    t.remove(), 3000);</text>
  <text x="475" y="298" font-family="monospace" font-size="11" fill="white">}</text>
  <text x="475" y="318" font-family="monospace" font-size="11" fill="#34d399">// Usage:</text>
  <text x="475" y="336" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.6)">showToast('Guardado!', 'success');</text>
  <text x="475" y="354" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.6)">showToast('Error!', 'error');</text>
  <text x="475" y="372" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.6)">showToast('¡Atención!', 'warn');</text>
  <!-- CSS strip -->
  <rect x="40" y="400" width="744" height="170" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <text x="60" y="424" font-family="monospace" font-size="12" fill="#a78bfa">.toast { position: fixed; bottom: 1.5rem; right: 1.5rem; min-width: 280px; }</text>
  <text x="60" y="444" font-family="monospace" font-size="12" fill="#a78bfa">       padding: 1rem 1.25rem; border-radius: 12px; border-left: 5px solid;</text>
  <text x="60" y="464" font-family="monospace" font-size="12" fill="#a78bfa">       animation: slideIn 0.3s ease; }</text>
  <text x="60" y="486" font-family="monospace" font-size="12" fill="#60a5fa">.toast-success { background: #052e16; border-color: #16a34a; color: #4ade80; }</text>
  <text x="60" y="506" font-family="monospace" font-size="12" fill="#f87171">.toast-error   { background: #450a0a; border-color: #dc2626; color: #f87171; }</text>
  <text x="60" y="526" font-family="monospace" font-size="12" fill="#fbbf24">.toast-warn    { background: #431407; border-color: #d97706; color: #fbbf24; }</text>
  <text x="60" y="548" font-family="monospace" font-size="12" fill="#a78bfa">@keyframes slideIn { from { opacity:0; transform: translateX(100%); } to { opacity:1; } }</text>
</svg>`,

// ── React Counter (TypeScript) ───────────────────────────────────────────────
'react-counter.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="rcBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#rcBg)"/>
  <text x="40" y="44" font-family="system-ui" font-size="18" font-weight="700" fill="white">React Counter</text>
  <text x="40" y="64" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.4)">TypeScript · React Hooks</text>
  <!-- Preview tile -->
  <rect x="40" y="82" width="260" height="240" rx="16" fill="#1e293b" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="170" y="152" font-family="system-ui" font-size="13" fill="rgba(255,255,255,0.5)" text-anchor="middle">Contador</text>
  <text x="170" y="200" font-family="system-ui" font-size="64" font-weight="900" fill="white" text-anchor="middle">42</text>
  <!-- Decrement -->
  <rect x="68" y="225" width="52" height="52" rx="50%" fill="#334155"/>
  <text x="94" y="258" font-family="system-ui" font-size="28" font-weight="700" fill="rgba(255,255,255,0.8)" text-anchor="middle">−</text>
  <!-- Increment -->
  <rect x="178" y="225" width="52" height="52" rx="50%" fill="#4f46e5"/>
  <text x="204" y="258" font-family="system-ui" font-size="28" font-weight="700" fill="white" text-anchor="middle">+</text>
  <!-- Reset link -->
  <text x="170" y="305" font-family="system-ui" font-size="12" fill="#818cf8" text-anchor="middle">↺ Resetear</text>
  <!-- Progress bar -->
  <rect x="68" y="315" width="204" height="6" rx="3" fill="#334155"/>
  <rect x="68" y="315" width="127" height="6" rx="3" fill="#4f46e5"/>
  <!-- Code panel -->
  <rect x="320" y="82" width="470" height="490" rx="12" fill="#111827" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="320" y="82" width="470" height="30" rx="12" fill="#1e293b"/>
  <rect x="320" y="97" width="470" height="15" fill="#1e293b"/>
  <text x="338" y="102" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">Counter.tsx</text>
  <text x="338" y="128" font-family="monospace" font-size="12" fill="#60a5fa">import</text>
  <text x="372" y="128" font-family="monospace" font-size="12" fill="white"> { useState } </text>
  <text x="452" y="128" font-family="monospace" font-size="12" fill="#60a5fa">from</text>
  <text x="477" y="128" font-family="monospace" font-size="12" fill="#f59e0b"> 'react'</text>
  <text x="338" y="148" font-family="monospace" font-size="12" fill="#60a5fa">interface</text>
  <text x="395" y="148" font-family="monospace" font-size="12" fill="#34d399"> CounterProps</text>
  <text x="471" y="148" font-family="monospace" font-size="12" fill="white"> {</text>
  <text x="338" y="166" font-family="monospace" font-size="12" fill="white">  initial</text>
  <text x="390" y="166" font-family="monospace" font-size="12" fill="#60a5fa">?: number</text>
  <text x="448" y="166" font-family="monospace" font-size="12" fill="white">; step</text>
  <text x="490" y="166" font-family="monospace" font-size="12" fill="#60a5fa">?: number</text>
  <text x="338" y="184" font-family="monospace" font-size="12" fill="white">}</text>
  <text x="338" y="204" font-family="monospace" font-size="12" fill="#60a5fa">export function</text>
  <text x="438" y="204" font-family="monospace" font-size="12" fill="#fbbf24"> Counter</text>
  <text x="338" y="222" font-family="monospace" font-size="12" fill="white">  ({ initial = 0, step = 1 }:</text>
  <text x="338" y="240" font-family="monospace" font-size="12" fill="#34d399">   CounterProps</text>
  <text x="408" y="240" font-family="monospace" font-size="12" fill="white">) {</text>
  <text x="338" y="260" font-family="monospace" font-size="12" fill="#60a5fa">  const</text>
  <text x="370" y="260" font-family="monospace" font-size="12" fill="white"> [count, setCount] =</text>
  <text x="338" y="278" font-family="monospace" font-size="12" fill="#fbbf24">    useState</text>
  <text x="390" y="278" font-family="monospace" font-size="12" fill="#34d399">&lt;number&gt;</text>
  <text x="440" y="278" font-family="monospace" font-size="12" fill="white">(initial);</text>
  <text x="338" y="298" font-family="monospace" font-size="12" fill="#60a5fa">  return</text>
  <text x="375" y="298" font-family="monospace" font-size="12" fill="white"> (</text>
  <text x="338" y="316" font-family="monospace" font-size="12" fill="#f97316">    &lt;div</text>
  <text x="370" y="316" font-family="monospace" font-size="12" fill="#a78bfa"> className</text>
  <text x="438" y="316" font-family="monospace" font-size="12" fill="#f59e0b">="counter"</text>
  <text x="495" y="316" font-family="monospace" font-size="12" fill="#f97316">&gt;</text>
  <text x="338" y="334" font-family="monospace" font-size="12" fill="#f97316">      &lt;span</text>
  <text x="388" y="334" font-family="monospace" font-size="12" fill="#a78bfa"> className</text>
  <text x="456" y="334" font-family="monospace" font-size="12" fill="#f59e0b">="value"</text>
  <text x="502" y="334" font-family="monospace" font-size="12" fill="#f97316">&gt;</text>
  <text x="338" y="352" font-family="monospace" font-size="12" fill="white">        {count}</text>
  <text x="338" y="370" font-family="monospace" font-size="12" fill="#f97316">      &lt;/span&gt;</text>
  <text x="338" y="388" font-family="monospace" font-size="12" fill="#f97316">      &lt;button</text>
  <text x="338" y="406" font-family="monospace" font-size="12" fill="#6366f1">        onClick</text>
  <text x="398" y="406" font-family="monospace" font-size="12" fill="white">={() =&gt; setCount(c =&gt; c - step)}</text>
  <text x="338" y="424" font-family="monospace" font-size="12" fill="#f97316">      &gt;−&lt;/button&gt;</text>
  <text x="338" y="442" font-family="monospace" font-size="12" fill="#f97316">      &lt;button</text>
  <text x="338" y="460" font-family="monospace" font-size="12" fill="#6366f1">        onClick</text>
  <text x="398" y="460" font-family="monospace" font-size="12" fill="white">={() =&gt; setCount(c =&gt; c + step)}</text>
  <text x="338" y="478" font-family="monospace" font-size="12" fill="#f97316">      &gt;+&lt;/button&gt;</text>
  <text x="338" y="496" font-family="monospace" font-size="12" fill="#f97316">    &lt;/div&gt;</text>
  <text x="338" y="514" font-family="monospace" font-size="12" fill="white">  );</text>
  <text x="338" y="532" font-family="monospace" font-size="12" fill="white">}</text>
  <!-- Badges -->
  <rect x="40" y="345" width="90" height="24" rx="12" fill="rgba(97,218,251,0.15)" stroke="rgba(97,218,251,0.3)" stroke-width="1"/>
  <text x="85" y="361" font-family="system-ui" font-size="11" font-weight="600" fill="#61dafb" text-anchor="middle">React 19</text>
  <rect x="138" y="345" width="100" height="24" rx="12" fill="rgba(49,120,198,0.15)" stroke="rgba(49,120,198,0.3)" stroke-width="1"/>
  <text x="188" y="361" font-family="system-ui" font-size="11" font-weight="600" fill="#3178c6" text-anchor="middle">TypeScript</text>
  <rect x="246" y="345" width="78" height="24" rx="12" fill="rgba(52,211,153,0.15)" stroke="rgba(52,211,153,0.3)" stroke-width="1"/>
  <text x="286" y="361" font-family="system-ui" font-size="11" font-weight="600" fill="#34d399" text-anchor="middle">Hooks</text>
</svg>`,

// ── Fetch API (JavaScript) ───────────────────────────────────────────────────
'js-fetch-api.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0f172a"/>
  <text x="40" y="44" font-family="system-ui" font-size="18" font-weight="700" fill="white">Fetch API + Async/Await</text>
  <text x="40" y="64" font-family="system-ui" font-size="12" fill="rgba(255,255,255,0.4)">JavaScript · HTTP requests</text>
  <!-- Flow diagram -->
  <!-- Browser node -->
  <rect x="40" y="88" width="130" height="48" rx="10" fill="#1e40af"/>
  <text x="105" y="118" font-family="system-ui" font-size="13" font-weight="600" fill="white" text-anchor="middle">🖥 Browser</text>
  <!-- Arrow -->
  <line x1="170" y1="112" x2="230" y2="112" stroke="#60a5fa" stroke-width="2"/>
  <polygon points="228,107 238,112 228,117" fill="#60a5fa"/>
  <text x="200" y="106" font-family="system-ui" font-size="10" fill="#60a5fa" text-anchor="middle">fetch()</text>
  <!-- Server node -->
  <rect x="236" y="88" width="130" height="48" rx="10" fill="#065f46"/>
  <text x="301" y="118" font-family="system-ui" font-size="13" font-weight="600" fill="white" text-anchor="middle">🌐 API Server</text>
  <!-- Arrow back -->
  <line x1="366" y1="122" x2="426" y2="122" stroke="#34d399" stroke-width="2"/>
  <polygon points="424,117 434,122 424,127" fill="#34d399"/>
  <text x="396" y="116" font-family="system-ui" font-size="10" fill="#34d399" text-anchor="middle">JSON</text>
  <!-- Data node -->
  <rect x="432" y="88" width="130" height="48" rx="10" fill="#4c1d95"/>
  <text x="497" y="118" font-family="system-ui" font-size="13" font-weight="600" fill="white" text-anchor="middle">📦 Data</text>
  <!-- Arrow to state -->
  <line x1="562" y1="112" x2="622" y2="112" stroke="#a78bfa" stroke-width="2"/>
  <polygon points="620,107 630,112 620,117" fill="#a78bfa"/>
  <!-- State node -->
  <rect x="628" y="88" width="130" height="48" rx="10" fill="#701a75"/>
  <text x="693" y="118" font-family="system-ui" font-size="13" font-weight="600" fill="white" text-anchor="middle">⚛ State</text>
  <!-- Status indicators -->
  <rect x="40" y="158" width="90" height="28" rx="8" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" stroke-width="1"/>
  <text x="85" y="177" font-family="system-ui" font-size="11" fill="#fbbf24" text-anchor="middle">⏳ loading</text>
  <rect x="142" y="158" width="80" height="28" rx="8" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" stroke-width="1"/>
  <text x="182" y="177" font-family="system-ui" font-size="11" fill="#f87171" text-anchor="middle">✕ error</text>
  <rect x="234" y="158" width="80" height="28" rx="8" fill="rgba(52,211,153,0.15)" stroke="rgba(52,211,153,0.4)" stroke-width="1"/>
  <text x="274" y="177" font-family="system-ui" font-size="11" fill="#34d399" text-anchor="middle">✓ success</text>
  <!-- Main code panel -->
  <rect x="40" y="204" width="480" height="370" rx="12" fill="#111827" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="40" y="204" width="480" height="30" rx="12" fill="#1e293b"/>
  <rect x="40" y="219" width="480" height="15" fill="#1e293b"/>
  <text x="58" y="224" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">fetchData.js</text>
  <text x="58" y="252" font-family="monospace" font-size="12" fill="#6ee7b7">// Fetch con async/await y manejo de errores</text>
  <text x="58" y="272" font-family="monospace" font-size="12" fill="#60a5fa">async function</text>
  <text x="160" y="272" font-family="monospace" font-size="12" fill="#fbbf24"> fetchUsers</text>
  <text x="220" y="272" font-family="monospace" font-size="12" fill="white">() {</text>
  <text x="58" y="292" font-family="monospace" font-size="12" fill="#60a5fa">  const</text>
  <text x="94" y="292" font-family="monospace" font-size="12" fill="white"> [data, setData] =</text>
  <text x="58" y="310" font-family="monospace" font-size="12" fill="#fbbf24">    useState</text>
  <text x="112" y="310" font-family="monospace" font-size="12" fill="white">(null);</text>
  <text x="58" y="330" font-family="monospace" font-size="12" fill="#60a5fa">  const</text>
  <text x="94" y="330" font-family="monospace" font-size="12" fill="white"> [loading, setLoading] =</text>
  <text x="58" y="348" font-family="monospace" font-size="12" fill="#fbbf24">    useState</text>
  <text x="112" y="348" font-family="monospace" font-size="12" fill="white">(</text>
  <text x="118" y="348" font-family="monospace" font-size="12" fill="#f59e0b">true</text>
  <text x="136" y="348" font-family="monospace" font-size="12" fill="white">);</text>
  <text x="58" y="370" font-family="monospace" font-size="12" fill="#60a5fa">  try</text>
  <text x="82" y="370" font-family="monospace" font-size="12" fill="white"> {</text>
  <text x="58" y="388" font-family="monospace" font-size="12" fill="#60a5fa">    const</text>
  <text x="94" y="388" font-family="monospace" font-size="12" fill="white"> res = </text>
  <text x="124" y="388" font-family="monospace" font-size="12" fill="#60a5fa">await</text>
  <text x="156" y="388" font-family="monospace" font-size="12" fill="#fbbf24"> fetch</text>
  <text x="182" y="388" font-family="monospace" font-size="12" fill="#f59e0b">('/api/users');</text>
  <text x="58" y="408" font-family="monospace" font-size="12" fill="#60a5fa">    if</text>
  <text x="76" y="408" font-family="monospace" font-size="12" fill="white"> (!res.ok)</text>
  <text x="58" y="426" font-family="monospace" font-size="12" fill="#60a5fa">      throw new</text>
  <text x="128" y="426" font-family="monospace" font-size="12" fill="#fbbf24"> Error</text>
  <text x="160" y="426" font-family="monospace" font-size="12" fill="#f59e0b">('Network error');</text>
  <text x="58" y="446" font-family="monospace" font-size="12" fill="#60a5fa">    const</text>
  <text x="94" y="446" font-family="monospace" font-size="12" fill="white"> json = </text>
  <text x="124" y="446" font-family="monospace" font-size="12" fill="#60a5fa">await</text>
  <text x="156" y="446" font-family="monospace" font-size="12" fill="white"> res.</text>
  <text x="172" y="446" font-family="monospace" font-size="12" fill="#fbbf24">json</text>
  <text x="196" y="446" font-family="monospace" font-size="12" fill="white">();</text>
  <text x="58" y="464" font-family="monospace" font-size="12" fill="white">    setData(json);</text>
  <text x="58" y="484" font-family="monospace" font-size="12" fill="#60a5fa">  } catch</text>
  <text x="110" y="484" font-family="monospace" font-size="12" fill="white"> (err) {</text>
  <text x="58" y="502" font-family="monospace" font-size="12" fill="white">    console.</text>
  <text x="118" y="502" font-family="monospace" font-size="12" fill="#fbbf24">error</text>
  <text x="146" y="502" font-family="monospace" font-size="12" fill="white">(err);</text>
  <text x="58" y="520" font-family="monospace" font-size="12" fill="#60a5fa">  } finally</text>
  <text x="113" y="520" font-family="monospace" font-size="12" fill="white"> {</text>
  <text x="58" y="538" font-family="monospace" font-size="12" fill="white">    setLoading(</text>
  <text x="132" y="538" font-family="monospace" font-size="12" fill="#f59e0b">false</text>
  <text x="160" y="538" font-family="monospace" font-size="12" fill="white">);</text>
  <text x="58" y="556" font-family="monospace" font-size="12" fill="white">  }</text>
  <text x="58" y="572" font-family="monospace" font-size="12" fill="white">}</text>
  <!-- Tip panel -->
  <rect x="534" y="204" width="256" height="370" rx="12" fill="#1e293b" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <text x="550" y="234" font-family="system-ui" font-size="13" font-weight="700" fill="white">Métodos HTTP</text>
  <rect x="550" y="248" width="220" height="32" rx="8" fill="rgba(52,211,153,0.1)" stroke="rgba(52,211,153,0.2)" stroke-width="1"/>
  <text x="560" y="269" font-family="monospace" font-size="12" fill="#34d399">GET     fetch(url)</text>
  <rect x="550" y="288" width="220" height="32" rx="8" fill="rgba(96,165,250,0.1)" stroke="rgba(96,165,250,0.2)" stroke-width="1"/>
  <text x="560" y="309" font-family="monospace" font-size="12" fill="#60a5fa">POST    method: 'POST'</text>
  <rect x="550" y="328" width="220" height="32" rx="8" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" stroke-width="1"/>
  <text x="560" y="349" font-family="monospace" font-size="12" fill="#fbbf24">PUT     method: 'PUT'</text>
  <rect x="550" y="368" width="220" height="32" rx="8" fill="rgba(248,113,113,0.1)" stroke="rgba(248,113,113,0.2)" stroke-width="1"/>
  <text x="560" y="389" font-family="monospace" font-size="12" fill="#f87171">DELETE  method: 'DELETE'</text>
  <text x="550" y="424" font-family="system-ui" font-size="13" font-weight="700" fill="white">Headers</text>
  <text x="550" y="444" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">headers: {</text>
  <text x="550" y="462" font-family="monospace" font-size="11" fill="#f59e0b">  'Content-Type':</text>
  <text x="550" y="480" font-family="monospace" font-size="11" fill="#f59e0b">    'application/json',</text>
  <text x="550" y="498" font-family="monospace" font-size="11" fill="white">  Authorization:</text>
  <text x="550" y="516" font-family="monospace" font-size="11" fill="#f59e0b">    \`Bearer \${token}\`,</text>
  <text x="550" y="534" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)">}</text>
</svg>`,

};

// Write files
let count = 0;
for (const [filename, content] of Object.entries(images)) {
  const outPath = path.join(OUT, filename);
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('  OK  ' + filename);
  count++;
}
console.log('\nGenerated ' + count + ' SVG images -> public/uploads/seeds/');
