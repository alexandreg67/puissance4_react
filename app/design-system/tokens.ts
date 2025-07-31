/**
 * Neon Futuristic Design System - Design Tokens
 * 
 * This file defines the core design tokens for the cyberpunk/neon theme
 * following modern design system principles for consistency and scalability.
 */

// Color Palette - Neon Cyberpunk Theme
export const colors = {
  // Primary Neon Colors
  neon: {
    cyan: '#00FFFF',
    magenta: '#FF00FF', 
    blue: '#0066FF',
    green: '#00FF41',
    orange: '#FF6600',
    yellow: '#FFFF00',
    purple: '#8B00FF',
    pink: '#FF1493'
  },
  
  // Dark Foundation
  dark: {
    space: '#0A0A0A',
    void: '#000814', 
    matter: '#1A0D2E',
    metal: '#161B22',
    obsidian: '#0F1419',
    charcoal: '#1C1C1C'
  },
  
  // Neutral Tones
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9', 
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  },
  
  // Semantic Colors
  semantic: {
    success: '#00FF41',
    warning: '#FFFF00',
    error: '#FF006E',
    info: '#00FFFF'
  }
} as const;

// Typography Scale
export const typography = {
  fontFamily: {
    mono: ['Space Mono', 'Courier New', 'monospace'],
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Orbitron', 'Space Mono', 'monospace']
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px  
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem'   // 72px
  },
  
  fontWeight: {
    light: '300',
    normal: '400', 
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
} as const;

// Spacing Scale
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem'      // 384px
} as const;

// Shadow System - Neon Glow Effects
export const shadows = {
  // Standard shadows
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // Neon glow shadows
  neon: {
    sm: '0 0 5px currentColor',
    md: '0 0 10px currentColor, 0 0 20px currentColor',
    lg: '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor',
    xl: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor, 0 0 80px currentColor',
    
    // Color-specific neon glows
    cyan: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
    magenta: '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF',
    blue: '0 0 10px #0066FF, 0 0 20px #0066FF, 0 0 30px #0066FF',
    green: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41'
  },
  
  // Inner glow effects
  inner: {
    sm: 'inset 0 0 5px currentColor',
    md: 'inset 0 0 10px currentColor',
    lg: 'inset 0 0 15px currentColor'
  }
} as const;

// Text Shadow Effects - Neon Glow for Typography
export const textShadows = {
  // Standard text shadows
  sm: '0 0 5px currentColor',
  md: '0 0 10px currentColor, 0 0 20px currentColor',
  lg: '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor',
  xl: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor',
  
  // Ultra-intense neon effect - extracted for reusability
  intense: `0 0 7px currentColor,
    0 0 10px currentColor,
    0 0 21px currentColor,
    0 0 42px currentColor,
    0 0 82px currentColor,
    0 0 92px currentColor,
    0 0 102px currentColor,
    0 0 151px currentColor`
} as const;

// Border Radius
export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
} as const;

// Animation Timing
export const timing = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Custom cyberpunk easing
    cyber: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    neon: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Z-Index Scale  
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
  
  // Semantic z-index
  dropdown: '100',
  modal: '200',
  popover: '300',
  tooltip: '400',
  toast: '500'
} as const;

// Export all tokens
export const designTokens = {
  colors,
  typography,
  spacing,
  shadows,
  textShadows,
  borderRadius,
  timing,
  breakpoints,
  zIndex
} as const;

export type DesignTokens = typeof designTokens;
export type ColorTokens = typeof colors;
export type TypographyTokens = typeof typography;
export type SpacingTokens = typeof spacing;
export type ShadowTokens = typeof shadows;