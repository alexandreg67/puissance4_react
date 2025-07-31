/**
 * Responsive design utilities for cyberpunk Connect Four
 * Optimizes layout and interactions across all device sizes
 */

import { useEffect, useState } from 'react';

// Breakpoint definitions matching Tailwind CSS
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Device type detection
export const getDeviceType = (width: number): 'mobile' | 'tablet' | 'desktop' => {
  if (width < breakpoints.md) return 'mobile';
  if (width < breakpoints.lg) return 'tablet';
  return 'desktop';
};

// Custom hook for responsive behavior
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      setDeviceType(getDeviceType(width));
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isSmallScreen: windowSize.width < breakpoints.lg,
  };
};

// Responsive grid configurations
export const getGridConfig = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  switch (deviceType) {
    case 'mobile':
      return {
        cellSize: 'w-12 h-12 sm:w-16 sm:h-16',
        gap: 'gap-2',
        gridPadding: 'p-4',
        fontSize: 'text-sm',
        iconSize: 'w-4 h-4',
      };
    case 'tablet':
      return {
        cellSize: 'w-16 h-16 md:w-18 md:h-18',
        gap: 'gap-2.5',
        gridPadding: 'p-6',
        fontSize: 'text-base',
        iconSize: 'w-5 h-5',
      };
    case 'desktop':
    default:
      return {
        cellSize: 'w-20 h-20',
        gap: 'gap-3',
        gridPadding: 'p-8',
        fontSize: 'text-lg',
        iconSize: 'w-6 h-6',
      };
  }
};

// Responsive animation configurations
export const getAnimationConfig = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  const baseConfig = {
    mobile: {
      enableComplexAnimations: false,
      pulseIntensity: 'animate-pulse',
      transitionDuration: 'duration-200',
      glowIntensity: 'shadow-lg',
    },
    tablet: {
      enableComplexAnimations: true,
      pulseIntensity: 'animate-neon-pulse',
      transitionDuration: 'duration-300',
      glowIntensity: 'shadow-neon-md',
    },
    desktop: {
      enableComplexAnimations: true,
      pulseIntensity: 'animate-neon-pulse',
      transitionDuration: 'duration-300',
      glowIntensity: 'shadow-neon-lg',
    },
  };

  return baseConfig[deviceType];
};

// Touch vs mouse interaction optimizations
export const getInteractionConfig = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  return {
    tapTargetSize: deviceType === 'mobile' ? 'min-w-12 min-h-12' : 'min-w-8 min-h-8',
    hoverEffects: deviceType === 'desktop',
    touchFeedback: deviceType !== 'desktop',
    focusRing: 'focus:ring-2 focus:ring-neon-cyan/50 focus:outline-none',
  };
};

// Responsive text scaling
export const getTextConfig = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  switch (deviceType) {
    case 'mobile':
      return {
        title: 'text-3xl sm:text-4xl',
        subtitle: 'text-lg sm:text-xl',
        body: 'text-sm sm:text-base',
        caption: 'text-xs',
        button: 'text-sm font-semibold',
      };
    case 'tablet':
      return {
        title: 'text-4xl md:text-5xl',
        subtitle: 'text-xl md:text-2xl',
        body: 'text-base md:text-lg',
        caption: 'text-sm',
        button: 'text-base font-semibold',
      };
    case 'desktop':
    default:
      return {
        title: 'text-6xl md:text-7xl',
        subtitle: 'text-2xl md:text-3xl',
        body: 'text-lg',
        caption: 'text-base',
        button: 'text-lg font-bold',
      };
  }
};

// Spacing configurations for different screen sizes
export const getSpacingConfig = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  switch (deviceType) {
    case 'mobile':
      return {
        containerPadding: 'px-4 py-4',
        sectionSpacing: 'space-y-4',
        cardPadding: 'p-4',
        buttonPadding: 'px-4 py-2',
      };
    case 'tablet':
      return {
        containerPadding: 'px-6 py-6',
        sectionSpacing: 'space-y-6',
        cardPadding: 'p-6',
        buttonPadding: 'px-6 py-3',
      };
    case 'desktop':
    default:
      return {
        containerPadding: 'px-8 py-8',
        sectionSpacing: 'space-y-8',
        cardPadding: 'p-8',
        buttonPadding: 'px-8 py-4',
      };
  }
};

// Layout configurations
export const getLayoutConfig = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  return {
    scoreboardLayout: deviceType === 'mobile' ? 'flex-col space-y-4' : 'flex-row space-x-8',
    gameControlsLayout: deviceType === 'mobile' ? 'flex-col space-y-3' : 'flex-row space-x-6',
    maxWidth: deviceType === 'mobile' ? 'max-w-sm' : deviceType === 'tablet' ? 'max-w-2xl' : 'max-w-5xl',
  };
};