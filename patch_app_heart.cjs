const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const svgCode = `
              <svg width="48" height="48" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0H3V1H1V0ZM5 0H7V1H5V0ZM0 1H1V4H0V1ZM7 1H8V4H7V1ZM3 1H5V2H3V1ZM1 4H2V5H1V4ZM6 4H7V5H6V4ZM2 5H3V6H2V5ZM5 5H6V6H5V5ZM3 6H5V7H3V6Z" fill="currentColor"/>
                <path d="M1 1H3V2H5V1H7V4H6V5H5V6H3V5H2V4H1V1Z" fill="currentColor"/>
              </svg>`;
// Actually, even simpler SVG that draws exactly those pixels:
const pixelSvg = `
              <svg width="48" height="48" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{ color: progress.customization.soulColor || '#ef4444' }}>
                <path d="M1 0h2v1H1zM5 0h2v1H5zM0 1h1v3H0zM7 1h1v3H7zM3 1h2v1H3zM1 4h1v1H1zM6 4h1v1H6zM2 5h1v1H2zM5 5h1v1H5zM3 6h2v1H3z" fill="currentColor"/>
                <path d="M1 1h2v1h2V1h2v3H6v1H5v1H3V5H2V4H1V1z" fill="currentColor"/>
              </svg>
`;

const target = `            <div className="text-white text-6xl animate-ping flex items-center justify-center absolute">
              <span style={{ color: progress.customization.soulColor || '#ef4444' }}>♥</span>
            </div>
            <div className="text-white text-6xl flex items-center justify-center absolute">
              <span style={{ color: progress.customization.soulColor || '#ef4444' }}>♥</span>
            </div>`;

const replacement = `            <div className="animate-ping flex items-center justify-center absolute">
              <svg width="64" height="64" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{ color: progress.customization.soulColor || '#ef4444' }}>
                <rect x="1" y="0" width="2" height="1" fill="currentColor"/>
                <rect x="5" y="0" width="2" height="1" fill="currentColor"/>
                <rect x="0" y="1" width="8" height="3" fill="currentColor"/>
                <rect x="1" y="4" width="6" height="1" fill="currentColor"/>
                <rect x="2" y="5" width="4" height="1" fill="currentColor"/>
                <rect x="3" y="6" width="2" height="1" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center justify-center absolute">
              <svg width="64" height="64" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{ color: progress.customization.soulColor || '#ef4444' }}>
                <rect x="1" y="0" width="2" height="1" fill="currentColor"/>
                <rect x="5" y="0" width="2" height="1" fill="currentColor"/>
                <rect x="0" y="1" width="8" height="3" fill="currentColor"/>
                <rect x="1" y="4" width="6" height="1" fill="currentColor"/>
                <rect x="2" y="5" width="4" height="1" fill="currentColor"/>
                <rect x="3" y="6" width="2" height="1" fill="currentColor"/>
              </svg>
            </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
console.log('Patched SVG hearts');
