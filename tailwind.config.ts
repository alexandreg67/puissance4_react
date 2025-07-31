import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";
import { designTokens } from "./app/design-system/tokens";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add extra small breakpoint for better mobile support
      screens: {
        'xs': '375px',
      },
      
      // Neon Futuristic Color Palette
      colors: {
        // Primary neon colors
        'neon-cyan': designTokens.colors.neon.cyan,
        'neon-magenta': designTokens.colors.neon.magenta,
        'neon-blue': designTokens.colors.neon.blue,
        'neon-green': designTokens.colors.neon.green,
        'neon-orange': designTokens.colors.neon.orange,
        'neon-yellow': designTokens.colors.neon.yellow,
        'neon-purple': designTokens.colors.neon.purple,
        'neon-pink': designTokens.colors.neon.pink,
        
        // Dark foundation colors
        'cyber-space': designTokens.colors.dark.space,
        'cyber-void': designTokens.colors.dark.void,
        'cyber-matter': designTokens.colors.dark.matter,
        'cyber-metal': designTokens.colors.dark.metal,
        'cyber-obsidian': designTokens.colors.dark.obsidian,
        'cyber-charcoal': designTokens.colors.dark.charcoal,
        
        // Semantic colors
        'success-neon': designTokens.colors.semantic.success,
        'warning-neon': designTokens.colors.semantic.warning,
        'error-neon': designTokens.colors.semantic.error,
        'info-neon': designTokens.colors.semantic.info,
      },
      
      // Typography
      fontFamily: {
        'mono': [...designTokens.typography.fontFamily.mono],
        'display': [...designTokens.typography.fontFamily.display],
      },
      
      letterSpacing: designTokens.typography.letterSpacing,
      
      // Neon Glow Box Shadows
      boxShadow: {
        'neon-sm': designTokens.shadows.neon.sm,
        'neon-md': designTokens.shadows.neon.md,
        'neon-lg': designTokens.shadows.neon.lg,
        'neon-xl': designTokens.shadows.neon.xl,
        
        // Color-specific glows
        'neon-cyan': designTokens.shadows.neon.cyan,
        'neon-magenta': designTokens.shadows.neon.magenta,
        'neon-blue': designTokens.shadows.neon.blue,
        'neon-green': designTokens.shadows.neon.green,
        
        // Inner glow effects
        'inner-sm': designTokens.shadows.inner.sm,
        'inner-md': designTokens.shadows.inner.md,
        'inner-lg': designTokens.shadows.inner.lg,
      },
      
      // Neon Text Shadows
      textShadow: {
        'neon-sm': '0 0 5px currentColor',
        'neon-md': '0 0 10px currentColor, 0 0 20px currentColor',
        'neon-lg': '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor',
        'neon-xl': '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor',
        
        // Multi-layer neon text effects
        'neon-intense': `
          0 0 7px currentColor,
          0 0 10px currentColor,
          0 0 21px currentColor,
          0 0 42px currentColor,
          0 0 82px currentColor,
          0 0 92px currentColor,
          0 0 102px currentColor,
          0 0 151px currentColor
        `,
      },
      
      // Custom Animations
      keyframes: {
        // Neon pulsing effect
        'neon-pulse': {
          '0%, 100%': { 
            filter: 'brightness(1) drop-shadow(0 0 5px currentColor)',
            opacity: '1'
          },
          '50%': { 
            filter: 'brightness(1.2) drop-shadow(0 0 15px currentColor)',
            opacity: '0.9'
          }
        },
        
        // Piece drop animation with glow
        'piece-drop-glow': {
          '0%': { 
            transform: 'translateY(-100px) scale(0.8)',
            opacity: '0',
            filter: 'drop-shadow(0 0 0px currentColor)'
          },
          '50%': {
            transform: 'translateY(10px) scale(1.1)',
            opacity: '0.7',
            filter: 'drop-shadow(0 0 10px currentColor)'
          },
          '100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '1',
            filter: 'drop-shadow(0 0 5px currentColor)'
          }
        },
        
        // Flicker effect for cyberpunk aesthetics
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '10%': { opacity: '0.9' },
          '20%': { opacity: '1' },
          '30%': { opacity: '0.8' },
          '40%': { opacity: '1' },
          '50%': { opacity: '0.95' },
          '60%': { opacity: '1' },
          '70%': { opacity: '0.85' },
          '80%': { opacity: '1' },
          '90%': { opacity: '0.9' }
        },
        
        // Matrix-style text reveal
        'matrix-reveal': {
          '0%': { 
            transform: 'translateY(20px)',
            opacity: '0',
            filter: 'blur(10px)'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1',
            filter: 'blur(0px)'
          }
        },
        
        // Hologram effect
        'hologram': {
          '0%, 100%': { 
            transform: 'translateX(0)',
            filter: 'hue-rotate(0deg)'
          },
          '25%': { 
            transform: 'translateX(1px)',
            filter: 'hue-rotate(90deg)'
          },
          '50%': { 
            transform: 'translateX(-1px)',
            filter: 'hue-rotate(180deg)'
          },
          '75%': { 
            transform: 'translateX(1px)',
            filter: 'hue-rotate(270deg)'
          }
        },
        
        // Winning sequence animation
        'victory-glow': {
          '0%': { 
            boxShadow: '0 0 5px currentColor',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px currentColor, 0 0 60px currentColor',
            transform: 'scale(1.05)'
          },
          '100%': { 
            boxShadow: '0 0 20px currentColor',
            transform: 'scale(1)'
          }
        }
      },
      
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'piece-drop': 'piece-drop-glow 0.6s ease-out forwards',
        'neon-flicker': 'neon-flicker 0.15s ease-in-out infinite alternate',
        'matrix-reveal': 'matrix-reveal 0.8s ease-out forwards',
        'hologram': 'hologram 3s ease-in-out infinite',
        'victory-glow': 'victory-glow 1s ease-in-out infinite',
        
        // Slower/faster variants
        'neon-pulse-slow': 'neon-pulse 3s ease-in-out infinite alternate',
        'neon-pulse-fast': 'neon-pulse 1s ease-in-out infinite alternate',
      },
      
      // Background gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        
        // Cyberpunk gradients
        'cyber-grid': `
          linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
        `,
        'neon-gradient-1': 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
        'neon-gradient-2': 'linear-gradient(45deg, #0066FF 0%, #FF6600 50%, #00FF41 100%)',
        'matrix-gradient': 'linear-gradient(180deg, #000814 0%, #1A0D2E 100%)',
        'hologram-gradient': 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%)',
      },
      
      // Background sizes for grid effects
      backgroundSize: {
        'cyber-grid': '20px 20px'
      },
      
      // Transform origins for better animations
      transformOrigin: {
        'center-bottom': 'center bottom',
      }
    },
  },
  plugins: [
    // Plugin to add text-shadow utilities with proper TypeScript typing
    function({ addUtilities }: PluginAPI) {
      const textShadowUtilities: Record<string, { textShadow: string }> = {
        '.text-shadow-neon-sm': {
          textShadow: '0 0 5px currentColor'
        },
        '.text-shadow-neon-md': {
          textShadow: '0 0 10px currentColor, 0 0 20px currentColor'
        },
        '.text-shadow-neon-lg': {
          textShadow: '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor'
        },
        '.text-shadow-neon-xl': {
          textShadow: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor'
        },
        '.text-shadow-neon-intense': {
          textShadow: `
            0 0 7px currentColor,
            0 0 10px currentColor,
            0 0 21px currentColor,
            0 0 42px currentColor,
            0 0 82px currentColor,
            0 0 92px currentColor,
            0 0 102px currentColor,
            0 0 151px currentColor
          `
        }
      };
      
      addUtilities(textShadowUtilities);
    }
  ],
};

export default config;
