// Theme color palettes

export const themes = {
  gruvbox: {
    light: {
      bg0: "#fbf1c7",
      bg0_h: "#f9f5d7",
      bg1: "#ebdbb2",
      bg2: "#d5c4a1",
      fg: "#3c3836",
      fg1: "#504945",
      gray: "#7c6f64",
      red: "#cc241d",
      green: "#98971a",
      yellow: "#d79921",
      blue: "#458588",
      purple: "#b16286",
      aqua: "#689d6a",
      orange: "#d65d0e",
    },
    dark: {
      bg0: "#282828",
      bg0_h: "#1d2021",
      bg1: "#3c3836",
      bg2: "#504945",
      fg: "#ebdbb2",
      fg1: "#d5c4a1",
      gray: "#928374",
      red: "#fb4934",
      green: "#b8bb26",
      yellow: "#fabd2f",
      blue: "#83a598",
      purple: "#d3869b",
      aqua: "#8ec07c",
      orange: "#fe8019",
    },
  },
  catppuccin: {
    light: {
      bg0: "#eff1f5",
      bg0_h: "#e6e9ef",
      bg1: "#dce0e8",
      bg2: "#ccd0da",
      fg: "#4c4f69",
      fg1: "#5c5f77",
      gray: "#6c6f85",
      red: "#d20f39",
      green: "#40a02b",
      yellow: "#df8e1d",
      blue: "#1e66f5",
      purple: "#8839ef",
      aqua: "#179299",
      orange: "#fe640b",
    },
    dark: {
      bg0: "#1e1e2e",
      bg0_h: "#181825",
      bg1: "#313244",
      bg2: "#45475a",
      fg: "#cdd6f4",
      fg1: "#bac2de",
      gray: "#a6adc8",
      red: "#f38ba8",
      green: "#a6e3a1",
      yellow: "#f9e2af",
      blue: "#89b4fa",
      purple: "#cba6f7",
      aqua: "#94e2d5",
      orange: "#fab387",
    },
  },
  monokai: {
    light: {
      bg0: "#f8f8f2",
      bg0_h: "#f5f5f0",
      bg1: "#e8e8e3",
      bg2: "#d8d8d3",
      fg: "#272822",
      fg1: "#49483e",
      gray: "#75715e",
      red: "#f92672",
      green: "#a6e22e",
      yellow: "#e6db74",
      blue: "#66d9ef",
      purple: "#ae81ff",
      aqua: "#a1efe4",
      orange: "#fd971f",
    },
    dark: {
      bg0: "#272822",
      bg0_h: "#1e1f1c",
      bg1: "#3e3d32",
      bg2: "#49483e",
      fg: "#f8f8f2",
      fg1: "#f5f4f1",
      gray: "#75715e",
      red: "#f92672",
      green: "#a6e22e",
      yellow: "#e6db74",
      blue: "#66d9ef",
      purple: "#ae81ff",
      aqua: "#a1efe4",
      orange: "#fd971f",
    },
  },
  flexbox: {
    light: {
      bg0: "#ffffff",
      bg0_h: "#f5f5f5",
      bg1: "#e0e0e0",
      bg2: "#bdbdbd",
      fg: "#212121",
      fg1: "#424242",
      gray: "#757575",
      red: "#e91e63",
      green: "#4caf50",
      yellow: "#ffc107",
      blue: "#2196f3",
      purple: "#9c27b0",
      aqua: "#00bcd4",
      orange: "#ff9800",
    },
    dark: {
      bg0: "#121212",
      bg0_h: "#000000",
      bg1: "#1e1e1e",
      bg2: "#2d2d2d",
      fg: "#ffffff",
      fg1: "#e0e0e0",
      gray: "#9e9e9e",
      red: "#f48fb1",
      green: "#81c784",
      yellow: "#fff176",
      blue: "#64b5f6",
      purple: "#ba68c8",
      aqua: "#4dd0e1",
      orange: "#ffb74d",
    },
  },
  everforest: {
    light: {
      bg0: "#fdf6e3",
      bg0_h: "#f3ead3",
      bg1: "#efebd4",
      bg2: "#e0ddc7",
      fg: "#5c6a72",
      fg1: "#687068",
      gray: "#829181",
      red: "#f85552",
      green: "#8da101",
      yellow: "#dfa000",
      blue: "#3a94c5",
      purple: "#df69ba",
      aqua: "#35a77c",
      orange: "#f57d26",
    },
    dark: {
      bg0: "#2d353b",
      bg0_h: "#232a2e",
      bg1: "#343f44",
      bg2: "#3d484d",
      fg: "#d3c6aa",
      fg1: "#c9b99a",
      gray: "#859289",
      red: "#e67e80",
      green: "#a7c080",
      yellow: "#dbbc7f",
      blue: "#7fbbb3",
      purple: "#d699b6",
      aqua: "#83c092",
      orange: "#e69875",
    },
  },
};

// Convert theme keys to CSS variable names (bg0 -> bg-0, bg0_h -> bg-0-h, etc.)
const toKebabCase = (str) => {
  // Handle special case: add hyphen before numbers after letters (bg0 -> bg-0)
  return str
    .replace(/_/g, '-')           // Replace underscores with hyphens
    .replace(/([a-z])(\d)/g, '$1-$2') // Add hyphen before numbers after letters
    .toLowerCase();
};

export const applyTheme = (themeName, mode) => {
  const root = document.documentElement;
  // Normalize theme name (case-insensitive)
  const normalizedThemeName = themeName?.toLowerCase() || "gruvbox";
  const theme = themes[normalizedThemeName]?.[mode];
  
  if (!theme) {
    console.warn(`Theme ${normalizedThemeName} with mode ${mode} not found, using gruvbox`);
    const fallbackTheme = themes.gruvbox[mode] || themes.gruvbox.light;
    Object.entries(fallbackTheme).forEach(([key, value]) => {
      const cssVarName = toKebabCase(key);
      root.style.setProperty(`--${cssVarName}`, value);
    });
  } else {
    // Apply CSS variables - convert keys to kebab-case (bg0 -> bg-0, bg0_h -> bg-0-h)
    Object.entries(theme).forEach(([key, value]) => {
      const cssVarName = toKebabCase(key);
      root.style.setProperty(`--${cssVarName}`, value);
    });
  }
  
  // Update body class for dark mode
  if (mode === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
  
  // Update meta theme-color tag dynamically
  const bgColor = root.style.getPropertyValue("--bg-0") || theme?.bg0 || "#fbf1c7";
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", bgColor);
  
  console.log(`[THEME] Applied theme: ${normalizedThemeName}, mode: ${mode}, bg0: ${bgColor}`);
};

export const getSystemMode = () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

