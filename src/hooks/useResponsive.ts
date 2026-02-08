import { useMediaQuery } from 'react-responsive';

/**
 * Custom hook for responsive breakpoints
 * Provides consistent breakpoints across the application
 */
export const useResponsive = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  const isPortrait = useMediaQuery({ orientation: 'portrait' });
  const isLandscape = useMediaQuery({ orientation: 'landscape' });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    // Convenience flags
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  };
};

/**
 * Breakpoint constants for use in CSS-in-JS or inline styles
 */
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025,
} as const;
