/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gruvbox Dark
        gruvbox: {
          dark: {
            bg0: '#282828',
            bg0_h: '#1d2021',
            bg1: '#3c3836',
            bg2: '#504945',
            fg: '#ebdbb2',
            fg1: '#d5c4a1',
            gray: '#928374',
            red: '#fb4934',
            green: '#b8bb26',
            yellow: '#fabd2f',
            blue: '#83a598',
            purple: '#d3869b',
            aqua: '#8ec07c',
            orange: '#fe8019',
          },
          light: {
            bg0: '#fbf1c7',
            bg0_h: '#f9f5d7',
            bg1: '#ebdbb2',
            bg2: '#d5c4a1',
            fg: '#3c3836',
            fg1: '#504945',
            gray: '#7c6f64',
            red: '#cc241d',
            green: '#98971a',
            yellow: '#d79921',
            blue: '#458588',
            purple: '#b16286',
            aqua: '#689d6a',
            orange: '#d65d0e',
          },
        },
      },
    },
  },
};

