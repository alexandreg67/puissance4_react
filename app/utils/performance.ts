/**
 * Performance utilities for cyberpunk Connect Four
 * Optimized for 60fps animations and smooth neon effects
 *
 * NOTE: These utilities are currently not used in the main application
 * but are available for future performance optimizations.
 * Consider implementing them when adding complex animations or
 * when performance issues are detected.
 */

// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Monitor FPS and adjust animation complexity if needed
  measureFPS(): number {
    const now = performance.now();
    this.frameCount++;

    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
    }

    return this.fps;
  }

  // Detect if we should use reduced motion for performance
  shouldUseReducedMotion(): boolean {
    if (typeof window === "undefined") return false;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowFPS = this.fps > 0 && this.fps < 30;

    return mediaQuery.matches || lowFPS;
  }

  // GPU acceleration utilities
  static enableGPUAcceleration(element: HTMLElement): void {
    element.style.transform = "translateZ(0)";
    element.style.backfaceVisibility = "hidden";
    element.style.webkitBackfaceVisibility = "hidden";
    element.style.willChange = "transform, opacity";
  }

  static disableGPUAcceleration(element: HTMLElement): void {
    element.style.willChange = "auto";
  }
}

// Intersection Observer for animation optimization
export const createAnimationObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void
): IntersectionObserver | null => {
  if (typeof window === "undefined") return null;

  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
  });
};

// Debounced resize handler for responsive optimizations
export const createResizeHandler = (
  callback: () => void,
  delay = 250
): (() => void) => {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// Optimized animation frame scheduler
export const scheduleAnimation = (callback: () => void): number => {
  if (typeof window === "undefined") return 0;

  return requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
};

// Memory cleanup for animations
export const cleanupAnimations = (elements: HTMLElement[]): void => {
  elements.forEach((element) => {
    PerformanceMonitor.disableGPUAcceleration(element);
    element.getAnimations?.().forEach((animation) => animation.cancel());
  });
};

// Device capability detection
export const getDeviceCapabilities = () => {
  if (typeof window === "undefined") {
    return {
      isHighPerformance: false,
      supportsGPUAcceleration: false,
      memoryLevel: "low" as const,
    };
  }

  const navigator = window.navigator as any;
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = navigator.deviceMemory || 2;

  return {
    isHighPerformance: hardwareConcurrency >= 4 && deviceMemory >= 4,
    supportsGPUAcceleration:
      "webkitBackfaceVisibility" in document.documentElement.style,
    memoryLevel:
      deviceMemory >= 8
        ? "high"
        : deviceMemory >= 4
        ? "medium"
        : ("low" as const),
  };
};

// CSS animation performance optimization
export const optimizeForPerformance = {
  // Reduce animation complexity on low-end devices
  getAnimationConfig() {
    const capabilities = getDeviceCapabilities();
    const shouldReduceMotion =
      PerformanceMonitor.getInstance().shouldUseReducedMotion();

    if (shouldReduceMotion || !capabilities.isHighPerformance) {
      return {
        enableParticles: false,
        enableComplexGlow: false,
        animationDuration: "1s",
        pulseIntensity: "low",
      };
    }

    return {
      enableParticles: true,
      enableComplexGlow: true,
      animationDuration: "0.3s",
      pulseIntensity: "high",
    };
  },

  // Optimize Tailwind classes based on performance
  getOptimizedClasses(baseClasses: string): string {
    const config = this.getAnimationConfig();

    if (!config.enableComplexGlow) {
      return baseClasses
        .replace(/shadow-neon-\w+/g, "shadow-lg")
        .replace(/animate-neon-pulse(-\w+)?/g, "animate-pulse");
    }

    return baseClasses;
  },
};
