// Prevent Flash of Default Theme (FODT)
(function() {
  const themes = {
    vanilla: {
      '--color-bg': '#faf9f6',
      '--color-border': '#000000',
      '--color-accent-yellow': '#fde047',
      '--color-accent-cyan': '#22d3ee',
      '--color-accent-green': '#4ade80',
      '--color-accent-pink': '#fb7185',
      '--color-text': '#000000',
      '--color-text-main': '#1f2937',
      '--color-text-muted': '#4b5563',
      '--color-card-bg': '#ffffff'
    },
    terminal: {
      '--color-bg': '#070a0e',
      '--color-border': '#39ff14',
      '--color-accent-yellow': '#00ffcc',
      '--color-accent-cyan': '#00ffff',
      '--color-accent-green': '#39ff14',
      '--color-accent-pink': '#ff0055',
      '--color-text': '#39ff14',
      '--color-text-main': '#ffffff',
      '--color-text-muted': '#88ff88',
      '--color-card-bg': '#0d131a'
    },
    cyberpunk: {
      '--color-bg': '#190225',
      '--color-border': '#00ffff',
      '--color-accent-yellow': '#ffff00',
      '--color-accent-cyan': '#00ffff',
      '--color-accent-green': '#39ff14',
      '--color-accent-pink': '#ff007f',
      '--color-text': '#ffffff',
      '--color-text-main': '#ffffff',
      '--color-text-muted': '#b19ffb',
      '--color-card-bg': '#2b093d'
    },
    retro: {
      '--color-bg': '#8bac0f',
      '--color-border': '#0f380f',
      '--color-accent-yellow': '#9bbc0f',
      '--color-accent-cyan': '#8bac0f',
      '--color-accent-green': '#306230',
      '--color-accent-pink': '#0f380f',
      '--color-text': '#0f380f',
      '--color-text-main': '#0f380f',
      '--color-text-muted': '#306230',
      '--color-card-bg': '#9bbc0f'
    }
  };
  const urlParams = new URLSearchParams(window.location.search);
  const queryTheme = urlParams.get('theme');
  const savedTheme = queryTheme || localStorage.getItem('max-portfolio-theme') || 'vanilla';
  const themeProps = themes[savedTheme] || themes.vanilla;
  const root = document.documentElement;
  Object.keys(themeProps).forEach(prop => {
    root.style.setProperty(prop, themeProps[prop]);
  });
})();
