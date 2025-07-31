/**
 * Responsive design utilities for cyberpunk Connect Four
 * Optimizes layout and interactions across all device sizes
 */

import { useEffect, useState } from 'react';

// Helper function to check if window is available (SSR safety)
export const isWindowAvailable = (): boolean => {
  return typeof window !== 'undefined';
};

// Helper function to get window dimensions safely
export const getWindowDimensions = () => {
  if (!isWindowAvailable()) {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Helper function to determine screen size category based on width
export const getScreenSize = (width: number): 'ultra-small' | 'small-mobile' | 'mobile' | 'tablet' | 'desktop' => {
  if (width < RESPONSIVE_THRESHOLDS.ULTRA_SMALL_WIDTH) return 'ultra-small';
  if (width < RESPONSIVE_THRESHOLDS.SMALL_MOBILE_WIDTH) return 'small-mobile';
  if (width < RESPONSIVE_THRESHOLDS.MOBILE_BOUNDARY) return 'mobile';
  if (width < RESPONSIVE_THRESHOLDS.TABLET_BOUNDARY) return 'tablet';
  return 'desktop';
};

// Helper function to check if device needs reduced effects
export const shouldReduceEffects = (deviceType: string, width: number): boolean => {
  return deviceType === 'mobile' && width < RESPONSIVE_THRESHOLDS.SMALL_MOBILE_WIDTH;
};

// Breakpoint definitions matching Tailwind CSS
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Magic numbers extracted as constants for maintainability
export const RESPONSIVE_THRESHOLDS = {
  ULTRA_SMALL_WIDTH: 375,
  SMALL_MOBILE_WIDTH: 428,
  MOBILE_BOUNDARY: breakpoints.md,
  TABLET_BOUNDARY: breakpoints.lg,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Device type detection
export const getDeviceType = (width: number): 'mobile' | 'tablet' | 'desktop' => {
  if (width < RESPONSIVE_THRESHOLDS.MOBILE_BOUNDARY) return 'mobile';
  if (width < RESPONSIVE_THRESHOLDS.TABLET_BOUNDARY) return 'tablet';
  return 'desktop';
};

// Custom hook for responsive behavior
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState(getWindowDimensions);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    if (!isWindowAvailable()) return;

    const handleResize = () => {
      const dimensions = getWindowDimensions();
      setWindowSize(dimensions);
      setDeviceType(getDeviceType(dimensions.width));
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

// Responsive grid configurations with viewport awareness
export const getGridConfig = (deviceType: 'mobile' | 'tablet' | 'desktop', windowWidth?: number) => {
  switch (deviceType) {
    case 'mobile':
      // Extra small screens (< 375px) - ultra compact to prevent overlap
      if (windowWidth && windowWidth < RESPONSIVE_THRESHOLDS.ULTRA_SMALL_WIDTH) {
        // Available width ≈ 320px - padding = ~300px
        // 7 cells × 20px + 6 gaps × 6px = 140px + 36px = 176px (plenty of space)
        return {
          cellSize: 'w-5 h-5',
          gap: 'gap-1.5',
          gridPadding: 'p-3',
          fontSize: 'text-xs',
          iconSize: 'w-3 h-3',
        };
      }
      // Very small screens (375px - 428px) - iPhone size optimization
      if (windowWidth && windowWidth < RESPONSIVE_THRESHOLDS.SMALL_MOBILE_WIDTH) {
        // Available width ≈ 375px - padding = ~350px
        // 7 cells × 24px + 6 gaps × 8px = 168px + 48px = 216px (comfortable fit)
        return {
          cellSize: 'w-6 h-6',
          gap: 'gap-2',
          gridPadding: 'p-4',
          fontSize: 'text-xs',
          iconSize: 'w-3 h-3',
        };
      }
      // Small screens (428px - 640px) - standard mobile with more spacing
      return {
        cellSize: 'w-8 h-8 sm:w-10 sm:h-10',
        gap: 'gap-2.5 sm:gap-3',
        gridPadding: 'p-4 sm:p-6',
        fontSize: 'text-sm',
        iconSize: 'w-4 h-4',
      };
    case 'tablet':
      return {
        cellSize: 'w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18',
        gap: 'gap-2 md:gap-2.5',
        gridPadding: 'p-4 md:p-6',
        fontSize: 'text-base',
        iconSize: 'w-5 h-5',
      };
    case 'desktop':
    default:
      return {
        cellSize: 'w-18 h-18 lg:w-20 lg:h-20',
        gap: 'gap-2.5 lg:gap-3',
        gridPadding: 'p-6 lg:p-8',
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

// Responsive text scaling with viewport awareness
export const getTextConfig = (deviceType: 'mobile' | 'tablet' | 'desktop', windowWidth?: number) => {
  switch (deviceType) {
    case 'mobile':
      // Extra small screens need even smaller text
      if (windowWidth && windowWidth < RESPONSIVE_THRESHOLDS.ULTRA_SMALL_WIDTH) {
        return {
          title: 'text-2xl xs:text-3xl sm:text-4xl',
          subtitle: 'text-base xs:text-lg sm:text-xl',
          body: 'text-xs xs:text-sm sm:text-base',
          caption: 'text-xs',
          button: 'text-xs xs:text-sm font-semibold',
        };
      }
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
        title: 'text-5xl lg:text-6xl xl:text-7xl',
        subtitle: 'text-xl lg:text-2xl xl:text-3xl',
        body: 'text-lg',
        caption: 'text-base',
        button: 'text-lg font-bold',
      };
  }
};

// Spacing configurations for different screen sizes with viewport awareness
export const getSpacingConfig = (deviceType: 'mobile' | 'tablet' | 'desktop', windowWidth?: number) => {
  switch (deviceType) {
    case 'mobile':
      // Extra small screens need minimal spacing
      if (windowWidth && windowWidth < RESPONSIVE_THRESHOLDS.ULTRA_SMALL_WIDTH) {
        return {
          containerPadding: 'px-2 py-2 xs:px-4 xs:py-4',
          sectionSpacing: 'space-y-2 xs:space-y-3 sm:space-y-4',
          cardPadding: 'p-2 xs:p-3 sm:p-4',
          buttonPadding: 'px-3 py-1.5 xs:px-4 xs:py-2',
        };
      }
      return {
        containerPadding: 'px-3 py-3 sm:px-4 sm:py-4',
        sectionSpacing: 'space-y-3 sm:space-y-4',
        cardPadding: 'p-3 sm:p-4',
        buttonPadding: 'px-4 py-2',
      };
    case 'tablet':
      return {
        containerPadding: 'px-4 py-4 md:px-6 md:py-6',
        sectionSpacing: 'space-y-4 md:space-y-6',
        cardPadding: 'p-4 md:p-6',
        buttonPadding: 'px-6 py-3',
      };
    case 'desktop':
    default:
      return {
        containerPadding: 'px-6 py-6 lg:px-8 lg:py-8',
        sectionSpacing: 'space-y-6 lg:space-y-8',
        cardPadding: 'p-6 lg:p-8',
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