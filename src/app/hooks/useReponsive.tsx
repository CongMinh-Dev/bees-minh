import { useState, useEffect } from 'react';

interface ResponsiveValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const useReponsive = (): ResponsiveValues => {
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);

  const updateResponsiveValues = (width: number | undefined): ResponsiveValues => {
    if (width === undefined) {
      return { isMobile: false, isTablet: false, isDesktop: false };
    }
    const mobileBreakpoint = 768;
    const tabletBreakpoint = 992;
    const isMobile = width < mobileBreakpoint;
    const isTablet = width >= mobileBreakpoint && width < tabletBreakpoint;
    const isDesktop = width >= tabletBreakpoint;
    
    return { isMobile, isTablet, isDesktop };
  };

  const [responsiveValues, setResponsiveValues] = useState<ResponsiveValues>(
    updateResponsiveValues(screenWidth)
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleWindowSizeChange = () => {
        setScreenWidth(window.innerWidth);
      };
      setScreenWidth(window.innerWidth); // Set initial width on client-side
      window.addEventListener('resize', handleWindowSizeChange);

      return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
      };
    }
  }, []);

  useEffect(() => {
    setResponsiveValues(updateResponsiveValues(screenWidth));
  }, [screenWidth]);

  return responsiveValues;
};

export default useReponsive;