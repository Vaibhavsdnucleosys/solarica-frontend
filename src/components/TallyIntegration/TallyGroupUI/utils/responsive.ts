/**
 * Responsive Design Utilities for TallyPrime UI
 * 
 * Breakpoints:
 * - mobile: < 640px
 * - tablet: 640px - 1024px
 * - desktop: > 1024px
 */

export const breakpoints = {
    mobile: 640,
    tablet: 1024,
    desktop: 1280,
} as const;

/**
 * Hook to detect current screen size
 */
export const useResponsive = () => {
    const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < breakpoints.mobile) {
                setScreenSize('mobile');
            } else if (width < breakpoints.tablet) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isMobile: screenSize === 'mobile',
        isTablet: screenSize === 'tablet',
        isDesktop: screenSize === 'desktop',
        screenSize,
    };
};

/**
 * Responsive class utilities
 */
export const responsive = {
    // Container classes
    container: 'w-full max-w-full px-2 sm:px-4 lg:px-6',

    // Modal widths
    modalSm: 'w-[95vw] sm:w-[450px]',
    modalMd: 'w-[95vw] sm:w-[600px] lg:w-[700px]',
    modalLg: 'w-[95vw] sm:w-[700px] lg:w-[950px]',

    // Text sizes
    textXs: 'text-[10px] sm:text-[11px]',
    textSm: 'text-[11px] sm:text-[12px]',
    textBase: 'text-[12px] sm:text-[13px]',
    textLg: 'text-[13px] sm:text-[14px]',

    // Padding
    paddingSm: 'p-2 sm:p-4',
    paddingMd: 'p-4 sm:p-6 lg:p-8',

    // Sidebar
    sidebar: 'w-[100px] sm:w-[120px] lg:w-[140px]',

    // Header height
    header: 'h-[40px] sm:h-[45px] lg:h-[50px]',

    // Hide on mobile
    hideMobile: 'hidden sm:flex',

    // Show only on mobile
    showMobile: 'flex sm:hidden',

    // Flex direction
    flexCol: 'flex-col lg:flex-row',
    flexRow: 'flex-row',

    // Grid columns
    gridCols1: 'grid-cols-1',
    gridCols2: 'grid-cols-1 sm:grid-cols-2',
    gridCols3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

/**
 * Get responsive value based on screen size
 */
export const getResponsiveValue = <T,>(
    mobile: T,
    tablet: T,
    desktop: T,
    currentSize: 'mobile' | 'tablet' | 'desktop'
): T => {
    switch (currentSize) {
        case 'mobile':
            return mobile;
        case 'tablet':
            return tablet;
        case 'desktop':
            return desktop;
    }
};

import React from 'react';
