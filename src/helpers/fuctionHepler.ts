export const getDeviceType = () => {
    const isMobile = window.matchMedia('(max-width: 464px)').matches;
    const isTablet = window.matchMedia('(min-width: 464px) and (max-width: 1024px)').matches;
    const isdesktop1 = window.matchMedia('(min-width: 1024px) and (max-width: 1550px)').matches;
    if (isMobile) {
      return 'mobile';
    } else if (isTablet) {
      return 'tablet';
    }else if (isdesktop1) {
      return 'desktop1';
    } else {
      return 'desktop';
    }
  };